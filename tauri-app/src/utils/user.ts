import { Web5, Record as Web5Record } from "@web5/api/browser"
import UserDetailsProtocol, { Record as UserDetailsProtocolRecord, did as UserDetailsProtocolDID } from "./protocols/user";
import _ from "lodash";
import BlobUtils from "./blob";

type Agent = {
  web5: Web5
  did: string
}

type FilterObj = {
  recordId: string,
}

type Type = keyof typeof UserDetailsProtocol["types"]
type Schema<T extends Type> = typeof UserDetailsProtocol["types"][T]["schema"]
type DataFormat<T extends Type> = typeof UserDetailsProtocol["types"][T]["dataFormats"][number]

type FullFilterObj<T extends Type> = {
  protocolPath: T
  schema: Schema<T>
}

type FullMessageObj<T extends Type> = {
  schema: Schema<T>
  protocolPath: T
  dataFormat: DataFormat<T>
  published: typeof UserDetailsProtocol["published"]
}

async function createRecord<T extends Type>(agent: Agent, data: UserDetailsProtocolRecord.Details, message: FullMessageObj<T>) {
  const { record, status } = await agent.web5.dwn.records.create({
    data,
    message: Object.assign({
      ...message,
      protocol: UserDetailsProtocol.protocol,
    })
  });

  if (!record) {
    console.error("Failed to create record:", status)
    return false
  }

  const { status: protocolDwnSyncStatus } = await record.send(UserDetailsProtocolDID)
  if (protocolDwnSyncStatus.code !== 202) {
    console.log("Failed to sync record with protocol remote DWN:", protocolDwnSyncStatus)
  }

  const { status: remoteDwnSyncStatus } = await record.send(agent.did)
  if (remoteDwnSyncStatus.code !== 202) {
    console.log("Failed to sync record with remote DWN:", remoteDwnSyncStatus)
  }

  return record
}

async function fetchRecords<T extends Type>(agent: Agent, filter: FullFilterObj<T>, remote?: boolean) {
  const { records, status } = await agent.web5.dwn.records.query({
    from: remote ? UserDetailsProtocolDID : undefined,
    message: {
      filter: {
        ...filter,
        protocol: UserDetailsProtocol.protocol,
      },
      // @ts-ignore
      dateSort: "createdAscending",
    },
  });

  if (!records) {
    console.log("Failed to fetch records:", status)
    return false
  }
  return records
}

export type CreatePayload = Omit<UserDetailsProtocolRecord.Details, "profilePictureId" | "dateCreated"> & {
  profilePicture: File,
}

async function createUserDetailsRecord(agent: Agent, payload: CreatePayload) {
  const existingRecord = await fetchUserDetailsRecord(agent)
  if (existingRecord) {
    console.error("User details record already exists")
    return false
  }

  const blobRecord = await BlobUtils.createBlobRecord(agent, { file: payload.profilePicture }, true)
  if (!blobRecord) return false

  const { profilePicture, ...restPayload } = payload

  const record = await createRecord(
    agent,
    {
      ...restPayload,
      profilePictureId: blobRecord.id,
      dateCreated: new Date().toISOString()
    },
    {
      schema: UserDetailsProtocol.types.details.schema,
      protocolPath: "details",
      dataFormat: UserDetailsProtocol.types.details.dataFormats[0],
      published: UserDetailsProtocol.published,
    })

  if (!record) {
    console.error("Failed to create document record")
    return false
  }

  return record
}

async function fetchUserDetailsRecord(agent: Agent, remote?: boolean) {
  const records = await fetchRecords(agent, {
    schema: UserDetailsProtocol.types.details.schema,
    protocolPath: "details",
  }, remote)

  if (!records) return false

  return records[0]
}

async function fetchUserDetailsRecords(agent: Agent) {
  return fetchRecords(agent, {
    protocolPath: "details",
    schema: UserDetailsProtocol.types.details.schema,
  }, true)
}

type UpdatePayload = Partial<
  Omit<UserDetailsProtocolRecord.Details, "profilePictureId"> &
  {
    profilePicture: File,
  }
>

async function updateUserDetailsRecord(agent: Agent, idOrRecord: string | Web5Record, payload: Partial<UpdatePayload>) {
  let record: Web5Record

  if (typeof idOrRecord === "string") {
    const fetchedRecord = await fetchUserDetailsRecord(agent)

    if (!fetchedRecord) return false

    record = fetchedRecord
  }
  else {
    record = idOrRecord
  }

  const data: UserDetailsProtocolRecord.Details = await record.data.json()
  const { profilePicture, ...restPayload } = payload

  let profilePictureId = data.profilePictureId
  if (profilePicture) {
    const blobRecord = await BlobUtils.updateBlobRecord(agent, profilePictureId, { file: profilePicture })
    if (!blobRecord) return false

    profilePictureId = blobRecord.id
  }

  const { status } = await record.update({
    data: _.merge(data, Object.assign(restPayload, { profilePictureId }))
  })

  if (status.code !== 202) {
    console.log("Failed to sync document record update with remote DWN:", status)
    return false
  }

  const { status: protocolDwnSyncStatus } = await record.send(UserDetailsProtocolDID)
  if (protocolDwnSyncStatus.code !== 202) {
    console.log("Failed to sync document record update with protocol remote DWN:", protocolDwnSyncStatus)
  }

  return record
}

async function deleteUserDetailsRecord(agent: Agent) {
  const record = await fetchUserDetailsRecord(agent)
  if (!record) return false

  const profile: UserDetailsProtocolRecord.Details = await record.data.json()

  const hasDeletedProfilePictureRecord = await BlobUtils.deleteBlobRecord(agent, profile.profilePictureId)
  if (!hasDeletedProfilePictureRecord) return false

  const { status } = await agent.web5.dwn.records.delete({
    message: {
      recordId: record.id
    }
  })

  if (status.code !== 202) {
    console.log("Failed to delete profile record:", status)
    return false
  }

  return true
}

const UserDetailsUtils = {
  fetchUserDetailsRecord,
  fetchUserDetailsRecords,
  updateUserDetailsRecord,
  createUserDetailsRecord,
  deleteUserDetailsRecord
}

export default UserDetailsUtils
