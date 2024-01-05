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

async function fetchDocumentRecord(agent: Agent, filter: FilterObj) {
  const { records, status } = await agent.web5.dwn.records.query({
    message: {
      filter: {
        ...filter,
        protocol: DocumentProtocol.protocol,
        protocolPath: "document",
      },
      // @ts-ignore
      dateSort: "createdAscending",
    },
  });

  if (!records) {
    console.log("Failed to fetch document record:", status)
    return false
  }

  if (records.length < 1) return false

  return records[0]
}

async function fetchDocumentRecords(agent: Agent) {
  const { records, status } = await agent.web5.dwn.records.query({
    message: {
      filter: {
        protocol: DocumentProtocol.protocol,
        protocolPath: "document",
      },
      // @ts-ignore
      dateSort: "createdAscending",
    },
  });

  if (!records) {
    console.log("Failed to fetch document records:", status)
    return false
  }

  return records
}

async function fetchBlobRecord(agent: Agent, id: string) {
  const { records, status } = await agent.web5.dwn.records.query({
    message: {
      filter: {
        recordId: id,
        protocol: DocumentProtocol.protocol,
        protocolPath: "blob",
      },
      // @ts-ignore
      dateSort: "createdAscending",
    },
  });

  if (!records) {
    console.log("Failed to fetch blob record:", status)
    return false
  }

  if (records.length < 1) return false

  return records[0]
}

async function fetchBlobRecords(agent: Agent) {
  const { records, status } = await agent.web5.dwn.records.query({
    message: {
      filter: {
        protocol: DocumentProtocol.protocol,
        protocolPath: "blob",
      },
      // @ts-ignore
      dateSort: "createdAscending",
    },
  });

  if (!records) {
    console.log("Failed to fetch blob records:", status)
    return false
  }

  return records
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

async function createDocumentRecord(agent: Agent, { name, file, condition }: { name: string | undefined, file: File, condition: string }) {
  const blobRecord = await createBlobRecord(agent, file)
  if (!blobRecord) return false

  const data: DocumentProtocolRecord.Document = {
    name: name ?? file.name,
    encodingFormat: file.type,
    size: file.size,
    url: blobRecord.id,
    condition,
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString()
  }
  const { record: createdRecord, status: recordCreationStatus } = await agent.web5.dwn.records.create({
    data,
    message: {
      schema: DocumentProtocol.types.document.schema,
      protocol: DocumentProtocol.protocol,
      protocolPath: "document",
      dataFormat: DocumentProtocol.types.document.dataFormats[0],
      published: DocumentProtocol.published,
    },
  });

  if (!createdRecord) {
    console.error("Failed to create document record:", recordCreationStatus)
    return false
  }

  const { status: syncStatus } = await createdRecord.send(DocumentProtocolDID)

  if (syncStatus.code !== 202) {
    console.log("Failed to sync document record with remote DWN:", syncStatus)
  }

  return createdRecord
}

async function createBlobRecord(agent: Agent, file: File) {
  const { record: createdRecord, status } = await agent.web5.dwn.records.create({
    data: new Blob([file], { type: file.type }),
    message: {
      schema: DocumentProtocol.types.blob.schema,
      protocol: DocumentProtocol.protocol,
      protocolPath: "blob",
    }
  })

  if (!createdRecord) {
    console.error("Failed to create blob record", status)
    return false
  }

  const { status: syncStatus } = await createdRecord.send(DocumentProtocolDID)

  if (syncStatus.code !== 202) {
    console.log("Failed to sync blob record with remote DWN:", syncStatus)
  }

  return createdRecord
}

const DocumentUtils = {
  fetchDocumentRecord,
  fetchDocumentRecords,
  updateDocumentRecord,
  createDocumentRecord,
  fetchBlobRecord,
}

export default DocumentUtils
