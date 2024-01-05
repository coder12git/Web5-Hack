import AccountGuard from "../Auth/Account/Guard";
import "./index.css";
import { NavLink } from "react-router-dom";

const index = () => {
  return (
    <div className="main_navbar_container">
      <div className="logo_container">
        <i className="fa-brands fa-paypal"></i>
        <i className="fa fa-heartbeat"></i>
      </div>
      <div className="comp_menu_container">
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <div>
            <i className="fa fa-home"></i>
            <h3>Home</h3>
          </div>
        </NavLink>
        <NavLink to="/records" style={{ textDecoration: "none" }}>
          <div>
            <i className="fa fa-database"></i>
            <h3>Records </h3>
            <span>28</span>
          </div>
        </NavLink>
        <NavLink to="/chat" style={{ textDecoration: "none" }}>
          <div>
            <i className="fas fa-comment-alt"></i>
            <h3>Chats </h3>
            <span>5</span>
          </div>
        </NavLink>
        <NavLink to="/remedies" style={{ textDecoration: "none" }}>
          <div>
            <i className="fas fa-first-aid"></i>
            <h3>DIY Remedies</h3>
            <span>99+</span>
          </div>
        </NavLink>
        <NavLink to="/contact" style={{ textDecoration: "none" }}>
          <div>
            <i className="fa fa-address-book"></i>
            <h3>Contact</h3>
          </div>
        </NavLink>
      </div>
      <AccountGuard fallback={
        <div className="auth_container">
          <h3>Join us!</h3>
          <i className="fa fa-user"></i>
        </div>
      }>
        <div className="auth_container">
          <h3>Profile</h3>
          <i className="fa fa-user"></i>
        </div>
      </AccountGuard>
    </div>
  );
};

export default index;
