import "./index.css";
import { useEffect, useState } from "react";
import { format } from "date-fns";

import AddCardComponent from "../../components/AddCardComponent";
import DetailCardComponent from "../../components/DetailCardComponent";

import Card from "../../components/Card";
import { useProfile } from "@/stores/profile";
import useWeb5Store from "@/stores/useWeb5Store";
import { fetchRecords } from "./utils";

const index = () => {
  const agent = useWeb5Store(state => ({ web5: state.web5!, did: state.did! }))
  const profile = useProfile(state => state.state.profile!)

  const [cardsData, setCardsData] = useState<CardData[]>([
    // {
    //   title: "Diabetes Docs",
    //   description: "documentation of test ran for diagonese of diabtets slated for type dissertion",
    //   date: "1/2/24",
    //   file_extension: "pdf",
    //   file_name: "Diabetes_scan.pdf",
    // },
    // {
    //   title: "Diabetes Docs",
    //   description: "documentation of test ran for diagonese of diabtets slated for type dissertion",
    //   date: "1/2/24",
    //   file_extension: "pdf",
    //   file_name: "Diabetes_scan.pdf",
    //   other_files: [
    //     { file_name: "cat scan", file_extension: "pdf", file_url: "some url" },
    //     { file_name: "cat scan", file_extension: "pdf", file_url: "some url" },
    //   ],
    // },
    // {
    //   title: "Diabetes Docs",
    //   description: "documentation of test ran for diagonese of diabtets slated for type dissertion",
    //   date: "1/2/24",
    //   file_extension: "docx",
    //   file_name: "Diabetes_test.docx",
    //   other_files: [
    //     { file_name: "cat scan", file_extension: "pdf", file_url: "some url" },
    //     { file_name: "cat scan", file_extension: "pdf", file_url: "some url" },
    //   ],
    // },
    // {
    //   desc: "documentation of test ran for diagonese of diabtets slated for type dissertion",
    //   date: "1/2/24",
    //   file_extension: "jpg",
    //   file_name: "D_IMG1103.jpg",
    //   file_1_url: "../../../public/pic.jpg",
    //   other_files: [
    //     { file_name: "cat scan", file_extension: "pdf", file_url: "some url" },
    //     { file_name: "cat scan", file_extension: "pdf", file_url: "some url" },
    //   ],
    // },
  ]);

  useEffect(() => {
    refetchRecords()
  }, [])

  const refetchRecords = async () => {
    const records = await fetchRecords(agent, profile)
    console.log('records:', records)

    if (!records) return

    setCardsData(records)

    return
  }

  const [isAddCardActive, setIsAddCardActive] = useState(false);
  const [isCardDetailActive, setIsCardDetailActive] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  // @ts-ignore
  const isCardClicked = (cardDetail) => {
    setIsCardDetailActive(!isCardDetailActive);
    setIsAddCardActive(false);
    setActiveCard(cardDetail);
  };

  return (
    <div className="main-records-container">
      <div className="records-header">
        <h1>Records</h1>
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
        {cardsData.length > 0 ? cardsData.map((card) => {
          return (
            <Card
              file_name={card.file.name}
              file_extension={card.file.type.split("/")[1]}
              title={card.title}
              date={format(new Date(card.dateCreated), "dd/MM/yyyy")}
              desc={card.description}
              cardUtils={[card, isCardClicked]}
            />
          );
        }) : <div className="no-records">No Records Found</div>}
      </div>
      {(isAddCardActive || isCardDetailActive) && (
        <div
          className="add-card-container"
          style={{ zIndex: `${isCardDetailActive ? "7" : "6"}` }}
        >
          <div className="component-container">
            {isAddCardActive && <AddCardComponent
              profile={profile}
              agent={agent}
              onClose={() => {
                setIsAddCardActive(false)
                refetchRecords()
              }} />
            }
            {isCardDetailActive && (
              <DetailCardComponent
                // @ts-ignore
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
