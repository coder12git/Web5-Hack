import { FunctionComponent, useEffect, useState } from "react";
import useWeb5Store from "@/stores/useWeb5Store";
import DocumentUtils from "@/utils/document";
import { Record as DocumentRecord } from "@/utils/protocols/document";
import { Record as Web5Record } from "@web5/api/browser";
import AuthGuard from "@/components/Auth/Guard";

const possibleConditions = [
  "Cancer",
  "Diabetes",
  "Heart Disease",
  "High Blood Pressure",
  "High Cholesterol",
  "Mental Illness",
]

const Page: FunctionComponent = () => {
  const agent = useWeb5Store((state) => ({ web5: state.web5!, did: state.did! }))
  const [documentsWithUrl, setDocumentsWithUrl] = useState<{ document: DocumentRecord.Document, fileUrl: string, record: Web5Record }[]>([])
  const [form, setForm] = useState({
    name: "",
    file: new File([], ""),
    condition: possibleConditions[0]
  })

  useEffect(() => {
    (async () => {
      const docRecords = await DocumentUtils.fetchDocumentRecords(agent)
      if (!docRecords) {
        console.log("Failed to fetch document records")
        return
      }

      const docsWithUrl = []
      for (const docRecord of docRecords) {
        const data: DocumentRecord.Document = await docRecord.data.json()
        const fileRecord = await DocumentUtils.fetchBlobRecord(agent, data.url)

        if (!fileRecord)
          continue

        const file = new File([await fileRecord.data.blob()], data.title, { type: data.encodingFormat })

        docsWithUrl.push({
          record: docRecord,
          document: data,
          fileUrl: URL.createObjectURL(file),
        })
      }

      setDocumentsWithUrl(docsWithUrl)
    })()
  }, [])

  const saveMedicalRecord = async () => {
    const res = await DocumentUtils.createDocumentRecord(agent, form)

    if (res) {
      alert(`Medical record saved: ${res}`)
    }
    else {
      alert("Failed to save record")
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <form onSubmit={(e) => {
        e.preventDefault()
        saveMedicalRecord()
      }}>
        <div>
          <input
            type="text"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name" />
        </div>
        <div>
          <input
            type="file"
            required
            onChange={(e) => {
              const fileList = e.target.files
              if (!fileList) return

              const file = fileList[0]
              if (!file) return

              setForm({
                ...form,
                file: file
              })
            }}
            placeholder="Document" />
        </div>
        <div>
          <select
            required
            onChange={(e) => {
              console.log(e.target.value)
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
          Create record
        </button>
      </form>
      <div>
        {documentsWithUrl.map(({ record, document, fileUrl: url }) => (
          <div key={record.id}>
            <embed src={url} width="800px" height="2100px" />
          </div>
        ))}
      </div>
    </div>
  )
}

const MedicPage: FunctionComponent = () => {
  return (
    <AuthGuard>
      <Page />
    </AuthGuard>
  )
}

export default MedicPage
