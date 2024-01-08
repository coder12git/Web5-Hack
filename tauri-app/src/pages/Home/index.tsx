import "./index.css";
import { useProfile } from "@/stores/profile";
import SignUpForm from "./SignUpForm";
import AuthGuard from "@/components/Auth/Guard";
import { Link } from "react-router-dom";

export default function HomePage() {
  const showAuthModal = useProfile(state => state.showAuthModal);

  return (
    <>
      <div className="main_container">
        <div className="main_info_container">
          <div className="info_container">
            <b id="header">
              Hi welcome to,
              <b>
                pulse<span>Pal</span>
              </b>
            </b>
            <h1>Stay up & running while connected</h1>
            <p>
              Welcome to PulsePal, your health guardian in WEB5. Safely store
              medical records with decentralized identifiers and web nodes,
              ensuring data security. Connect with similar conditions, share
              home remedies with a rating system, and access specialized doctors
              based on your location. PulsePal – where advanced technology meets
              user-friendly design for your secure, connected health journey.
            </p>
            <Link to="/connect">
              <button type="button" className="gs_btn">
                Get Started! <i className="fa fa-fire" />
              </button>
            </Link>
          </div>
          <div className="img-container"></div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#0ea5e9"
            fill-opacity="1"
            d="M0,96L21.8,106.7C43.6,117,87,139,131,170.7C174.5,203,218,245,262,250.7C305.5,256,349,224,393,197.3C436.4,171,480,149,524,149.3C567.3,149,611,171,655,154.7C698.2,139,742,85,785,101.3C829.1,117,873,203,916,240C960,277,1004,267,1047,240C1090.9,213,1135,171,1178,170.7C1221.8,171,1265,213,1309,208C1352.7,203,1396,149,1418,122.7L1440,96L1440,320L1418.2,320C1396.4,320,1353,320,1309,320C1265.5,320,1222,320,1178,320C1134.5,320,1091,320,1047,320C1003.6,320,960,320,916,320C872.7,320,829,320,785,320C741.8,320,698,320,655,320C610.9,320,567,320,524,320C480,320,436,320,393,320C349.1,320,305,320,262,320C218.2,320,175,320,131,320C87.3,320,44,320,22,320L0,320Z"
          ></path>
        </svg>
        <div className="techstack-container">
          <h1>Major Technologies</h1>
          <div className="tech-container">
            <div className="tech">
              <i className="fab fa-hive"></i>
              <h2>WEB5</h2>
              <p>
                PulsePal utililizes WEB5 to ensure the immutability of user data
                stored making it a breeze to safely store medical data and
                records.
              </p>
            </div>
            <div className="tech">
              <i className="fa-solid fa-robot"></i>
              <h2>A.I</h2>
              <p>
                PulsePal uses artificial intelligence to aid users with similiar
                medical conditions, find matches who can relate with them and
                also find doctors/specialist within there regions on such
                condition.
              </p>
            </div>
            <div className="tech">
              <i className="fa-brands fa-react"></i>
              <h2>React</h2>
              <p>
                PulsePal employes react a frontend framework to power our
                frontend along with typescript enabling better user experience
                and smoother and faster development,updates and feature roll
                outs giving quality product delivery.
              </p>
            </div>
          </div>
        </div>
        <svg
          id="b-wave-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#0ea5e9"
            fill-opacity="1"
            d="M0,64L24,96C48,128,96,192,144,224C192,256,240,256,288,261.3C336,267,384,277,432,234.7C480,192,528,96,576,69.3C624,43,672,85,720,85.3C768,85,816,43,864,58.7C912,75,960,149,1008,160C1056,171,1104,117,1152,128C1200,139,1248,213,1296,250.7C1344,288,1392,288,1416,288L1440,288L1440,0L1416,0C1392,0,1344,0,1296,0C1248,0,1200,0,1152,0C1104,0,1056,0,1008,0C960,0,912,0,864,0C816,0,768,0,720,0C672,0,624,0,576,0C528,0,480,0,432,0C384,0,336,0,288,0C240,0,192,0,144,0C96,0,48,0,24,0L0,0Z"
          ></path>
        </svg>
        <div className="more-info-container">
          <div className="img-blob-container"></div>
          <div className="mi-container">
            <h1>
              "Our <span>Culture</span>"
            </h1>
            <p>
              A culture where innovation and empathy converge to create
              impactful solutions. Team members are driven by a shared
              commitment to improving healthcare outcomes through cutting-edge
              technology.
            </p>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#22c55e"
            fill-opacity="1"
            d="M0,192L18.5,170.7C36.9,149,74,107,111,122.7C147.7,139,185,213,222,245.3C258.5,277,295,267,332,245.3C369.2,224,406,192,443,160C480,128,517,96,554,69.3C590.8,43,628,21,665,48C701.5,75,738,149,775,186.7C812.3,224,849,224,886,218.7C923.1,213,960,203,997,165.3C1033.8,128,1071,64,1108,32C1144.6,0,1182,0,1218,26.7C1255.4,53,1292,107,1329,128C1366.2,149,1403,139,1422,133.3L1440,128L1440,320L1421.5,320C1403.1,320,1366,320,1329,320C1292.3,320,1255,320,1218,320C1181.5,320,1145,320,1108,320C1070.8,320,1034,320,997,320C960,320,923,320,886,320C849.2,320,812,320,775,320C738.5,320,702,320,665,320C627.7,320,591,320,554,320C516.9,320,480,320,443,320C406.2,320,369,320,332,320C295.4,320,258,320,222,320C184.6,320,148,320,111,320C73.8,320,37,320,18,320L0,320Z"
          ></path>
        </svg>
        <div className="main-testimonial-container">
          <h1>Testimonials</h1>
          <div className="testimonial-container">
            <div className="t-container-1">
              <div className="testimonial">
                <div className="user-info">
                  <img src="/pic.jpg" />
                  <h2>Dave</h2>
                </div>
                <div className="info">
                  <p>
                    <b>PulsePal</b> has being awesome so far making it a breeze
                    to keep track of my medical history coupled with guidance
                    have made staying healthy so much more accessible. The
                    user-friendly interface and helpful <b>home remedies</b>{" "}
                    keep me on prepared for emergency breakouts.{" "}
                    <b>Thank you</b>
                  </p>
                </div>
              </div>
              <div className="testimonial">
                <div className="user-info">
                  <img src="/pm.jpg" />
                  <h2>Greg</h2>
                </div>
                <div className="info">
                  <p>
                    Knowing that <b>blockchain</b> is being used and it's
                    immutaility makes feel safer from losing such vital records
                    and there
                    <b>chat functionality</b> is quite great feel's nice to know
                    others with the same condition as me.<b>Great job</b>
                  </p>
                </div>
              </div>
            </div>
            <div className="testimonial-2">
              <div className="user-info">
                <img src="/pg.jpg" />
                <h2>Nikki</h2>
              </div>
              <div className="info">
                <p>
                  Using it for quite a while now and it had being nice
                  especially a <b>beta</b> feature,i heard it can find out what
                  is wrong with your just from your
                  <b>finger print</b> it is cool can't wait for the roll
                  out,talk about <b>a.i in action</b>
                </p>
              </div>
            </div>
          </div>
        </div>
        <svg
          id="b-wave-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#22c55e"
            fill-opacity="1"
            d="M0,128L10,154.7C20,181,40,235,60,240C80,245,100,203,120,160C140,117,160,75,180,69.3C200,64,220,96,240,133.3C260,171,280,213,300,218.7C320,224,340,192,360,202.7C380,213,400,267,420,256C440,245,460,171,480,122.7C500,75,520,53,540,48C560,43,580,53,600,96C620,139,640,213,660,229.3C680,245,700,203,720,176C740,149,760,139,780,117.3C800,96,820,64,840,69.3C860,75,880,117,900,149.3C920,181,940,203,960,208C980,213,1000,203,1020,170.7C1040,139,1060,85,1080,53.3C1100,21,1120,11,1140,42.7C1160,75,1180,149,1200,192C1220,235,1240,245,1260,229.3C1280,213,1300,171,1320,149.3C1340,128,1360,128,1380,128C1400,128,1420,128,1430,128L1440,128L1440,0L1430,0C1420,0,1400,0,1380,0C1360,0,1340,0,1320,0C1300,0,1280,0,1260,0C1240,0,1220,0,1200,0C1180,0,1160,0,1140,0C1120,0,1100,0,1080,0C1060,0,1040,0,1020,0C1000,0,980,0,960,0C940,0,920,0,900,0C880,0,860,0,840,0C820,0,800,0,780,0C760,0,740,0,720,0C700,0,680,0,660,0C640,0,620,0,600,0C580,0,560,0,540,0C520,0,500,0,480,0C460,0,440,0,420,0C400,0,380,0,360,0C340,0,320,0,300,0C280,0,260,0,240,0C220,0,200,0,180,0C160,0,140,0,120,0C100,0,80,0,60,0C40,0,20,0,10,0L0,0Z"
          ></path>
        </svg>
        <div
          className="techstack-container"
          style={{
            background: "var(--color-white)",
          }}
        >
          <h1 style={{ color: "var(--color-black)" }}>Major Features</h1>
          <div className="tech-container">
            <div className="tech">
              <i className="fa-solid fa-lock"></i>
              <h2>Secure Storage</h2>
              <p>
                Medical records are stored with the utmost security using WEB5,
                guaranteeing data integrity and user control over their personal
                health information.
              </p>
            </div>
            <div className="tech">
              <i className="fa fa-users"></i>
              <h2>Find Your Tribe</h2>
              <p>
                Our platform goes beyond conventional networking by employing a
                sophisticated algorithm to match users based on their medical
                records. PulsePal becomes a virtual community where individuals
                can share experiences, insights, and support each other on their
                health journeys.
              </p>
            </div>
            <div className="tech">
              <i className="fa fa-medkit"></i>
              <h2>Home Remedies</h2>
              <p>
                PulsePal empowers users to contribute and share simple yet
                effective home remedies. A user-driven rating system ensures the
                most beneficial remedies rise to the top, creating a
                community-driven repository of wellness solutions.
              </p>
            </div>
            <div className="tech">
              <i className="fas fa-user-md"></i>
              <h2>Find Specialist</h2>
              <p>
                Wherever you are, PulsePal provides a seamless experience by
                recommending specialized doctors in your nearby areas based on
                your current location, enhancing accessibility to healthcare
                professionals.
              </p>
            </div>
          </div>
        </div>
        {showAuthModal && (
          <AuthGuard>
            <SignUpForm />
          </AuthGuard>
        )}
      </div >
    </>
  );
}
