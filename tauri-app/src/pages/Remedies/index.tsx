import "./index.css";
import { useState } from "react";
import { useProfile } from "@/stores/profile";

import Ratings from "../../components/Ratings";
import RemedyCard from "../../components/RemedyCard/";
import AddRemedyComponent from "../../components/AddRemedyComponent/";
import Remedy from "../remedy";
//@ts-ignore
const index = ({ save, formFunc, form, remediesData, docsWithImageUrls }) => {
  const [remedies, setRemedies] = useState([
    {
      name: "Lavendar Scalp Treament",
      description:
        "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat...",
      desc: "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.",
      useUrl: "/pg.jpg",
      rating: "1.5",
      created_by: "draky",
      // steps: [
      //   {
      //     name: "Clean Scalp Throughly",
      //     desc: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      //   },
      //   {
      //     name: "Apply Anti-Flammtory Cream",
      //     desc: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      //   },
      // ],
    },
    {
      name: "Aloe Vera Eczema Fix",
      description:
        "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat...",
      useUrl: "/pg.jpg",
      rating: "4",
      created_by: "dave",
    },
    {
      name: "Asthma Breathing Exercises",
      description:
        "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat...",
      useUrl: "/pg.jpg",
      rating: "3.5",
      created_by: "nikki",
    },
  ]);

  const isSignedIn = useProfile((state) => state.state.isSignedIn);
  const [showConnectWalletComponent, setShowConnectWalletComponent] =
    useState<boolean>(false);

  const [isDetailRemedyActive, setIsDetailRemedyActive] = useState(false);
  const [activeRemedy, setActiveRemedy] = useState(null);

  const url = "";
  // @ts-ignore
  const remedyClicked = (remedyDetail) => {
    setActiveRemedy(remedyDetail);
    setIsDetailRemedyActive(true);
  };

  // const [url,setUrl] = useState<string>('');

  // //@ts-ignore
  // const getUrl = (url) => {
  //   setUrl(url);
  // }

  const [isRated, setIsRated] = useState(false);
  const Rate = () => {
    if (!isRated) {
      setActiveRemedy({
        // @ts-ignore
        ...activeRemedy,
        // @ts-ignore
        rating: activeRemedy.rating + 1,
      });
    } else {
      setActiveRemedy({
        // @ts-ignore
        ...activeRemedy,
        // @ts-ignore
        rating: activeRemedy.rating - 1,
      });
    }
    setIsRated(!isRated);
  };

  const [isAddRemedyActive, setIsAddRemedyActive] = useState(false);
  const SignedInCheck = () => {
    if (isSignedIn) {
      setIsAddRemedyActive(!isAddRemedyActive);
    } else {
      setShowConnectWalletComponent(true);
    }
  };

  return (
    <div className="main-remedies-container">
      <div className="records-header">
        <h1>Get a quick Fix!</h1>
        <div
          className={
            !isAddRemedyActive ? "add-records-btn" : "close-add-records-btn"
          }
          onClick={() => SignedInCheck()}
        >
          <i className="fa fa-plus"></i>
        </div>
      </div>

      <div className="main-remedy-cards-container">
        {/* Dummy Remedy */}
        {remedies.map((remedy) => {
          return (
            <RemedyCard
              name={remedy.name}
              description={remedy.description}
              useUrl={remedy.useUrl}
              created_by={remedy.created_by}
              isClicked={[remedy, remedyClicked]}
              rating={remedy.rating}
            />
          );
        })}

        {/* Remedy Created by user */}
        {
          //@ts-ignore
          docsWithImageUrls.map(({ document, url }) => {
            return (
              <RemedyCard
                name={document.data.name}
                description={document.data.description}
                useUrl={document.data.useUrl}
                created_by={document.data.created_by}
                //@ts-ignore
                isClicked={[document.data, remedyClicked]}
                rating={document.data.rating}
              />
            );
          })
        }
      </div>
      {isDetailRemedyActive && (
        <div className="view-card-detail-container">
          <div className="active-remedy-container">
            <div
              className="rimg-container"
              style={{
                // @ts-ignore
                background: `url(${activeRemedy.useUrl})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <div
                className="r-close-btn"
                onClick={() => {
                  setIsDetailRemedyActive(false);
                  setActiveRemedy(null);
                }}
              >
                <i className="fa fa-plus"></i>
              </div>
              <div
                className="report-btn"
                onClick={() => {
                  alert("Report Sent!!");
                }}
              >
                <h3>Report</h3>
                <i className="fa-solid fa-circle-exclamation"></i>
              </div>

              <div onClick={() => Rate()} className="rd-container">
                {
                  // @ts-ignore
                  activeRemedy.rating
                }
                <i
                  style={{ opacity: `${isRated ? "1" : "0.5"}` }}
                  className="fa fa-leaf"
                ></i>
              </div>
            </div>
            <h1>
              {
                // @ts-ignore
                activeRemedy.name
              }{" "}
            </h1>

            <div className="remedy-main-info-container">
              <p style={{ marginLeft: "0px" }}>
                {
                  // @ts-ignore
                  activeRemedy.description
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {isAddRemedyActive && (
        <div
          className="add-remedy-container"
          style={{ zIndex: `${isAddRemedyActive ? "5" : "5"}` }}
        >
          <AddRemedyComponent
            //@ts-ignore
            saveFunc={save}
            formFunc={formFunc}
            form={form}
          />
        </div>
      )}

      {showConnectWalletComponent && (
        <div
          onClick={() => setShowConnectWalletComponent(false)}
          className="add-remedy-container"
        >
          <div
            className="connect-wallet-container"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h1>Unauthorized - Please Sign in</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
