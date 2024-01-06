import { Web5, Record as Web5Record } from "@web5/api/browser"
import DocumentProtocol, { Record as DocumentProtocolRecord, did as DocumentProtocolDID } from "./protocols/document";
import _ from "lodash";

type Agent = {
  web5: Web5
  did: string
}

type FilterObj = {
  recordId: string,
}

type Type = keyof typeof DocumentProtocol["types"]
type Schema<T extends Type> = typeof DocumentProtocol["types"][T]["schema"]
type DataFormat<T extends Type> = typeof DocumentProtocol["types"][T]["dataFormats"][number]

type FullFilterObj<T extends Type> = {
  protocolPath: T
  schema: Schema<T>
}

type FullMessageObj<T extends Type> = {
  schema: Schema<T>
  protocolPath: T
  dataFormat: DataFormat<T>
  published: typeof DocumentProtocol["published"]
}

async function createRecord(agent: Agent, data: DocumentProtocolRecord.Document, message: FullMessageObj<"document">): Promise<false | Web5Record>;
async function createRecord(agent: Agent, data: DocumentProtocolRecord.File, message: FullMessageObj<"blob">): Promise<false | Web5Record>;

async function createRecord<T extends Type>(agent: Agent, data: DocumentProtocolRecord.Document | DocumentProtocolRecord.File, message: FullMessageObj<T>) {
  const { record, status } = await agent.web5.dwn.records.create({
    data,
    message: Object.assign({
      ...message,
      protocol: DocumentProtocol.protocol,
    })
  });

  if (!record) {
    console.error("Failed to create record:", status)
    return false
  }

  const { status: syncStatus } = await record.send(DocumentProtocolDID)

  if (syncStatus.code !== 202) {
    console.log("Failed to sync record with remote DWN:", syncStatus)
  }

  return record
}

async function fetchRecords<T extends Type>(agent: Agent, filter: FullFilterObj<T>) {
  const { records, status } = await agent.web5.dwn.records.query({
    from: DocumentProtocolDID,
    message: {
      filter: {
        ...filter,
        protocol: DocumentProtocol.protocol,
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

async function createDocumentRecord(agent: Agent, { name, file, condition }: { name: string | undefined, file: File, condition: string }) {
  const blobRecord = await createBlobRecord(agent, file)
  if (!blobRecord) return false

  const record = await createRecord(
    agent,
    {
      name: name ?? file.name,
      encodingFormat: file.type,
      size: file.size,
      url: blobRecord.id,
      condition,
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString()
    },
    {
      schema: DocumentProtocol.types.document.schema,
      protocolPath: "document",
      dataFormat: DocumentProtocol.types.document.dataFormats[0],
      published: DocumentProtocol.published,
    })

  if (!record) {
    console.error("Failed to create document record")
    return false
  }

  return record
}

async function createBlobRecord(agent: Agent, file: File) {
  const record = await createRecord(
    agent,
    new Blob([file], { type: file.type }),
    {
      schema: DocumentProtocol.types.blob.schema,
      protocolPath: "blob",
      dataFormat: file.type as DataFormat<"blob">,
      published: DocumentProtocol.published,
    }
  )

  if (!record) {
    console.error("Failed to create blob record")
    return false
  }

  return record
}

async function fetchDocumentRecord(agent: Agent, filter: FilterObj) {
  const records = await fetchRecords(agent, {
    ...filter,
    schema: DocumentProtocol.types.document.schema,
    protocolPath: "document",
  })

  if (!records || !records[0]) return false

  return records[0]
}

async function fetchDocumentRecords(agent: Agent) {
  return fetchRecords(agent, {
    protocolPath: "document",
    schema: DocumentProtocol.types.document.schema,
  })
}

async function fetchBlobRecord(agent: Agent, id: string) {
  const records = await fetchRecords(agent, {
    protocolPath: "blob",
    schema: DocumentProtocol.types.blob.schema,
  })

  if (!records || !records[0]) return false

  return records[0]
}

async function fetchBlobRecords(agent: Agent) {
  return fetchRecords(agent, {
    protocolPath: "blob",
    schema: DocumentProtocol.types.blob.schema,
  })
}

type UpdatePayload = Partial<{
  name: string
  condition: string
  file: File
}>

async function updateDocumentRecord(agent: Agent, id: string, payload: UpdatePayload): Promise<false | Web5Record>;
async function updateDocumentRecord(agent: Agent, record: Web5Record, payload: UpdatePayload): Promise<false | Web5Record>;

async function updateDocumentRecord(agent: Agent, idOrRecord: string | Web5Record, payload: Partial<UpdatePayload>) {
  let record: Web5Record

  if (typeof idOrRecord === "string") {
    const fetchedRecord = await fetchDocumentRecord(agent, { recordId: idOrRecord })

    if (!fetchedRecord) return false

    record = fetchedRecord
  }
  else {
    record = idOrRecord
  }

  const data: DocumentProtocolRecord.Document = await record.data.json()
  const { file, ...restPayload } = payload

  let url = data.url
  if (file) {
    const blobRecord = await updateBlobRecord(agent, url, file)
    if (!blobRecord) return false

    url = blobRecord.id
  }

  const { status } = await record.update({
    data: _.merge(data, Object.assign(restPayload, { url }))
  })

  if (status.code !== 202) {
    console.log("Failed to sync document record update with remote DWN:", status)
    return false
  }

  return record
}

async function updateBlobRecord(agent: Agent, id: string, file: File): Promise<false | Web5Record>;
async function updateBlobRecord(agent: Agent, record: Web5Record, file: File): Promise<false | Web5Record>;

async function updateBlobRecord(agent: Agent, idOrRecord: string | Web5Record, file: File): Promise<false | Web5Record> {
  let record: Web5Record

  if (typeof idOrRecord === "string") {
    const blobRecord = await fetchBlobRecord(agent, idOrRecord)
    if (!blobRecord) return false
    record = blobRecord
  }
  else {
    record = idOrRecord
  }

  const { status } = await record.update({
    data: new Blob([file], { type: file.type })
  })

  if (status.code !== 202) {
    console.log("Failed to sync blob record update with remote DWN:", status)
    return false
  }

  return record
}

async function deleteDocumentRecord(agent: Agent, id: string): Promise<boolean>;
async function deleteDocumentRecord(agent: Agent, record: Web5Record): Promise<boolean>;

async function deleteDocumentRecord(agent: Agent, idOrRecord: string | Web5Record): Promise<boolean> {
  let record: Web5Record

  if (typeof idOrRecord === "string") {
    const fetchedRecord = await fetchDocumentRecord(agent, { recordId: idOrRecord })

    if (!fetchedRecord) return false

    record = fetchedRecord
  }
  else {
    record = idOrRecord
  }

  const document: DocumentProtocolRecord.Document = await record.data.json()

  const hasDeletedBlobRecord = await deleteBlobRecord(agent, document.url)
  if (!hasDeletedBlobRecord) return false

  const { status } = await agent.web5.dwn.records.delete({
    message: {
      recordId: record.id
    }
  })
  if (status.code !== 202) {
    console.log("Failed to delete record:", status)
    return false
  }

  return true
}

async function deleteBlobRecord(agent: Agent, id: string): Promise<boolean>;
async function deleteBlobRecord(agent: Agent, record: Web5Record): Promise<boolean>;

async function deleteBlobRecord(agent: Agent, idOrRecord: string | Web5Record): Promise<boolean> {
  const record = typeof idOrRecord === "string" ? await fetchBlobRecord(agent, idOrRecord) : idOrRecord
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

const DocumentUtils = {
  createDocumentRecord,
  createBlobRecord,
  fetchDocumentRecord,
  fetchDocumentRecords,
  fetchBlobRecord,
  updateDocumentRecord,
  updateBlobRecord,
  deleteDocumentRecord,
  deleteBlobRecord
}

export default DocumentUtils
