import "./index.css";
import { useState } from "react";

import AddCardComponent from "../../components/AddCardComponent";
import DetailCardComponent from "../../components/DetailCardComponent";

import Card from "../../components/Card";

const index = () => {
  const [cardsData, setCardsData] = useState([
    {
      title: "Diabetes Docs",
      desc: "documentation of test ran for diagonese of diabtets slated for type dissertion",
      date: "1/2/24",
      file_extension: "pdf",
      file_name: "Diabetes_scan.pdf",
    },
    {
      title: "Diabetes Docs",
      desc: "documentation of test ran for diagonese of diabtets slated for type dissertion",
      date: "1/2/24",
      file_extension: "pdf",
      file_name: "Diabetes_scan.pdf",
      other_files: [
        { file_name: "cat scan", file_extension: "pdf", file_url: "some url" },
        { file_name: "cat scan", file_extension: "pdf", file_url: "some url" },
      ],
    },
    {
      title: "Diabetes Docs",
      desc: "documentation of test ran for diagonese of diabtets slated for type dissertion",
      date: "1/2/24",
      file_extension: "docx",
      file_name: "Diabetes_test.docx",
      other_files: [
        { file_name: "cat scan", file_extension: "pdf", file_url: "some url" },
        { file_name: "cat scan", file_extension: "pdf", file_url: "some url" },
      ],
    },
    {
      desc: "documentation of test ran for diagonese of diabtets slated for type dissertion",
      date: "1/2/24",
      file_extension: "jpg",
      file_name: "D_IMG1103.jpg",
      file_1_url: "../../../public/pic.jpg",
      other_files: [
        { file_name: "cat scan", file_extension: "pdf", file_url: "some url" },
        { file_name: "cat scan", file_extension: "pdf", file_url: "some url" },
      ],
    },
  ]);

  const [isAddCardActive, setIsAddCardActive] = useState(false);
  const [isCardDetailActive, setIsCardDetailActive] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const isCardClicked = (cardDetail) => {
    setIsCardDetailActive(!isCardDetailActive);
    setIsAddCardActive(false);
    setActiveCard(cardDetail);
  };

  return (
    <div className="main-records-container">
      <div className="records-header">
        <h1>Records</h1>
        <div className="search-container"></div>
        <div
          className={
            !isAddCardActive ? "add-records-btn" : "close-add-records-btn"
          }
          onClick={() => setIsAddCardActive(!isAddCardActive)}
        >
          <i className="fa fa-plus"></i>
        </div>
      </div>
      <div className="cards-container">
        {cardsData.map((card) => {
          return (
            <Card
              file_name={card.file_name}
              file_extension={card.file_extension}
              title={card.title}
              date={card.date}
              desc={card.desc}
              cardUtils={[card, isCardClicked]}
            />
          );
        })}
      </div>
      {(isAddCardActive || isCardDetailActive) && (
        <div
          className="add-card-container"
          style={{ zIndex: `${isCardDetailActive ? "7" : "6"}` }}
        >
          <div className="component-container">
            {isAddCardActive && <AddCardComponent />}
            {isCardDetailActive && (
              <DetailCardComponent
                cardData={activeCard}
                close={setIsCardDetailActive}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
