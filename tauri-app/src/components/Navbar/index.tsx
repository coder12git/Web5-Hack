import ProfileGuard from "../Auth/Profile/Guard";
import "./index.css";
import { NavLink } from "react-router-dom";
import useWeb5Store from "@/stores/useWeb5Store.ts";
import { Agent } from "../Auth/types";
import { useProfile } from "@/stores/profile.ts";
import { useState, useRef } from "react";

const SignedInBtn = () => {
  const { profile, signOut } = useProfile((store) => ({
    profile: store.state.profile!,
    signOut: store.signOut,
  }));
  const [showSignOutUtils, setShowSignOutUtils] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const copyRef = useRef(null);

  return (
    <>
      {showSignOutUtils && (
        <div className="did-container">
          <div>
            <b style={{ fontFamily: "Roboto" }}>DID:</b>
            <input
              ref={copyRef}
              type="text"
              value={profile.did}
              placeholder="did field"
            />
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
          <button
            type="button"
            className="auth_container"
            onClick={() => signOut()}
          >
            <h3>Sign Out</h3>
            <i className="fa fa-sign-out" />
          </button>
        </div>
      )}

      <button
        type="button"
        className="auth_container"
        onClick={() => {
          setIsCopied(false);
          setShowSignOutUtils(!showSignOutUtils);
        }}
      >
        <h3>In App</h3>
        <i
          style={{ width: "max-content", height: "max-content" }}
          className="fa fa-cubes"
        />
      </button>
    </>
  );
};

const index = () => {
  const { web5, did } = useWeb5Store((state) => ({
    web5: state.web5,
    did: state.did,
  }));
  const { signIn, setShowAuthModal, signOut } = useProfile((state) => ({
    signIn: state.signIn,
    signOut: state.signOut,
    setShowAuthModal: state.setShowAuthModal,
  }));

  const beginAuthFlow = async (agent: Agent) => {
    const signedIn = await signIn(agent);
    if (!signedIn) {
      console.log("displaying auth modal");
      setShowAuthModal(true);
    }
  };

  return (
    <div className="main_navbar_container">
      <div className="logo_container">
        <i className="fa-brands fa-paypal" />
        <i className="fa fa-heartbeat" />
      </div>
      <div className="comp_menu_container">
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <div>
            <i className="fa fa-home" />
            <h3>Home</h3>
          </div>
        </NavLink>
        <NavLink to="/records" style={{ textDecoration: "none" }}>
          <div>
            <i className="fa fa-database" />
            <h3>Records </h3>
            <span>28</span>
          </div>
        </NavLink>
        <NavLink to="/chat" style={{ textDecoration: "none" }}>
          <div>
            <i className="fas fa-comment-alt" />
            <h3>Chats </h3>
            <span>5</span>
          </div>
        </NavLink>
        <NavLink to="/remedies" style={{ textDecoration: "none" }}>
          <div>
            <i className="fas fa-first-aid" />
            <h3>DIY Remedies</h3>
            <span>99+</span>
          </div>
        </NavLink>
        <NavLink to="/contact" style={{ textDecoration: "none" }}>
          <div>
            <i className="fa fa-address-book" />
            <h3>Contact</h3>
          </div>
        </NavLink>
      </div>
      <ProfileGuard
        fallback={
          <button
            type="button"
            className="auth_container"
            onClick={() => (web5 && did ? beginAuthFlow({ web5, did }) : null)}
          >
            <h3>Connect Wallet</h3>
            <i className="fa fa-user" />
          </button>
        }
      >
        <SignedInBtn />
      </ProfileGuard>
    </div>
  );
};

export default index;
