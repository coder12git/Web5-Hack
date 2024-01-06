import { create } from "zustand"
import { combine } from "zustand/middleware";
import { Record as UserDetailsProtocolRecord } from "@/utils/protocols/user";
import { Agent } from "@/components/Auth/types";
import UserDetailsUtils from "@/utils/user";
import DocumentUtils from "@/utils/document";

type State = {
  profile: {
    firstName: string,
    lastName: string,
    profilePictureUrl: string
  },
  isSignedIn: true
} | {
  profile: null,
  isSignedIn: false
}

type Payload = {
  firstName: string,
  lastName: string,
  profilePicture: File
}

export const useProfile = create(
  combine({
    state: {
      profile: null,
      isSignedIn: false
    } as State
  }, (set, get) => ({
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
      console.log(profile)

      const profilePicture = await DocumentUtils.fetchBlobRecord(agent, profile.profilePictureUrl)
      let profilePictureUrl = ""
      if (profilePicture) {
        const profilePictureBlob = await profilePicture.data.blob()
        profilePictureUrl = URL.createObjectURL(profilePictureBlob)
      }

      set({
        state: {
          isSignedIn: true,
          profile: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            profilePictureUrl
          }
        }
      })

      return true
    },
    signUp: async (agent: Agent, payload: Payload) => {
      const profile = await UserDetailsUtils.createUserDetailsRecord(agent, payload)
      if (!profile) return false

      return true
    }
  }))
)
