import "./index.css";
import React, { FC, useState } from "react";

interface FileProp {
  file: File | null | undefined;
}

const FileUploader: FC = () => {
  const [file, setFile] = useState<FileProp>({ file: null });

  return (
    <div className={!file?.file ? "form-container" : "form-container-active"}>
      <input
        onChange={(e) => {
          setFile({ file: e?.target?.files?.[0] });
        }}
        type="file"
        accept=".jpg,.png,.jpeg"
      />
    </div>
  );
};

interface StepProp {
  index: React.ReactNode;
}

//add stepFunction
//to trigger when save in main form is clicked
const StepField: FC<StepProp> = ({ index }) => {
  return (
    <div className="step-container">
      <h1>Step #{index}</h1>
      <input type="text" placeholder="Step title" />
      <textarea placeholder="What to do."></textarea>
    </div>
  );
};

const index: FC = () => {
  const [steps, setSteps] = useState<React.ReactElement[]>([
    <StepField index={1} />,
  ]);

  return (
    <div className="main-add-card-container">
      <h1>Create New Remedy</h1>
      <FileUploader />
      <div className="input-form-r">
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
