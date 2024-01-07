import { Web5, Record as Web5Record } from "@web5/api/browser"
import BlobProtocol, { Record, did as BlobProtocolDID } from "./protocols/blob";
import _ from "lodash";

type Agent = {
  web5: Web5
  did: string
}

type FilterObj = {
  recordId: string,
}

type Type = keyof typeof BlobProtocol["types"]
type Schema<T extends Type> = typeof BlobProtocol["types"][T]["schema"]
type DataFormat<T extends Type> = typeof BlobProtocol["types"][T]["dataFormats"][number]

type FullFilterObj<T extends Type> = {
  protocolPath: T
  schema: Schema<T>
}

type FullMessageObj<T extends Type> = {
  schema: Schema<T>
  protocolPath: T
  dataFormat: DataFormat<T>
  published: typeof BlobProtocol["published"]
}

async function createRecord<T extends Type>(agent: Agent, data: Record.Blob, message: FullMessageObj<T>, remote?: boolean) {
  const { record, status } = await agent.web5.dwn.records.create({
    data,
    message: Object.assign({
      ...message,
      protocol: BlobProtocol.protocol,
    })
  });

  if (!record) {
    console.error("Failed to create record:", status)
    return false
  }

  if (remote) {
    const { status: syncStatus } = await record.send(BlobProtocolDID)

    if (syncStatus.code !== 202) {
      console.log("Failed to sync record protocol with remote DWN:", syncStatus)
      return false
    }
  }

  const { status: syncStatus } = await record.send(agent.did)

  if (syncStatus.code !== 202) {
    console.log("Failed to sync record with remote DWN:", syncStatus)

    if (remote)
      return false
  }

  return record
}

async function fetchRecords<T extends Type>(agent: Agent, filter: FullFilterObj<T>, remote?: boolean) {
  const { records, status } = await agent.web5.dwn.records.query({
    from: remote ? BlobProtocolDID : undefined,
    message: {
      filter: {
        ...filter,
        protocol: BlobProtocol.protocol,
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

type CreatePayload = {
  file: File
}
async function createBlobRecord(agent: Agent, payload: CreatePayload, remote?: boolean) {
  const { file } = payload

  const record = await createRecord(
    agent,
    new Blob([file], { type: file.type }),
    {
      schema: BlobProtocol.types.blob.schema,
      protocolPath: "blob",
      dataFormat: file.type as DataFormat<"blob">,
      published: BlobProtocol.published,
    },
    remote
  )

  if (!record) {
    console.error("Failed to create blob record")
    return false
  }

  return record
}

async function fetchBlobRecord(agent: Agent, filter: FilterObj) {
  const records = await fetchRecords(agent, {
    ...filter,
    protocolPath: "blob",
    schema: BlobProtocol.types.blob.schema,
  })

  if (!records || !records[0]) return false

  return records[0]
}

async function fetchBlobRecords(agent: Agent) {
  return fetchRecords(agent, {
    protocolPath: "blob",
    schema: BlobProtocol.types.blob.schema,
  })
}

type UpdatePayload = CreatePayload

async function updateBlobRecord(agent: Agent, id: string, payload: UpdatePayload): Promise<false | Web5Record>;
async function updateBlobRecord(agent: Agent, record: Web5Record, payload: UpdatePayload): Promise<false | Web5Record>;

async function updateBlobRecord(agent: Agent, idOrRecord: string | Web5Record, payload: UpdatePayload): Promise<false | Web5Record> {
  const { file } = payload

  const record = typeof idOrRecord === "string" ? await fetchBlobRecord(agent, { recordId: idOrRecord }) : idOrRecord
  if (!record) return false

  const { status } = await record.update({
    data: new Blob([file], { type: file.type })
  })

  if (status.code !== 202) {
    console.log("Failed to sync blob record update with remote DWN:", status)
    return false
  }

  return record
}

async function deleteBlobRecord(agent: Agent, id: string): Promise<boolean>;
async function deleteBlobRecord(agent: Agent, record: Web5Record): Promise<boolean>;

async function deleteBlobRecord(agent: Agent, idOrRecord: string | Web5Record): Promise<boolean> {
  const record = typeof idOrRecord === "string" ? await fetchBlobRecord(agent, { recordId: idOrRecord }) : idOrRecord
  if (!record) return false

  const { status } = await agent.web5.dwn.records.delete({
    message: {
      recordId: record.id
    }
  })
  if (status.code !== 202) {
    console.log("Failed to delete blob record:", status)
    return false
  }

  return true
}

const BlobUtils = {
  createBlobRecord,
  fetchBlobRecords,
  fetchBlobRecord,
  updateBlobRecord,
  deleteBlobRecord
}

export default BlobUtils
