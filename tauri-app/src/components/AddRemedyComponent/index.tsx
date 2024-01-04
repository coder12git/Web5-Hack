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
        accept=".jpg,.png,.jpeg"
      />
    </div>
  );
};

const StepField = ({ addStep, index }) => {
  return (
    <div className="step-container">
      <h1>Step #{index}</h1>
      <input type="text" placeholder="Step title" />
      <textarea placeholder="What to do."></textarea>
    </div>
  );
};

const index = () => {
  const [steps, setSteps] = useState([<StepField index={1} />]);
  return (
    <div className="main-add-card-container">
      <h1>Create New Remedy</h1>
      <FileUploader />
      <div className="input-form">
        <input type="text" placeholder="Title" />
        <textarea placeholder="Let's know your remdy"></textarea>
        <div>
          <div
            className="add-mu"
            onClick={() =>
              setSteps([...steps, <StepField index={steps.length + 1} />])
            }
          >
            <i className="fa fa-plus"></i>
          </div>
          {steps.map((Field) => {
            return Field;
          })}
        </div>
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
