import "./index.css";
import UserProfile from "../../components/UserProfile/";
import UserFriendList from "../../components/UserFriendList/";

import Chat from "../../components/Chat/";

import UserMobileProfile from "../../components/UserMobileProfile/";
import UserMobileFriendList from "../../components/UserMobileFriendList/";
import MobileChat from "../../components/MobileChat";

import { useEffect, useState } from "react";

const index = () => {
  const [friends, setFriends] = useState([
    { profile_pic: "/pg.jpg", username: "@scriptkidd", isOnline: false },
    { profile_pic: "/pg.jpg", username: "@nikki", isOnline: false, newChat: 1 },
    {
      profile_pic: "/pm.jpg",
      username: "@gregidd",
      isOnline: true,
      newChat: 7,
    },
    { profile_pic: "/pic.jpg", username: "@scdd", isOnline: false, newChat: 4 },
  ]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hideChat, setHideChat] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth < 750) {
      setIsMobile(true);
      return;
    }

    setIsMobile(false);
  }, []);

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
            setHideChat={setHideChat} hideChat={hideChat} />
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
        />
        <UserFriendList 
        //@ts-ignore
        friendList={friends} />
      </div>
      <div className="chat-container">
        <Chat />
      </div>
    </div>
  );
};

export default index;
