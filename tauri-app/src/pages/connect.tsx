import useWeb5Store from "@/stores/useWeb5Store";
import { useState } from "react";
import DocumentUtils from "@/utils/document";
import { Agent } from "@/components/Auth/types";
import { Record as DocumentRecord } from "@/utils/protocols/document";

const fetchDocumentsWithCondition = async (agent: Agent, condition: string) => {
  const documentRecords = await DocumentUtils.fetchDocumentRecords(agent)
  if (!documentRecords)
    return []

  const matchingDocumentConditions = []
  for (const documentRecord of documentRecords) {
    const data: DocumentRecord.Document = await documentRecord.data.json()

    if (data.condition === condition) {
      matchingDocumentConditions.push(data)
    }
  }
  return matchingDocumentConditions
}

const possibleConditions = [
  "Cancer",
  "Diabetes",
  "Heart Disease",
  "High Blood Pressure",
  "High Cholesterol",
  "Mental Illness",
]

function Connect() {
  const agent = useWeb5Store((state) => ({ web5: state.web5!, did: state.did! }))
  const [similarConditionDocuments, setSimilarConditionDocuments] = useState<DocumentRecord.Document[]>([])
  const [form, setForm] = useState({ condition: possibleConditions[0] })

  const connectCondition = async () => {
    const res = await fetchDocumentsWithCondition(agent, form.condition)
    console.log(res)
    setSimilarConditionDocuments(res)
  }

  return (
    <>
      <div>
        <form onSubmit={(e) => {
          e.preventDefault()
          connectCondition()
        }}>
          <div>
            <select
              required
              onChange={(e) => {
                setForm({
                  ...form,
                  condition: e.target.value
                })
              }}>
              {possibleConditions.map((condition) => (
                <option key={condition} value={condition.toLowerCase()}>{condition}</option>
              ))}
            </select>
          </div>
          <button type="submit">
            Connect
          </button>
        </form>
      </div>
      <div>
        <header>
          People with similar conditions:
        </header>
        <div>
          {similarConditionDocuments.map((doc, index) => (
            <div key={index}>
              <div>
                {doc.title}
              </div>
              <div>
                {doc.condition}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Connect;
