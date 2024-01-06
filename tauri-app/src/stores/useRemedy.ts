import { Web5, Record as Web5Record } from '@web5/api';
import { useState } from 'react';
import { schemaOrgProtocolDefinition } from './useWeb5Store';
import _ from "lodash"

export type Remedy = {
  "@context": "https://schema.org";
  "@type": "Collection";
  name: string;
  description: string;
  created_by: string;
  rating: string;
  encodingFormat: string;
  size: string;
  url: string;
  identifier: string;
  dateCreated?: string;
  dateModified?: string;
  datePublished: string;
  thumbnail?: Blob;
  thumbnailUrl?: string;
  // Add more properties as needed
};

type RemedyDocument = {
  record: Web5Record;
  id: string;
  data: Remedy;
};

export function useRemedies(web5: Web5) {
  const [remedies, setRemedies] = useState<RemedyDocument[]>([]);

  async function fetchRemedies() {
    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: "https://schema.org/Collection",
        },
        // @ts-ignore
        dateSort: "createdAscending",
      },
    });

    if (!records) return false;

    const remedies = [];
    for (const record of records) {
      const data = await record.data.json();
      remedies.push({
        record,
        data,
        id: record.id,
      });
    }
    setRemedies(remedies);
  }

  async function createRemedy({ name, description, file, created_by, rating }: { name: string | undefined ; description: string | undefined; file: File; created_by: string | undefined; rating: string | undefined }): Promise<false | RemedyDocument> {
    
    const { record: uploadedFileResponse } = await web5.dwn.records.create({
      data: new Blob([file], { type: file.type }),
    });

    if (!uploadedFileResponse) return false;    

    const { record } = await web5.dwn.records.create({
      data: {
        "@context": "https://schema.org",
        "@type": "Collection",
        name: name,
        description: description,
        created_by: created_by,
        rating: rating,
        encodingFormat: file.type,
        size: file.size.toString(),
        url: uploadedFileResponse?.id,
        identifier: "",
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        datePublished: new Date().toISOString(),
        // Add more properties as needed
      },
      message: {
        schema: "https://schema.org/Collection",
        protocol: schemaOrgProtocolDefinition.protocol,
        protocolPath: "collection",
        dataFormat: "application/json",
        published: true,
      },
    });

    if (!record) return false

    const data = await record.data.json();
    const remedy = { record, data, id: record.id };

    setRemedies((prevRemedies) => [...prevRemedies, remedy]);

    return remedy;
  }

  async function updateRemedy(remedy: RemedyDocument, { name, description, created_by, rating }: { name?: string; description?: string, created_by?: string; rating?: string }) {
    const data = {
      name: name ?? remedy.data.name,
      description: description ?? remedy.data.description,
      created_by: created_by ?? remedy.data.created_by,
      rating: rating ?? remedy.data.rating
      // Add more properties as needed
    };

    const responseStatus = await remedy.record.update({
      data,
    });

    const updatedRemedy = _.merge(remedy, { data });

    setRemedies((prevRemedies) =>
      prevRemedies.map((r) => (r.id === remedy.id ? updatedRemedy : r))
    );
  }

  async function deleteRemedy(remedy: RemedyDocument) {
    await web5.dwn.records.delete({
      message: {
        recordId: remedy.id,
      },
    });

    setRemedies((prevRemedies) => prevRemedies.filter((r) => r.id !== remedy.id));
  }

  async function getDocumentFile(document: RemedyDocument) {
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

  return { remedies, createRemedy, updateRemedy, deleteRemedy, getDocumentFile, fetchRemedies };
}
