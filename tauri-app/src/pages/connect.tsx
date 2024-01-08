import useWeb5Store from "@/stores/useWeb5Store";
import { useState } from "react";
import { Agent } from "@/components/Auth/types";
import { Record as UserDetailsProtocolRecord } from "@/utils/protocols/user";
import UserDetailsUtils from "@/utils/user";

const fetchProfilesWithCondition = async (agent: Agent, condition: string) => {
  const profileRecords = await UserDetailsUtils.fetchUserDetailsRecords(agent)
  if (!profileRecords)
    return []

  const matchingProfiles = []
  for (const record of profileRecords) {
    const profile: UserDetailsProtocolRecord.Details = await record.data.json()
    console.log(profile)

    if (profile.conditions.indexOf(condition) > -1 && profile.did !== agent.did) {
      matchingProfiles.push(profile)
    }
  }
  return matchingProfiles
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
  const [similarProfiles, setSimilarProfiles] = useState<UserDetailsProtocolRecord.Details[]>([])
  const [form, setForm] = useState({ condition: possibleConditions[0] })

  const connectCondition = async () => {
    const res = await fetchProfilesWithCondition(agent, form.condition)
    console.log(res)
    setSimilarProfiles(res)
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
          {similarProfiles.map((profile, index) => (
            <div key={index}>
              <div>
                {profile.did}
              </div>
              <div>
                {profile.did}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Connect;
