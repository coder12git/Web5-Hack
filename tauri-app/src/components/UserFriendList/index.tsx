import "./index.css";
import React, { FC, useState } from "react";

interface FriendTagProp {
  friendProfileImg: string;
  friendName: string;
  isFriendOnline: boolean;
  newChat?: number;
}

const FriendTag: FC<FriendTagProp> = ({
  friendProfileImg,
  friendName,
  isFriendOnline,
  newChat,
}) => {
  return (
    <div className="friend-tag-container">
      <div>
        <img src={friendProfileImg} />
        {newChat && <span>{newChat}</span>}
      </div>
      <h1>{friendName.slice(0, 6) + "..."}</h1>
      <i
        className="fa fa-cube"
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
  setHideChat: () => void;
  hideChat: boolean;
}

const index: FC = ({ friendList, setHideChat, hideChat }) => {
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
                newChat={friend.newChat}
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
