import useWeb5Store from "@/stores/useWeb5Store";
import { useState } from "react";
import { hc } from "hono/client"
import { App } from "@backend/app"

const backendClient = hc<App>("/")

const possibleConditions = [
  "Cancer",
  "Diabetes",
  "Heart Disease",
  "High Blood Pressure",
  "High Cholesterol",
  "Mental Illness",
]

function Connect() {
  const [similarConditions, setSimilarConditions] = useState<{ did: string, condition: string }[]>([])
  const [form, setForm] = useState({ condition: "" })

  const fetchDocumentsWithCondition = async (condition: string) => {
    const maybeConditions = await backendClient.api.conditions.$get({
      query: {
        condition
      }
    })
      .then(res => res.json())
    if (!Array.isArray(maybeConditions))
      return []
    const conditions = maybeConditions
    return conditions
  }

  const connectCondition = async () => {
    const res = await fetchDocumentsWithCondition(form.condition)
    setSimilarConditions(res)
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
