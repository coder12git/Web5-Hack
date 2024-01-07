import "./index.css";
import React, { FC, useState } from "react";
import { CardData } from "@/pages/Records/utils";

// interface OtherFileProp {
//   title: String;
//   file_extension: string;
//   file_name: string;
//
//   file_url: string;
// }

// interface CardDataProps {
//   file_name: String;
//   file_extension: string;
//   title: String;
//   desc: String;
//   date: String;
//   other_files: OtherFileProp[];
// }

interface CardProp {
  // cardData: CardDataProps;
  cardData: CardData
  close: (isCardDetailActive: boolean) => void;
}

const index: FC<CardProp> = ({ cardData, close }) => {
  const [supportedIMGExtensions, setSupportedIMGExtensions] = useState([
    "jpg",
    "png",
    "jpeg",
  ]);

  return (
    <div className="main-detail-container">
      <div className="close-btn" onClick={() => close(false)}>
        <i className="fa fa-plus" />
      </div>
      <h1>{cardData.title ? cardData.title : cardData.file.name}</h1>
      {supportedIMGExtensions.includes(cardData.file.type.split("/")[1]) && (
        <div className="image-container">
          <img src={cardData.file.url} alt={cardData.file.name} />
        </div>
      )}
      <p>{cardData.description}</p>
      <div className="other-files-container">
        {cardData.otherFiles.map((file) => {
        const fileExtension = file.type.split("/")[1]
            return (
              <div className="file-container">
                {fileExtension === "pdf" && (
                  <i
                    style={{ color: "var(--color-red)" }}
                    className="fa-solid fa-file-pdf" />
                )}
                {fileExtension === "docx" && (
                  <i
                    style={{ color: "var(--color-green)" }}
                    className="fas fa-file-word" />
                )}
                {supportedIMGExtensions.includes(fileExtension) && (
                  <i
                    className="fa-solid fa-image"
                    style={{ color: "var(--color-blue)" }} />
                )}
                <a href={file.url}>
                  <h3>{file.name}</h3>
                </a>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default index;
