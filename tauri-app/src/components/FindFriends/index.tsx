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
        <button>
          Send A Friend Request{" "}
          <i style={{ marginLeft: "10px" }} className="fa fa-user-plus"></i>
        </button>
      </div>
    </div>
  );
};

const index: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 5000);
  return (
    <div
      className="find-friends-container"
      onClick={(e) => e.stopPropagation()}
    >
      {isLoading ? (
        <>
          <div className="loading-container">
            <div className="g-pluse"></div>
            <div className="b-pluse"></div>

            <div className="pluse-container">
              <i className="fa fa-user"></i>
            </div>
          </div>
          <h3>Recommending friends based off medical records...</h3>
        </>
      ) : (
        <>
          <div className="requests-container">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => {
              return <FriendRequest />;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default index;
