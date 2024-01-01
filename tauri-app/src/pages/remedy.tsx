import { FunctionComponent, useEffect, useRef, useState } from "react";
import useWeb5Store, { schemaOrgProtocolDefinition } from "@/stores/useWeb5Store";
import { useRemedies } from "@/stores/useRemedy";

const Remedy: FunctionComponent = () => {
  const { web5, connect } = useWeb5Store((state) => ({ web5: state.web5!, connect: state.connect }));
  const { fetchRemedies, remedies, createRemedy } = useRemedies(web5)
  const [docsWithImageUrls, setDocsWithImageUrls] = useState<{
    document: typeof remedies[0],
    url: string
  }[]>([])

  const [form, setForm] = useState<{
    name: string
    description: string
  }>({
    name: "",
    description: ""
  })

  useEffect(() => {
    if (web5) {
      fetchRemedies()
    }
  }, [web5])

  // async function processDocsImage() {
  //   const docsWithImageUrls: { document: typeof remedies[0], url: string }[] = []

  //   for (const doc of remedies) {
  //     const file = await getDocumentFile(doc)
  //     let url = ""
  //     if (file)
  //       url = URL.createObjectURL(file)

  //     docsWithImageUrls.push({
  //       document: doc,
  //       url
  //     })
  //   }

  //   setDocsWithImageUrls(docsWithImageUrls)
  // }

  // useEffect(() => {
  //   processDocsImage()
  // }, [remedies])

  const saveRemedy = async () => {
    const res = await createRemedy({ name: form.name ? form.name : undefined, description: form.description ? form.description : undefined })

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
      <div>
        {remedies.map((remedy) => (
          <div>
            <p>{remedy.data.name}</p>
            <p>{remedy.data.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Remedy
