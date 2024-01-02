import { FunctionComponent, useEffect, useRef, useState } from "react";
import useWeb5Store, { schemaOrgProtocolDefinition } from "@/stores/useWeb5Store";
import { useRemedies } from "@/stores/useRemedy";

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
    doc: File
  }>({
    name: "",
    description: "",
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
    const res = await createRemedy({ name: form.name ? form.name : undefined, description: form.description ? form.description : undefined , file: form.doc})

    console.log(res)
    if (res) {
      alert(`Remedy record saved: ${res}`)
    }
    else {
      alert("Failed to save record")
      console.error();
    }
  }

  // const deleteItem = async (id) => {
  //   deleteRemedy(id);
  // }
  

  console.log(remedies)
  console.log(docsWithImageUrls)

  return (
    <div className="grid grid-cols-2 gap-4">
      <form onSubmit={(e) => {
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
                {remedies.map((document) => (
                    <div key={document.id} className="bg-white p-4 rounded-md shadow-md">
                        <h5 className="text-xl font-semibold mb-2">{document.data.name}</h5>
                        <p className="text-gray-600">{document.data.description}</p>
                        <button onClick={()=> deleteRemedy(document)}>Delete</button>
                        <br/>
                        <button onClick={()=> updateRemedy(document, {name:'hjk', description: 'hhhj'})}>Edit</button>
                    </div>
                ))}
            </div>
      </div>
    </div>
  )
}

export default Remedy
