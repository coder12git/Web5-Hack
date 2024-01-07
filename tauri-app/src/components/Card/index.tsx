import "./index.css";
import React, { FC, useState } from "react";

interface CardProp {
  file_name: String;
  file_extension: string;
  title: String;
  desc: String;
  date: String;
  cardUtils: any[];
}

const index: FC<CardProp> = ({
  file_name,
  file_extension,
  title,
  desc,
  date,
  cardUtils,
}) => {
  const [supportedIMGExtensions, setSupportedIMGExtensions] = useState([
    "jpg",
    "png",
    "jpeg",
  ]);
  return (
    <div className="main-card-container">
      <div className="card-header">
        {file_extension == "pdf" && (
          <i
            style={{ color: "var(--color-red)" }}
            className="fa-solid fa-file-pdf"
          ></i>
        )}
        {file_extension == "docx" && (
          <i
            style={{ color: "var(--color-green)" }}
            className="fas fa-file-word"
          ></i>
        )}
        {supportedIMGExtensions.includes(file_extension) && (
          <i
            className="fa-solid fa-image"
            style={{ color: "var(--color-blue)" }}
          ></i>
        )}

        <h1>{title ? title : file_name}</h1>
      </div>
      <div className="info-container">
        <p>{desc.substring(0, 50)}</p>
        <div className="date-container">
          <i className="fas fa-save"></i>
          <span>{date}</span>
        </div>
        <button onClick={() => cardUtils[1](cardUtils[0])} className="vbtn">
          View more
        </button>
      </div>
    </div>
  );
};

export default index;
