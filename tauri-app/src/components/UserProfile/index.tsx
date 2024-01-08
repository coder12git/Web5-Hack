import React, { FC } from "react";

import "./index.css";

interface friendUtils {
  showFriendRequests: boolean;
  setShowFriendRequests: () => void;
}

interface findFriends {
  showFriendRequests: boolean;
  setShowFriendRequests: () => void;
}

interface UserProfileProps {
  username: String;
  profile_pic: String;
  cover_pic: String;
  about_user: String;
  friends: Number;
  friendRequetsUtils: friendUtils[];
  findFriendsUtils: findFriendUtils[];
}

const index: FC<UserProfileProps> = ({
  username,
  profile_pic,
  cover_pic,
  about_user,
  friends,
  friendRequests,
  friendRequestsUtils,
  findFriendsUtils,
}) => {
  return (
    <div className="userprofile-container">
      <div
        style={{
          background: `linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.1)),url(${cover_pic})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="cover-container"
      >
        <h3>@{username.slice(0, 10) + "..."}</h3>
        <p>
          Friends <b>{friends}</b>
        </p>
        <p>
          <button
            onClick={() => findFriendsUtils[1](!findFriendsUtils[0])}
            className="find-friend-btn"
          >
            Find Friends
          </button>
        </p>
        <div className="bell-container">
          <i
            onClick={() => friendRequestsUtils[1](!friendRequestsUtils[0])}
            className="fa fa-bell"
          ></i>
          <span>{friendRequests}</span>
        </div>
      </div>
      <div className="userprofile-info-container">
        <img src={profile_pic} />
        <p>{about_user}</p>
      </div>
    </div>
  );
};

export default index;
