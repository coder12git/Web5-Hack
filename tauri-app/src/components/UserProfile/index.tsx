import React, { FC } from "react";

import "./index.css";

interface UserProfileProps {
  username: String;
  profile_pic: String;
  cover_pic: String;
  about_user: String;
  friends: Number;
}
const index: FC<UserProfileProps> = ({
  username,
  profile_pic,
  cover_pic,
  about_user,
  friends,
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
        <h3>@{username}</h3>
        <p>
          Friends | <b>{friends}</b>
        </p>
      </div>
      <div className="userprofile-info-container">
        <img src={profile_pic} />
        <p>{about_user}</p>
      </div>
    </div>
  );
};

export default index;
