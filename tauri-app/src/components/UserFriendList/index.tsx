import "./index.css";
import React, { FC, useState } from "react";

interface FriendTagProp {
  friendProfileImg: string;
  friendName: string;
  isFriendOnline: boolean;
}

const FriendTag: FC<FriendTagProp> = ({
  friendProfileImg,
  friendName,
  isFriendOnline,
}) => {
  return (
    <div className="friend-tag-container">
      <img src={friendProfileImg} />
      <h1>{friendName.slice(0, 6) + "..."}</h1>
      <i
        className="fas fa-wifi"
        style={{
          color: `${
            isFriendOnline ? "var(--color-green)" : "var(--color-red)"
          }`,
        }}
      />
    </div>
  );
};

interface UserFriendListProp {
  friendList: FriendTagProp[];
}

const index: FC = ({ friendList }) => {
  return (
    <div className="friends-list-container">
      <div className="friends-list-header">
        <h1>Friends</h1>
      </div>
      <div className="friend-main-list-container">
        {friendList.map((friend) => {
          return (
            <>
              <FriendTag
                friendProfileImg={friend.profile_pic}
                isFriendOnline={friend.isOnline}
                friendName={friend.username}
              />
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default index;
