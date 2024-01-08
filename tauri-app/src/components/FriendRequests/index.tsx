import "./index.css";
import React, { FC, useState, useRef } from "react";

const FriendRequest: FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const copyRef = useRef(null);

  return (
    <div className="friend-request-container">
      <div className="friend-request-header">
        <img src={"/pg.jpg"} />
        <div>
          <p>@Hello.world</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input ref={copyRef} type="text" value="did" />
            {!isCopied ? (
              <i
                onClick={() => {
                  copyRef.current.select();
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
      </div>
      <div className="btn-container">
        <button>Accept</button>
        <button>Decline</button>
      </div>
    </div>
  );
};
const index: FC = () => {
  return (
    <div
      className="friend-requests-container"
      onClick={(e) => e.stopPropagation()}
    >
      <h1>Friend Requests!</h1>
      <div className="requests-container">
        {[1, 2, 3, 4, 5, 6, 7].map((num) => {
          return <FriendRequest />;
        })}
      </div>
    </div>
  );
};

export default index;
