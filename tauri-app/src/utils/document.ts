import { Web5, Record as Web5Record } from "@web5/api/browser"
import DocumentProtocol, { Record } from "./protocols/document";
import BlobUtils from "./blob";
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

async function createRecord<T extends Type>(agent: Agent, data: Record.Document, message: FullMessageObj<T>) {
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

  // const { status: syncStatus } = await record.send(DocumentProtocolDID)
  const { status: syncStatus } = await record.send(agent.did)

  if (syncStatus.code !== 202) {
    console.log("Failed to sync record with remote DWN:", syncStatus)
  }

  return record
}

async function fetchRecords<T extends Type>(agent: Agent, filter: FullFilterObj<T>) {
  const { records, status } = await agent.web5.dwn.records.query({
    // from: DocumentProtocolDID,
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

type CreatePayload = Omit<Record.Document, "title" | "file" | "otherFiles" | "dateCreated" | "dateModified"> &
{
  title?: string
  file: File,
  otherFiles: File[]
}

async function createDocumentRecord(agent: Agent, payload: CreatePayload) {
  const { file, otherFiles, ...restPayload } = payload

  const blobRecord = await BlobUtils.createBlobRecord(agent, { file })
  if (!blobRecord) return false

  const fileData = {
    id: blobRecord.id,
    size: file.size,
    type: file.type,
    name: file.name,
  }

  const otherFilesData = []
  for (const file of otherFiles) {
    const blobRecord = await BlobUtils.createBlobRecord(agent, { file })
    if (!blobRecord) return false

    otherFilesData.push({
      id: blobRecord.id,
      size: file.size,
      type: file.type,
      name: file.name,
    })
  }

  const record = await createRecord(
    agent,
    {
      ..._.merge({ title: file.name }, restPayload),
      file: fileData,
      otherFiles: otherFilesData,
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

type UpdatePayload = Partial<
  Omit<Record.Document, "file" | "otherFiles" | "dateCreated" | "dateModified"> &
  {
    file: File,
    otherFiles: File[]
  }
>

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

  const data: Record.Document = await record.data.json()
  const { file, otherFiles, ...restPayload } = payload

  const fileData = data.file
  if (file) {
    const blobRecord = await BlobUtils.updateBlobRecord(agent, data.file.id, { file })
    if (!blobRecord) return false

    fileData.id = blobRecord.id
    fileData.name = file.name
    fileData.size = file.size
    fileData.type = file.type
  }

  const otherFilesData = data.otherFiles
  if (otherFiles) {
    for (let i = 0; i < otherFiles.length; i++) {
      const file = otherFiles[i]
      const otherFile = otherFilesData[i]

      const blobRecord = await BlobUtils.updateBlobRecord(agent, otherFile.id, { file })
      if (!blobRecord) return false

      otherFile.id = blobRecord.id
      otherFile.name = file.name
      otherFile.size = file.size
      otherFile.type = file.type
    }

    if (otherFiles.length < otherFilesData.length) {
      otherFilesData.splice(otherFiles.length, otherFilesData.length - otherFiles.length)
    }
    else {
      for (let i = otherFilesData.length; i < otherFiles.length; i++) {
        const file = otherFiles[i]

        const blobRecord = await BlobUtils.createBlobRecord(agent, { file })
        if (!blobRecord) return false

        otherFilesData.push({
          id: blobRecord.id,
          name: file.name,
          size: file.size,
          type: file.type,
        })
      }
    }
  }

  const { status } = await record.update({
    data: _.merge(data, Object.assign(restPayload, { file: fileData, otherFiles: otherFilesData }))
  })

  if (status.code !== 202) {
    console.log("Failed to sync document record update with remote DWN:", status)
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

  const document: Record.Document = await record.data.json()

  const hasDeletedBlobRecord = await BlobUtils.deleteBlobRecord(agent, document.file.id)
  if (!hasDeletedBlobRecord) return false

  for (const otherFile of document.otherFiles) {
    await BlobUtils.deleteBlobRecord(agent, otherFile.id)
  }

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

const DocumentUtils = {
  createDocumentRecord,
  fetchDocumentRecord,
  fetchDocumentRecords,
  updateDocumentRecord,
  deleteDocumentRecord,
}

export default DocumentUtils
