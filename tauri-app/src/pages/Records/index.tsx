import "./index.css";
import { useEffect, useState } from "react";
import { format } from "date-fns";

import AddCardComponent from "../../components/AddCardComponent";
import DetailCardComponent from "../../components/DetailCardComponent";

import Card from "../../components/Card";
import { useProfile } from "@/stores/profile";
import useWeb5Store from "@/stores/useWeb5Store";
import { CardData, fetchRecords } from "./utils";
import toast, { Toaster } from "react-hot-toast";

const index = () => {
  const agent = useWeb5Store((state) => ({
    web5: state.web5!,
    did: state.did!,
  }));
  const profile = useProfile((state) => state.state.profile!);
  const isSignedIn = useProfile((state) => state.state.isSignedIn);

  const [showConnectWalletComponent, setShowConnectWalletComponent] =
    useState<boolean>(false);
  const [cardsData, setCardsData] = useState<CardData[]>([]);

  useEffect(() => {
    refetchRecords();
  }, []);

  const refetchRecords = async () => {
    const records = await fetchRecords(agent, profile);
    console.log("records:", records);

    if (!records) return;

    setCardsData(records);

    return;
  };

  const [isAddCardActive, setIsAddCardActive] = useState(false);
  const [isCardDetailActive, setIsCardDetailActive] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const SignedInCheck = () => {
    if (isSignedIn) {
      setIsAddCardActive(!isAddCardActive);
    } else {
      setShowConnectWalletComponent(true);
    }
  };
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
          onClick={() => SignedInCheck()}
        >
          <i className="fa fa-plus" />
        </div>
      </div>
      <div className="cards-container">
        {cardsData.length > 0 ? (
          cardsData.map((card) => {
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
          })
        ) : (
          <div className="no-records">No Records Found</div>
        )}
      </div>
      {(isAddCardActive || isCardDetailActive) && (
        <div
          className="add-card-container"
          style={{ zIndex: `${isCardDetailActive ? "7" : "6"}` }}
        >
          <div className="component-container">
            {isAddCardActive && (
              <AddCardComponent
                profile={profile}
                agent={agent}
                onClose={() => {
                  setIsAddCardActive(false);
                  refetchRecords();
                }}
              />
            )}
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
      {showConnectWalletComponent && (
        <div
          onClick={() => setShowConnectWalletComponent(false)}
          className="add-card-container"
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
