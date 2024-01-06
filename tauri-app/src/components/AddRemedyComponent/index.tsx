import "./index.css";
import React, { FC, useState } from "react";
import Remedies from '../../pages/Remedies'

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

//@ts-ignore
const index: FC = ({saveFunc, formFunc, form}) => {
  const [steps, setSteps] = useState<React.ReactElement[]>([
    <StepField index={1} />,
  ]);

  return (
    <div className="main-add-card-container">
      <h1>Create New Remedy</h1>
      {/* <FileUploader /> */}
      <form 
      onSubmit={(e) => {
      e.preventDefault()
      saveFunc()
      }}
      >
      <div className="input-form">
        <input type="text" placeholder="Title" required={true}
        onChange={(e) => formFunc({ ...form, name: e.target.value })}
        />
        <textarea placeholder="Let's know your remedy" required={true}
        onChange={(e) => formFunc({ ...form, description: e.target.value })}
        />
        <input type="text" placeholder="Created By" required={true}
        onChange={(e) => formFunc({ ...form, created_by: e.target.value })}
        />
        <input type="text" placeholder="Rating in numbers" required={true}
        onChange={(e) => formFunc({ ...form, rating: e.target.value })}
        />
        <button type="submit">Save</button>
      </div>
      </form>
    </div>
  );
};

export default index;
