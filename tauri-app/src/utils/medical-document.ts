import { Record as Web5Record, Web5 } from "@web5/api"

export namespace MedicalRecord {
  export type NullFlavor = "253|unknown|" | "271|no information|" | "272|masked|" | "273|not applicable|"

  export type QuantityComment = {
    "@type": "DV_TEXT",
    value: string
  }

  export type QuantityMagnitude = {
    "@type": "DV_MAGNITUDE",
    magnitude: number,
    unit: string,
    comment?: string
  }

  type Quantity = QuantityMagnitude | QuantityComment

  export type Element = {
    "@type": "ELEMENT",
    name: string,
    value: Quantity
  } & ({
    null_flavor?: NullFlavor,
    null_reason?: string
  } | {
    null_flavor: NullFlavor,
    null_reason: string
  })

  export type ItemSingle = {
    "@type": "ITEM_SINGLE",
    item: Element
  }

  export type ItemList = {
    "@type": "ITEM_LIST",
    items: Item[]
  }

  export type Item = ItemSingle | ItemList

  export type HistoryEvent = {
    "@type": "EVENT",
    time: Date,
    state: Item
  }

  export type History = {
    "@type": "HISTORY",
    origin?: Date,
    period?: Date,
    duration?: Date,
    events: HistoryEvent[]
  }

  export type Document = {
    history?: History,
    comment?: string
  }
}

export function createQuantityMagnitude(quantity: Omit<MedicalRecord.QuantityMagnitude, "@type">): MedicalRecord.QuantityMagnitude {
  return {
    ...quantity,
    "@type": "DV_MAGNITUDE"
  }
}

export function createQuantityComment(quantity: Omit<MedicalRecord.QuantityComment, "@type">): MedicalRecord.QuantityComment {
  return {
    ...quantity,
    "@type": "DV_TEXT"
  }
}


export function createItem(element: Omit<MedicalRecord.Element, "@type">): MedicalRecord.ItemSingle {
  return {
    "@type": "ITEM_SINGLE",
    item: {
      ...element,
      "@type": "ELEMENT"
    }
  }
}

export class MedicalDocument {
  declare private _web5: Web5
  declare private _protocol: string
  private _id: string | undefined = undefined
  declare private _history: MedicalRecord.History
  private _comment: string | undefined = ""
  declare private _record: Web5Record

  constructor(web5: Web5, protocol: string, doc?: MedicalRecord.Document & { id: string }) {
    this._web5 = web5
    this._protocol = protocol

    this._history = {
      "@type": "HISTORY",
      events: []
    }

    if (doc) {
      if (doc.history)
        this._history = doc.history
      this._comment = doc.comment
      this._id = doc.id
    }
  }

  setHistory(payload: { origin?: Date, period?: Date, duration?: Date }) {
    this._history = {
      '@type': 'HISTORY',
      origin: payload.origin,
      period: payload.period,
      duration: payload.duration,
      events: []
    }
  }

  addHistoryEvent(payload: { time: Date, state: MedicalRecord.Item }) {
    this._history.events.push({
      "@type": "EVENT",
      time: payload.time,
      state: payload.state
    })

    return this._history.events.length - 1
  }

  set comment(comment: string | undefined) {
    this._comment = comment
  }

  get comment() {
    return this._comment
  }

  static async getById(web5: Web5, protocol: string, id: string) {
    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          recordId: id,
          protocol
        }
      }
    })

    if (!records)
      return null

    const firstRecordResponse = records[0]
    if (!firstRecordResponse)
      return null

    const medicalRecord: MedicalRecord.Document = await firstRecordResponse.data.json()

    return new MedicalDocument(web5, protocol, Object.assign(medicalRecord, { id }))
  }

  async save(): Promise<false | string> {
    let record: Web5Record | undefined = undefined

    if (this._id) {
      const res = await this._record.update({
        data: {
          history: this._history,
          comment: this._comment
        }
      })

      if (res.status.code === 200)
        return this._id

      return false
    }

    const res = await this._web5.dwn.records.create({
      data: {
        "@context": "https://schema.org",
        "@type": "MEDICAL_RECORD",
        history: this._history,
        comment: this._comment
      },
      message: {
        schema: "https://schema.org/Person",
        dataFormat: "application/json",
        protocol: this._protocol,
        protocolPath: "person",
      },
    })

    record = res.record
    console.log(res)

    if (!record)
      return false

    this._id = record.id

    return record.id
  }
}
