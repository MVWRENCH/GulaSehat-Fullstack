// import blankProfile from '../../public/'

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const ChatPreview = () => {
  return (
    <div className="chat-preview">
      <span>
        <img src="/blank-profile.jpg" alt="" />

        <div className="text">
          <b>Name</b>
          <p>Dok, kaki saya tinggal 1 kenapa ya?</p>
        </div>
      </span>
      <ion-icon name="play"></ion-icon>
    </div>
  );
};

const BubbleChat = ({ position }) => {
  return (
    <div
      className="bubble-chat-outer"
      style={{
        justifyContent: position === "left" ? "start" : "end",
      }}
    >
      <img src="/blank-profile.jpg" alt="" />
      <div className={`bubble-chat-${position}`}>
        yo chat {position}
        <div className="chat-time">12:03 PM</div>
      </div>
    </div>
  );
};

export default function Chat() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <span>
        <h1>Dashboard</h1>
        <p>
          Hi <b>{user.Username}</b> . Welcome back to GulaSehat!
        </p>
      </span>
      <div className="chat-outer">
        <div className="chat-container">
          <div className="chat-left">
            <div className="container">
              <h3>Message</h3>
              <ChatPreview />
              <ChatPreview />
            </div>
          </div>
          <div className="chat-right">
            <div className="container">
              <div className="top-section">
                <img src="/blank-profile.jpg" alt="" />
                <span>
                  <h4 className="contact-name">Contact Name</h4>
                  <p className="chat-id">#QIWIOEU129</p>
                </span>
              </div>
              <div className="chat-room">
                <BubbleChat position="left" />
                <BubbleChat position="right" />
                <BubbleChat position="left" />
                <BubbleChat position="right" />
                <BubbleChat position="left" />
                <BubbleChat position="right" />
              </div>
              <div className="bottom-section">
                <input type="text" placeholder="Type new message"/>
                <ion-icon name="send-outline"></ion-icon>
                <ion-icon name="attach-outline"></ion-icon>
                <ion-icon name="checkmark-outline"></ion-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
