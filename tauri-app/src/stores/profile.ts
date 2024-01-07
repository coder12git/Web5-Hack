import { create } from "zustand"
import { combine } from "zustand/middleware";
import { Record as UserDetailsProtocolRecord } from "@/utils/protocols/user";
import { Agent } from "@/components/Auth/types";
import UserDetailsUtils, { CreatePayload } from "@/utils/user";
import BlobUtils from "@/utils/blob";

export type ProfileState = {
  id: string
  // username: string
  firstName: string,
  lastName: string,
  profilePictureUrl: string
}

type State = {
  profile: ProfileState,
  isSignedIn: true
} | {
  profile: null,
  isSignedIn: false
}

type Payload = Omit<UserDetailsProtocolRecord.Details, "dateCreated" | "profilePictureUrl"> & {
  profilePicture: File
}

export const useProfile = create(
  combine({
    state: {
      profile: null,
      isSignedIn: false
    } as State,
    showAuthModal: false
  }, (set, get) => ({
    setShowAuthModal: (showAuthModal: boolean) => {
      set({ showAuthModal })
    },
    signOut: () => {
      if (get().state.isSignedIn) {
        set({
          state: {
            isSignedIn: false,
            profile: null
          }
        })
      }
    },
    signIn: async (agent: Agent) => {
      const profileRecord = await UserDetailsUtils.fetchUserDetailsRecord(agent)
      if (!profileRecord) return false

      const profile: UserDetailsProtocolRecord.Details = await profileRecord.data.json()

      const profilePicture = await BlobUtils.fetchBlobRecord(agent, { recordId: profile.profilePictureId })
      let profilePictureUrl = ""
      if (profilePicture) {
        const profilePictureBlob = await profilePicture.data.blob()
        profilePictureUrl = URL.createObjectURL(profilePictureBlob)
      }

      set({
        state: {
          isSignedIn: true,
          profile: {
            id: profileRecord.id,
            firstName: profile.firstName,
            lastName: profile.lastName,
            profilePictureUrl
          }
        }
      })

      return true
    },
    signUp: async (agent: Agent, payload: CreatePayload) => {
      const profile = await UserDetailsUtils.createUserDetailsRecord(agent, payload)
      if (!profile) return false

      return profile
    }
  }))
)
