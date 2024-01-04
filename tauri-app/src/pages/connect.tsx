import useWeb5Store, { schemaOrgProtocolDefinition } from "@/stores/useWeb5Store";
import { useDocuments } from "@/stores/useDocuments";
import { useEffect, useState } from "react";

function Connect() {
    const { web5, did } = useWeb5Store((state) => ({ web5: state.web5!, did: state.did! }))
    const { fetchDocumentsWithCondition } = useDocuments(web5, did)
    const [similarConditions, setSimilarConditions] = useState<{ did: string, condition: string }[]>([])
    const [form, setForm] = useState<{
        condition: string
    }>({
        condition: ""
    })

    useEffect(() => {
        fetchDocumentsWithCondition("cancer")
    }, [])

    const connectCondition = async () => {
        const res = await fetchDocumentsWithCondition(form.condition)
        console.log(res)
        if (res)
            setSimilarConditions(res)
    }


    return (
        <>
            <div>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    connectCondition()
                }}>
                    <input type="text"
                        onChange={(e) => {
                            setForm({ ...form, condition: e.target.value })
                        }}
                        placeholder="Condition" />
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
                    {similarConditions.map((condition, index) => (
                        <div key={index}>
                            <div>
                                {condition.did}
                            </div>
                            <div>
                                {condition.condition}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Connect;
