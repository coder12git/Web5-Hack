import "./index.css";
import React, { FC } from "react";

interface MessageProp {
  message: string;
  isLeft: boolean;
}

const Message: FC<MessageProp> = ({ message, isLeft }) => {
  return (
    <div className="msg-container" style={{ justifyContent: "right" }}>
      <div className={isLeft ? "msg-f" : "msg-t"}>
        <p>{message}</p>
      </div>
    </div>
  );
};
//@ts-ignore
const index: FC = ({ setHideChat, hideChat }) => {
  return (
    <div className="m-chat-m-container">
      <div className="m-chats-container">
        <Message message={"Hi Larry"} isLeft={false} />
        <Message message={"Sup Greg"} isLeft={true} />
        <Message
          message={
            "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."
          }
          isLeft={false}
        />
        <Message
          message={
            "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat."
          }
          isLeft={true}
        />
        <Message
          message={
            "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis."
          }
          isLeft={true}
        />
        <Message
          message={
            "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat."
          }
          isLeft={false}
        />
      </div>
      <div className="m-chat-message-input-container">
        <input type="text" placeholder="Say Hi!" />
        <button>
          <i className="fa fa-caret-right"></i>
        </button>
        <button
          style={{
            background: "var(--color-red)",
            boxShadow: "var(--box-shadow-red)",
            transform: "rotate(45deg)",
          }}
          onClick={() => setHideChat(!hideChat)}
        >
          <i className="fa fa-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default index;
