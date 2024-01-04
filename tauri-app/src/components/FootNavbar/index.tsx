import "./index.css";

const index = () => {
  return (
    <div className="footer-container">
      <div className="footer-logo-right-container">
        <h1>
          Pulse<span>Pal</span>
        </h1>
        <p>Copyright © 2023</p>
      </div>
      <div className="footer-link-container">
        <div className="footer-utils-link-container">
          <h1>
            <a href="#">Home</a>
          </h1>
          <h1>
            <a href="#">DIY Remedies</a>
          </h1>
          <h1>
            <a href="#">Contact Us</a>
          </h1>
        </div>
        <hr className="footer-line" />
        <div className="team-container">
          <p>
            Made with <i className="fa fa-heart"></i> by pulsepal team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default index;
