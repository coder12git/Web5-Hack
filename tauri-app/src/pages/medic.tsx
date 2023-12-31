import { FunctionComponent, useEffect, useRef, useState } from "react";
import useWeb5Store, { schemaOrgProtocolDefinition } from "@/stores/useWeb5Store";
import { MedicalDocument, MedicalRecord, createItem, createQuantityMagnitude } from "@/utils/medical-document";

const MedicPage: FunctionComponent = () => {
  const { web5, connect } = useWeb5Store((state) => ({ web5: state.web5!, connect: state.connect }));
  const medicalRecord = useRef<MedicalDocument>(new MedicalDocument(web5, schemaOrgProtocolDefinition.protocol))
  const [form, setForm] = useState<{
    name: string,
    magnitude: number,
    unit: string,
    comment?: string
  }>({
    name: "",
    magnitude: 0,
    unit: "kg",
    comment: undefined
  })

  const [historyEvents, setHistoryEvents] = useState<Omit<MedicalRecord.HistoryEvent, "@type">[]>([])

  const addHistoryEvent = () => {
    const historyEvent = {
      time: new Date(),
      state: createItem({
        name: form.name,
        value: createQuantityMagnitude({
          magnitude: form.magnitude,
          unit: form.unit,
          comment: form.comment
        })
      })
    }
    medicalRecord.current.addHistoryEvent(historyEvent)
    setHistoryEvents([...historyEvents, historyEvent])
  }

  const saveMedicalRecord = async () => {
    const res = await medicalRecord.current.save()
    if (res) {
      alert(`Medical record saved: ${res}`)
    }
    else {
      alert("Failed to save record")
    }
  }

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault()
        saveMedicalRecord()
      }}>
        <div>
          <input
            type="text"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Item name. E.g: weight" />
        </div>
        <div className="flex gap-4">
          <input
            type="number"
            required
            onChange={(e) => setForm({ ...form, magnitude: parseInt(e.target.value) })}
            placeholder="Magnitude" />
          <select
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            className="w-20">
            <option value="kg">kg</option>
            <option value="g">g</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            required
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Comment" />
        </div>
        <div>
          {historyEvents.map((event, index) => (
            <div key={index} className="flex gap-2">
              <span>{event.time.toLocaleString()}</span>
              <span>{JSON.stringify(event.state)}</span>
            </div>
          ))}
        </div>
        <button type="button" onClick={addHistoryEvent}>
          Add event
        </button>
        <button type="submit">
          Create medical record
        </button>
      </form>
    </div>
  )
}

export default MedicPage
