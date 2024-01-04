import "./index.css";
import { useState } from "react";

const FileUploader = () => {
  const [file, setFile] = useState(null);

  return (
    <div className={!file ? "form-container" : "form-container-active"}>
      <input
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
        type="file"
        accept=".jpg,.png,.jpeg,.docx,.pdf"
      />
    </div>
  );
};

const index = () => {
  const [fileUploaders, setUploaderFile] = useState([<FileUploader />]);
  return (
    <div className="main-add-card-container">
      <h1>Create New Record</h1>
      <div className="input-form">
        {fileUploaders.length > 2 && <p>Max file uploads reached</p>}
        <div
          className={fileUploaders.length > 2 ? "sadd-mu" : "add-mu"}
          onClick={() =>
            fileUploaders.length > 2
              ? null
              : setUploaderFile([...fileUploaders, <FileUploader />])
          }
        >
          <i className="fa fa-plus"></i>
        </div>
        {fileUploaders.map((Uploader) => {
          return Uploader;
        })}
        <input type="text" placeholder="Title(Optional)" />
        <textarea placeholder="What the diagnosis!"></textarea>
        <button>Save</button>
        <p>
          *ensure inputted information are correct as once saved it cannot be
          deleted/edited
        </p>
      </div>
    </div>
  );
};

export default index;
