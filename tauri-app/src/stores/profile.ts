import { create } from "zustand"
import { combine } from "zustand/middleware";
import { Record as UserDetailsProtocolRecord } from "@/utils/protocols/user";
import { Agent } from "@/components/Auth/types";
import UserDetailsUtils, { CreatePayload } from "@/utils/user";
import BlobUtils from "@/utils/blob";
import { Record as Web5Record } from "@web5/api/browser"

export type SignUpPayload = Omit<CreatePayload, "conditions" | "did">

export type ProfileState = Omit<UserDetailsProtocolRecord.Details, "profilePictureId"> &
{
  id: string
  // username: string
  profilePictureUrl: string
}

type State = {
  profile: ProfileState,
  isSignedIn: true
  record: Web5Record
} | {
  profile: null,
  record: null,
  isSignedIn: false
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
            record: null,
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
          record: profileRecord,
          profile: {
            ...profile,
            id: profileRecord.id,
            profilePictureUrl
          }
        }
      })

      return true
    },
    addCondition: async (agent: Agent, condition: string) => {
      const state = get().state
      if (!state.isSignedIn) return false

      const { profilePictureUrl, ...payload } = state.profile
      if (payload.conditions.indexOf(condition) < -1) return

      payload.conditions.push(condition)

      const updatedRecord = await UserDetailsUtils.updateUserDetailsRecord(agent, state.record, payload)
      if (!updatedRecord) return false
      const profile = await updatedRecord.data.json()

      set({
        state: {
          isSignedIn: true,
          record: updatedRecord,
          profile: {
            ...profile,
            id: updatedRecord.id,
            profilePictureUrl
          }
        }
      })

      return updatedRecord
    },
    signUp: async (agent: Agent, payload: SignUpPayload) => {
      const profile = await UserDetailsUtils.createUserDetailsRecord(agent, { ...payload, conditions: [], did: agent.did })
      if (!profile) return false

      return profile
    }
  }))
)
