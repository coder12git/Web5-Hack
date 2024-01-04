import { FunctionComponent, useEffect, useRef, useState } from "react";
import useWeb5Store, { schemaOrgProtocolDefinition } from "@/stores/useWeb5Store";
import { useDocuments } from "@/stores/useDocuments";

const MedicPage: FunctionComponent = () => {
  const { web5, did } = useWeb5Store((state) => ({ web5: state.web5!, did: state.did! }))
  const { fetchDocuments, documents, createDocument, getDocumentFile } = useDocuments(web5, did)
  const [docsWithImageUrls, setDocsWithImageUrls] = useState<{
    document: typeof documents[0],
    url: string
  }[]>([])

  const [form, setForm] = useState<{
    name: string
    doc: File,
    condition: string
  }>({
    name: "",
    doc: new File([], ""),
    condition: ""
  })

  useEffect(() => {
    if (web5) {
      fetchDocuments()
    }
  }, [web5])

  async function processDocsImage() {
    const docsWithImageUrls: { document: typeof documents[0], url: string }[] = []

    for (const doc of documents) {
      const file = await getDocumentFile(doc)
      let url = ""
      if (file)
        url = URL.createObjectURL(file)

      docsWithImageUrls.push({
        document: doc,
        url
      })
    }

    setDocsWithImageUrls(docsWithImageUrls)
  }

  useEffect(() => {
    processDocsImage()
  }, [documents])

  const saveMedicalRecord = async () => {
    const res = await createDocument({ name: form.name ? form.name : undefined, file: form.doc, condition: form.condition })

    // console.log(res)
    if (res) {
      alert(`Medical record saved: ${res}`)
    }
    else {
      alert("Failed to save record")
    }
  }

  console.log(documents)

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
                doc: file
              })
            }}
            placeholder="Document" />
        </div>
        <div>
          <input
            required
            onChange={(e) => {
              setForm({
                ...form,
                condition: e.target.value.toLowerCase()
              })
            }}
            placeholder="Condition" />
        </div>
        <button type="submit">
          Create record
        </button>
      </form>
      <div>
        {docsWithImageUrls.map(({ document, url }) => (
          <div key={document.id}>
            <embed src={url} width="800px" height="2100px" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MedicPage
