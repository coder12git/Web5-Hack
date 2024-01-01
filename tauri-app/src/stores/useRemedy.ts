import { Web5, Record as Web5Record } from '@web5/api';
import { useState } from 'react';
import { schemaOrgProtocolDefinition } from './useWeb5Store';
import _ from "lodash"

export type Remedy = {
  "@context": "https://schema.org";
  "@type": "Remedy";
  name: string;
  description: string;
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
          schema: "https://schema.org/DigitalDocument",
        },
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

  async function createRemedy({ name, description }: { name: string | undefined ; description: string | undefined }): Promise<false | RemedyDocument> {
    const { record } = await web5.dwn.records.create({
      data: {
        "@context": "https://schema.org",
        "@type": "Remedy",
        name: name,
        description: description,
        // Add more properties as needed
      },
      message: {
        schema: "https://schema.org/DigitalDocument",
        protocol: schemaOrgProtocolDefinition.protocol,
        protocolPath: "remedy",
        dataFormat: "application/json",
        published: true,
      },
    });

    if (!record) return false;

    const data = await record.data.json();
    const remedy = { record, data, id: record.id };

    setRemedies((prevRemedies) => [...prevRemedies, remedy]);

    return remedy;
  }

  async function updateRemedy(remedy: RemedyDocument, { name, description }: { name?: string; description?: string }) {
    const data = {
      name: name ?? remedy.data.name,
      description: description ?? remedy.data.description,
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

  return { remedies, createRemedy, updateRemedy, deleteRemedy, fetchRemedies };
}
