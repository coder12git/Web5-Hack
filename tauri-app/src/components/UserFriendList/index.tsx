import { Friend } from "@/pages/Chat";
import "./index.css";
import React, { FC, useState, useRef } from "react";

interface FriendTagProp {
  friendProfileImg: string;
  friendName: string;
  isFriendOnline: boolean;
  newChat?: number;
  did?: string;
}

const FriendTag: FC<FriendTagProp> = ({
  friendProfileImg,
  friendName,
  isFriendOnline,
  newChat,
  did,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const didRef = useRef(null);

  return (
    <div className="friend-tag-container">
      <div>
        <img src={friendProfileImg} />
        {newChat && <span>{newChat}</span>}
      </div>
      <div
        style={{
          padding: "0px 5px",
        }}
      >
        <h1>{friendName.slice(0, 6) + "..."}</h1>
        <div className="m-did-container">
          <input ref={didRef} type="text" value={did} />

          {!isCopied ? (
            <i
              onClick={(e) => {
                e.stopPropagation();
                didRef.current.select();
                document.execCommand("copy");
                setIsCopied(true);
              }}
              className="fa-regular fa-copy"
            ></i>
          ) : (
            <i className="fas fa-check-double"></i>
          )}
        </div>
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

interface UserFriendListProp {
  friendList: FriendTagProp[];
  setHideChat: () => void;
  hideChat: boolean;
}

const index: FC<{ friendList: Friend[]}> = ({ friendList, setHideChat, hideChat }) => {
  return (
    <div className="friends-list-container">
      <div className="friends-list-header" style={{ background:"var(--color-blue)"}}>
        <h1>Friends</h1>
      </div>
      <div className="friend-main-list-container">
        {friendList.map((friend) => {
          return (
            <>
              <FriendTag
                friendProfileImg={friend.profilePictureUrl}
                isFriendOnline={friend.isOnline}
                friendName={friend.username}
                newChat={0}
                did={friend.did}
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
