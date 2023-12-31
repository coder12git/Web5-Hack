import { Web5, Record as Web5Record } from '@web5/api';
import { useState, useEffect } from 'react';
import { schemaOrgProtocolDefinition } from './useWeb5Store';
import _ from "lodash"

export type DigitalDocument = {
  "@context": "https://schema.org";
  "@type": "DigitalDocument";
  name: string;
  encodingFormat: string;
  size: string;
  url: string;
  identifier: string;
  dateCreated?: string;
  dateModified?: string;
  datePublished: string;
  thumbnail?: Blob;
  thumbnailUrl?: string;
};

type Document = {
  record: Web5Record,
  id: string
  data: DigitalDocument
}

export function useDocuments(web5: Web5) {
  const [documents, setDocuments] = useState<Document[]>([]);

  async function fetchDocuments() {
    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: "https://schema.org/DigitalDocument",
        },
        dateSort: "createdAscending",
      },
    });

    if (!records) return false

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

  async function createDocument({ name, file }: { name: string | undefined, file: File }): Promise<false | Document> {
    const { record: uploadedFileResponse } = await web5.dwn.records.create({
      data: new Blob([file], { type: file.type }),
    });

    if (!uploadedFileResponse) return false;

    const { record } = await web5.dwn.records.create({
      data: {
        "@context": "https://schema.org",
        "@type": "DigitalDocument",
        name: name ?? file.name,
        encodingFormat: file.type,
        size: file.size.toString(),
        url: uploadedFileResponse.id,
        identifier: "",
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        datePublished: new Date().toISOString(),
      },
      message: {
        schema: "https://schema.org/DigitalDocument",
        protocol: schemaOrgProtocolDefinition.protocol,
        protocolPath: "digitalDocument",
        dataFormat: "application/json",
        published: true
      },
    });

    if (!record) return false;

    const data = await record.data.json();
    const doc = { record, data, id: record.id };

    setDocuments((prevDocs) => [...prevDocs, doc]);

    return doc
  }

  async function updateDocument(document: Document, { name, file }: { name?: string, file?: File }) {
    let uploadedFileResponse: Web5Record | undefined = undefined
    if (file) {
      const { record } = await web5.dwn.records.create({
        data: new Blob([file], { type: file.type }),
      });
      uploadedFileResponse = record
    }

    if (file && !uploadedFileResponse) return false;

    const data = {
      name: name ?? file?.name ?? document.data.name,
      encodingFormat: file?.type,
      size: file?.size.toString(),
      url: uploadedFileResponse?.id,
      dateModified: new Date().toISOString(),
    }

    const responseStatus = await document.record.update({
      data
    });

    // await responseStatus.status
    const updatedDoc = _.merge(document, { data })

    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === document.id
          ? updatedDoc
          : doc
      )
    );
  }

  async function deleteDocument(document: Document) {
    await web5.dwn.records.delete({
      message: {
        recordId: document.id,
      },
    });
    setDocuments((prevDocs) =>
      prevDocs.filter((doc) => doc.id !== document.id)
    );
  }

  async function getDocumentFile(document: Document) {
    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          recordId: document.data.url,
        }
      }
    })

    if (!records) return false

    const firstRecord = records[0]

    if (!firstRecord) return false

    const file = new File([await firstRecord.data.blob()], document.data.name, { type: document.data.encodingFormat });

    return file;
  }

  return { documents, createDocument, updateDocument, deleteDocument, getDocumentFile, fetchDocuments };
}
