import "./index.css";
import { useState } from "react";

const index = ({ cardData, close }) => {
  const [supportedIMGExtensions, setSupportedIMGExtensions] = useState([
    "jpg",
    "png",
    "jpeg",
  ]);

  return (
    <div className="main-detail-container">
      <div className="close-btn" onClick={() => close(false)}>
        <i className="fa fa-plus"></i>
      </div>
      <h1>{cardData.title ? cardData.title : cardData.file_name}</h1>
      {supportedIMGExtensions.includes(cardData.file_extension) && (
        <div className="image-container">
          <img src={"../../public/pic.jpg"} />
        </div>
      )}
      <p>{cardData.desc}</p>
      <div className="other-files-container">
        {cardData.other_files &&
          cardData.other_files.map((file) => {
            return (
              <div className="file-container">
                {file.file_extension == "pdf" && (
                  <i
                    style={{ color: "var(--color-red)" }}
                    className="fa-solid fa-file-pdf"
                  ></i>
                )}
                {file.file_extension == "docx" && (
                  <i
                    style={{ color: "var(--color-green)" }}
                    className="fas fa-file-word"
                  ></i>
                )}
                {supportedIMGExtensions.includes(file.file_extension) && (
                  <i
                    className="fa-solid fa-image"
                    style={{ color: "var(--color-blue)" }}
                  ></i>
                )}
                <a href={file.file_url}>
                  <h3>{file.file_name}</h3>
                </a>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default index;
