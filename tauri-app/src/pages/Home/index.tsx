import "./index.css";

export default function Home() {
  return (
    <>
      <div className="main_container">
        <div className="main_info_container">
          <div className="info_container">
            <b className="header">
              Hi welcome to,
              <b>
                pulse<span>pal</span>
              </b>
            </b>
            <h1>Stay up & running while connected</h1>
            <p>
              Pulsepal utilizes web5 to safely store critical user medical
              records.Keeping it safe from data loss and give the user full
              control over there data as well as keeping,verifying and tracking
              home remedies from people with similar conditions while keeping
              them connected
            </p>
            <button className="gs_btn">
              Get Started! <i className="fa fa-fire"></i>
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
