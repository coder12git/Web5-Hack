import "./index.css";

const index = () => {
  return (
    <div className="main_navbar_container">
      <div className="logo_container">
        <i className="fa-brands fa-paypal"></i>
        <i className="fa fa-heartbeat"></i>
      </div>
      <div className="comp_menu_container">
        <div>
          <i className="fa fa-home"></i>
          <h3>Home</h3>
        </div>
        <div>
          <i className="fa fa-database"></i>
          <h3>Records </h3>
          <span>28</span>
        </div>
        <div>
          <i className="fas fa-comment-alt"></i>
          <h3>Chats </h3>
          <span>5</span>
        </div>
        <div>
          <i className="fas fa-first-aid"></i>
          <h3>DIY Remedies</h3>
          <span>99+</span>
        </div>
      </div>
      <div className="auth_container">
        <h3>Join us!</h3>
        <i className="fa fa-user"></i>
      </div>
    </div>
  );
};

export default index;
