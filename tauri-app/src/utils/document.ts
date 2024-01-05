import { Record, Web5 } from "@web5/api/browser"
import DocumentProtocol from "./protocols/document";

type Agent = {
  web5: Web5
  did: string
}

type DocumentSchema = typeof DocumentProtocol["types"][keyof typeof DocumentProtocol["types"]]["schema"]

type FilterObj = {
  schema?: DocumentSchema
}

async function fetchDocumentRecords(agent: Agent, filter?: FilterObj) {
  const { records } = await agent.web5.dwn.records.query({
    message: {
      filter: {
        ...filter,
        protocol: DocumentProtocol.protocol,
      },
      // @ts-ignore
      dateSort: "createdAscending",
    },
  });

  if (!records) return false

  return records
}

async function createRecord() {
  const docs = [];
  for (const record of records) {
    const data = await record.data.json();
    docs.push({
      record,
      data,
      id: record.id
    });
  }

  setDocuments(docs);
}

async function createBlobRecord(web5: Web5, file: File) {
  const { record: uploadedRecord } = await web5.dwn.records.create({
    data: new Blob([file], { type: file.type }),
    message: {
      schema: DocumentProtocol.types.blob.schema,
      protocol: DocumentProtocol.protocol
    }
  })

  if (!uploadedRecord) return false

  return uploadedRecord
}
