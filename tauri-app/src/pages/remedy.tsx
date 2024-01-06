import { FunctionComponent, useEffect, useRef, useState } from "react";
import useWeb5Store, { schemaOrgProtocolDefinition } from "@/stores/useWeb5Store";
import { useRemedies } from "@/stores/useRemedy";
import Remedies from './Remedies';

const cards = [
  {
      name: "Cancer",
      description: "Dangerous..."
  },
  {
      name: "Cancer",
      description: "Dangerous..."
  },
  {
      name: "Cancer",
      description: "Dangerous..."
  },
  {
      name: "Cancer",
      description: "Dangerous..."
  }
]

const Remedy: FunctionComponent = () => {
  const { web5, connect } = useWeb5Store((state) => ({ web5: state.web5!, connect: state.connect }));
  const { fetchRemedies, remedies, createRemedy, deleteRemedy, updateRemedy, getDocumentFile } = useRemedies(web5)
  const [docsWithImageUrls, setDocsWithImageUrls] = useState<{
    document: typeof remedies[0],
    url: string
  }[]>([])

  const [form, setForm] = useState<{
    name: string
    description: string
    created_by: string
    doc: File
  }>({
    name: "",
    description: "",
    created_by: "",
    doc: new File([], "")
  })

  useEffect(() => {
    if (web5) {
      fetchRemedies()
    }
  }, [web5])

  async function processDocsImage() {
    const docsWithImageUrls: { document: typeof remedies[0], url: string }[] = []

    for (const doc of remedies) {
      const file = await getDocumentFile(doc)
      let url = ""
      if (file)
        url = URL.createObjectURL(file)
        console.log(url);

      docsWithImageUrls.push({
        document: doc,
        url
      })
    }

    setDocsWithImageUrls(docsWithImageUrls)
  }

  useEffect(() => {
    processDocsImage()
  }, [remedies])

  const saveRemedy = async () => {
    const res = await createRemedy({ name: form.name ? form.name : undefined, description: form.description ? form.description : undefined , file: form.doc, created_by: form.created_by})

    console.log(res)
    if (res) {
      alert(`Remedy record saved: ${res}`)
    }
    else {
      alert("Failed to save record")
      console.error();
    }
  }

  console.log(remedies)

  return (
    <>
      <Remedies 
      //@ts-ignore
      save={saveRemedy} formFunc={setForm} form={form} remediesData={remedies} docsWithImageUrls={docsWithImageUrls}
      />
      {/* <form onSubmit={(e) => {
        e.preventDefault()
        saveRemedy()
      }}>
        <div>
          <input
            type="text"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name" />
        </div>
        <div>
          <input
            type="text"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description" />
        </div>
        <div>
          <input
            type="text"
            onChange={(e) => setForm({ ...form, created_by: e.target.value })}
            placeholder="Created" />
        </div>
        <div>
          <input
            type="text"
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            placeholder="rating" />
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
        <button type="submit">
          Create Remedy
        </button>
      </form>
      <div className="container mx-auto my-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white p-4 rounded-md shadow-md">
                        <h5 className="text-xl font-semibold mb-2">{card.name}</h5>
                        <p className="text-gray-600">{card.description}</p>
                    </div>
                ))}
            </div>
      </div>
      <div className="container mx-auto my-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {docsWithImageUrls.map(({document, url}) => (
                    <div key={document.id} className="bg-white p-4 rounded-md shadow-md">
                        <h5 className="text-xl font-semibold mb-2">{document.data.name}</h5>
                        <p className="text-gray-600">{document.data.description}</p>
                        <p className="text-gray-600">{document.data.created_by}</p>
                        <p className="text-gray-600">{document.data.rating}</p>
                        <img src={url} alt="txt"/>
                        <button onClick={()=> deleteRemedy(document)}>Delete</button>
                        <br/>
                        <button onClick={()=> updateRemedy(document, {name:'hjk', description: 'hhhj'})}>Edit</button>
                    </div>
                ))}
            </div>
      </div> */}
    </>
  )
}

export default Remedy
