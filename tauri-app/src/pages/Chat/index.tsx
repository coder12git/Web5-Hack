import "./index.css";
import UserProfile from "../../components/UserProfile/";
import UserFriendList from "../../components/UserFriendList/";
import Chat from "../../components/Chat/";

import { useState } from "react";

const index = () => {
  const [friends, setFriends] = useState([
    { profile_pic: "/pg.jpg", username: "@scriptkidd", isOnline: false },
    { profile_pic: "/pg.jpg", username: "@nikki", isOnline: false },
    { profile_pic: "/pm.jpg", username: "@gregidd", isOnline: true },
    { profile_pic: "/pic.jpg", username: "@scdd", isOnline: false },
  ]);

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
        <UserFriendList friendList={friends} />
      </div>
      <div className="chat-container">
        <Chat />
      </div>
    </div>
  );
};

export default index;
