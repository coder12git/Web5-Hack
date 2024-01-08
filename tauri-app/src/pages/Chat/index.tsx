import "./index.css";
import UserProfile from "../../components/UserProfile/";
import UserFriendList from "../../components/UserFriendList/";
import Chat from "../../components/Chat/";
import FriendRequests from "../../components/FriendRequests/";
import FindFriends from "../../components/FindFriends/";

import UserMobileProfile from "../../components/UserMobileProfile/";
import UserMobileFriendList from "../../components/UserMobileFriendList/";
import MobileChat from "../../components/MobileChat";

import { useEffect, useState } from "react";
import { Agent } from "@/components/Auth/types";
import UserDetailsUtils from "@/utils/user";
import { Record as UserDetailsProtocolRecord } from "@/utils/protocols/user";
import BlobUtils from "@/utils/blob";
import { useProfile } from "@/stores/profile";
import useWeb5Store from "@/stores/useWeb5Store";

const fetchProfilesWithConditions = async (agent: Agent, conditions: string[]) => {
  const profileRecords = await UserDetailsUtils.fetchUserDetailsRecords(agent)
  if (!profileRecords)
    return []

  const profilesWithRank = []
  for (const record of profileRecords) {
    const profile: UserDetailsProtocolRecord.Details = await record.data.json()

    if (profile.did === agent.did) continue

    const profileWithRank = {
      profile,
      rank: 0
    }

    for (const condition of conditions) {
      if (profile.conditions.indexOf(condition) > -1) {
        profileWithRank.rank += 1
      }
    }

    if (profileWithRank.rank === 0) continue

    profilesWithRank.push(profileWithRank)
  }

  const sortedProfiles = profilesWithRank
    .sort((a, b) => b.rank - a.rank)
    .map((profileWithRank) => profileWithRank.profile)

  const matchingProfiles: (Omit<UserDetailsProtocolRecord.Details, "profilePictureId"> & { profilePictureUrl: string })[] = []

  for (const p of sortedProfiles) {
    const { profilePictureId, ...profile } = p
    const profilePictureRecord = await BlobUtils.fetchBlobRecord(agent, { recordId: profilePictureId }, true)

    const payload = {
      ...profile,
      profilePictureUrl: ""
    }

    if (profilePictureRecord) {
      const profilePicture = await profilePictureRecord.data.blob()
      payload.profilePictureUrl = URL.createObjectURL(profilePicture)
    }

    matchingProfiles.push(payload)
  }

  return matchingProfiles
}

export type Friend = Awaited<ReturnType<typeof fetchProfilesWithConditions>>[number] & {
  isOnline: boolean
  username: string
}

const index = () => {
  const [friends, setFriends] = useState([
    {
      profile_pic: "/pg.jpg",
      username: "@scriptkidd",
      isOnline: false,
      did: "1020383*@(wppwsj)",
    },
    {
      profile_pic: "/pg.jpg",
      username: "@nikki",
      isOnline: false,
      newChat: 1,
      did: "apqpwpudrZpwpsAaap",
    },
    {
      profile_pic: "/pm.jpg",
      username: "@gregidd",
      isOnline: true,
      newChat: 7,
      did: "12340APDPDISavavagaAjd",
    },
    {
      profile_pic: "/pic.jpg",
      username: "@scdd",
      isOnline: false,
      newChat: 4,
      did: "APSOWJEHDHaksosodoQPPE1O",
    },
 ]);

  {/*const [friends, setFriends] = useState<Friend[]>([
    // { profile_pic: "/pg.jpg", username: "@scriptkidd", isOnline: false, did: "1020383*@(wppwsj)" },
    // { profile_pic: "/pg.jpg", username: "@nikki", isOnline: false, newChat: 1, did: "apqpwpudrZpwpsAaap" },
    // {
    //   profile_pic: "/pm.jpg",
    //   username: "@gregidd",
    //   isOnline: true,
    //   newChat: 7,
    //   did: "12340APDPDISavavagaAjd"
    // },
    // { profile_pic: "/pic.jpg", username: "@scdd", isOnline: false, newChat: 4, did: "APSOWJEHDHaksosodoQPPE1O" },
>>>>>>> 499f1964de53b184725503bcf7efa766f1394645*/}
 
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hideChat, setHideChat] = useState<boolean>(false);
  const [showFriendRequests, setShowFriendRequests] = useState<boolean>(false);
  const [showFindFriends, setShowFindFriends] = useState<boolean>(false);

  const profile = useProfile(store => store.state.profile!)
  const { web5, did } = useWeb5Store(store => ({ web5: store.web5!, did: store.did! }))

  useEffect(() => {
    const fetchProfiles = async () => {
      const res = await fetchProfilesWithConditions({ web5, did }, profile.conditions)
      const newFriends = res.map(profile => ({
        ...profile,
        isOnline: true,
        username: `${profile.firstName}${profile.lastName}`
      }))
      setFriends(newFriends)
    }

    fetchProfiles()
  }, [profile, web5, did])

  useEffect(() => {
    if (window.innerWidth < 750) {
      setIsMobile(true);
      return;
    }

    setIsMobile(false);
  }, [window.innerWidth]);

  if (isMobile) {
    return (
      <div className="m-chat-container">
        <UserMobileProfile
<<<<<<< HEAD
          username={"gravyboat247"}
          about_user={
            "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat."
          }
          profile_pic={"/pg.jpg"}
          cover_pic={"/pic.jpg"}
          friends={45}
          friendRequests={5}
          friendRequestsUtils={[showFriendRequests, setShowFriendRequests]}
          findFriendsUtils={[showFindFriends, setShowFindFriends]}
=======
          username={`${profile.firstName}${profile.lastName}`}
          about_user={profile.description}
          profile_pic={profile.profilePictureUrl}
          cover_pic={profile.profilePictureUrl}
          friends={friends.length}
>>>>>>> 499f1964de53b184725503bcf7efa766f1394645
        />
        <UserMobileFriendList
          //@ts-ignore
          friendList={friends}
          setHideChat={setHideChat}
          hideChat={hideChat}
        />
        {hideChat && (
          <div className="data-container">
            <MobileChat
              //@ts-ignore
<<<<<<< HEAD
              setHideChat={setHideChat}
              hideChat={hideChat}
            />
          </div>
        )}

        {showFriendRequests && (
          <div
            onClick={() => setShowFriendRequests(false)}
            className="data-container"
          >
            <FriendRequests />
          </div>
        )}
        {showFindFriends && (
          <div
            onClick={() => setShowFindFriends(false)}
            className="data-container"
          >
            <FindFriends />
=======
              setHideChat={setHideChat} hideChat={hideChat} />
>>>>>>> 499f1964de53b184725503bcf7efa766f1394645
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="main-chat-container">
      <div className="utils-container">
        <UserProfile
<<<<<<< HEAD
          username={"gravyboat247"}
          about_user={
            "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat."
          }
          profile_pic={"/pg.jpg"}
          cover_pic={"/pic.jpg"}
          friends={45}
          friendRequests={5}
          friendRequestsUtils={[showFriendRequests, setShowFriendRequests]}
          findFriendsUtils={[showFindFriends, setShowFindFriends]}
        />
        <UserFriendList
          //@ts-ignore
          friendList={friends}
        />
=======
          username={`${profile.firstName}${profile.lastName}`}
          about_user={profile.description}
          profile_pic={profile.profilePictureUrl}
          cover_pic={profile.profilePictureUrl}
          friends={friends.length}
        />
        <UserFriendList
          friendList={friends} />
>>>>>>> 499f1964de53b184725503bcf7efa766f1394645
      </div>
      <div className="chat-container">
        <Chat />
      </div>

      {showFriendRequests && (
        <div
          onClick={() => setShowFriendRequests(false)}
          className="data-container"
        >
          <FriendRequests />
        </div>
      )}

      {showFindFriends && (
        <div
          onClick={() => setShowFindFriends(false)}
          className="data-container"
        >
          <FindFriends />
        </div>
      )}
    </div>
  );
};

export default index;
