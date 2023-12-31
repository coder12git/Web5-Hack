import { Agent } from "@/components/Auth/types"
import { ProfileState } from "@/stores/profile"
import { Record as DocumentRecord } from "@/utils/protocols/document";
import DocumentUtils from "@/utils/document"
import BlobUtils from "@/utils/blob";

export const fetchRecords = async (agent: Agent, profile: ProfileState) => {
  const records = await DocumentUtils.fetchDocumentRecords(agent)
  if (!records) return false

  const profileRecords = []
  for (const record of records) {
    const data: DocumentRecord.Document = await record.data.json()
    const fileRecord = await BlobUtils.fetchBlobRecord(agent, { recordId: data.file.id })
    if (!fileRecord) continue
    const fileData = await fileRecord.data.blob()

    const otherFilesProcessing = await Promise.all(data.otherFiles.map(async file => {
      const record = await BlobUtils.fetchBlobRecord(agent, { recordId: file.id })
      if (!record) return false

      const data = await record.data.blob()
      return {
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(
          new File([data], file.name, { type: file.type })
        )
      }
    }))

    if (otherFilesProcessing.includes(false)) continue

    const otherFiles = otherFilesProcessing as Exclude<typeof otherFilesProcessing[number], false>[]

    console.log(data.profileId)
    console.log(data.profileId === profile.id)
    if (data.profileId === profile.id) {
      profileRecords.push({
        title: data.title,
        description: data.description,
        dateCreated: data.dateCreated,
        file: {
          name: data.file.name,
          type: data.file.type,
          url: URL.createObjectURL(
            new File([fileData], data.file.name, { type: data.file.type })
          )
        },
        otherFiles
      })
    }
  }
  return profileRecords
}

export type CardData = Exclude<Awaited<ReturnType<typeof fetchRecords>>, false>[0]
