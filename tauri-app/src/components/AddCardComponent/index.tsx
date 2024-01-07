import "./index.css";
import React, { FunctionComponent, useState } from "react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import DocumentUtils from "@/utils/document";
import { Agent } from "../Auth/types";
import { ProfileState, useProfile } from "@/stores/profile";

const possibleConditions = [
  "Cancer",
  "Diabetes",
  "Heart Disease",
  "High Blood Pressure",
  "High Cholesterol",
  "Mental Illness",
]

interface FileProp {
  file: File | null | undefined;
}

const FileUploader: FunctionComponent<{ required?: boolean, onChange: (file: File | null) => void }> = ({ required, onChange }) => {
  const [file, setFile] = useState<FileProp>({ file: null });

  return (
    <div className={!file?.file ? "form-container" : "form-container-active"}>
      <input
        required
        onChange={(e) => {
          const file = e?.target?.files?.[0]
          onChange(file ? file : null)
          setFile({ file: e?.target?.files?.[0] });
        }}
        type="file"
        accept=".jpg,.png,.jpeg"
      />
    </div>
  );
};

// const FileUploader = () => {
//   const [file, setFile] = useState<FileProp>({ file: null });
//
//   return (
//     <div className={file?.file ? "form-container-active" : "form-container"}>
//       <input
//         onChange={(e) => {
//           setFile({ file: e?.target?.files?.[0] });
//         }}
//         type="file"
//         accept=".jpg,.png,.jpeg,.docx,.pdf"
//       />
//     </div>
//   );
// };

const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().min(1),
  condition: z.string().min(1),
  file: z.instanceof(File),
  otherFiles: z.array(z.instanceof(File))
})

const index: FunctionComponent<{ agent: Agent, onClose: () => void }> = ({ agent, onClose }) => {
  const { profile, addCondition } = useProfile(store => ({ profile: store.state.profile!, addCondition: store.addCondition }))
  const [numFileUploaders, setNumFileUploaders] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otherFiles: []
    }
  })
  // console.log(form.formState.errors)

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      ...data,
      profileId: profile.id
    }
    const createdRecord = await DocumentUtils.createDocumentRecord(agent, payload)
    if (!createdRecord) {
      toast.error('Sorry an error occurred!')
      return
    }

    const hasAddedCondition = await addCondition(agent, data.condition)
    if (hasAddedCondition)
      console.log("Added condition to profile")

    toast.success('Successfully created record!')

    onClose()
  }

  return (
    <div className="main-add-card-container">
      <h1>Create New Record</h1>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="input-form">
          {numFileUploaders > 2 && <p>Max file uploads reached</p>}
          <div
            className={numFileUploaders > 2 ? "sadd-mu" : "add-mu"}
            onClick={() =>
              numFileUploaders > 2
                ? null
                : setNumFileUploaders(numFileUploaders + 1)
            }
          >
            <i className="fa fa-plus" />
          </div>
          {Array.from({ length: numFileUploaders })
            .map((_, index) => (
              <FileUploader
                key={index}
                onChange={(file) => {
                  const otherFiles = form.getValues("otherFiles")
                  otherFiles[index] = file as File
                  form.setValue("otherFiles", otherFiles)
                }} />
            ))}
          <input
            type="text"
            placeholder="Title (Optional)"
            {...form.register('title')} />
          <textarea
            required
            placeholder="What the diagnosis!"
            {...form.register('description')} />
          <select
            required
            {...form.register('condition')}>
            <option value="">-- Select a condition --</option>
            {possibleConditions.map((condition) => (
              <option
                key={condition}
                value={condition.toLowerCase()}>{condition}</option>
            ))}
          </select>

          <FileUploader
            required
            onChange={(file) => {
              form.setValue("file", file as File)
            }} />
          <button type="submit">Save</button>
          <p>
            *ensure inputted information are correct as once saved it cannot be
            deleted/edited
          </p>
        </div>
      </form>
    </div>
  );
};

export default index;
