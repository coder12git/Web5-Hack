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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hideChat, setHideChat] = useState<boolean>(false);
  const [showFriendRequests, setShowFriendRequests] = useState<boolean>(false);
  const [showFindFriends, setShowFindFriends] = useState<boolean>(false);

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
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="main-chat-container">
      <div className="utils-container">
        <UserProfile
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
