import "./index.css";
import React, { FC, useState } from "react";

interface FriendTagProp {
  friendProfileImg: string;
  friendName: string;
  isFriendOnline: boolean;
  newChat?: number;
  setHideChat: () => void;
  hideChat: boolean;
}

interface UserFriendListProp {
  friendList: FriendTagProp[];
}

const FriendTag: FC<FriendTagProp> = ({
  friendProfileImg,
  friendName,
  isFriendOnline,
  newChat,
  setHideChat,
  hideChat,
}) => {
  return (
    <div
      onClick={() => setHideChat(!hideChat)}
      className="m-friend-tag-container"
    >
      <div>
        <img src={friendProfileImg} />
        {newChat && <span>{newChat}</span>}
      </div>
      <div>
        <h1>{friendName.slice(0, 20) + "..."}</h1>
      </div>
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

const index: FC<UserFriendListProp> = ({
  friendList,
  hideChat,
  setHideChat,
}) => {
  return (
    <div className="m-friends-list-container">
      <div className="m-header">
        <h1>Friends</h1>
      </div>
      <div className="m-friend-main-list-container">
        {friendList.map((friend) => {
          return (
            <>
              <FriendTag
                friendProfileImg={friend.profile_pic}
                isFriendOnline={friend.isOnline}
                friendName={friend.username}
                newChat={friend.newChat}
                setHideChat={setHideChat}
                hideChat={hideChat}
              />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default index;
