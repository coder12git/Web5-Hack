import "./index.css";
import useWeb5Store from "@/stores/useWeb5Store";
import { useProfile } from "@/stores/profile";
import { Agent } from "@/components/Auth/types";
import { FunctionComponent, useRef, useState } from "react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { CreatePayload } from "@/utils/user";

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  description: z.string().min(1),
  profilePicture: z.instanceof(File)
})

interface FileProp {
  file: File | null | undefined;
}

const FileUploader: FunctionComponent<{ onChange: (file: File | null) => void }> = ({ onChange }) => {
  const [file, setFile] = useState<FileProp>({ file: null });

  return (
    <div className={!file?.file ? "form-container" : "form-container-active"}>
      <h3>Profile Picture</h3>
      <br />
      <input
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

export default function SignUpForm() {
  console.log("kfjle")
  const { web5, did } = useWeb5Store((state) => ({ web5: state.web5!, did: state.did! }));
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const { setShowAuthModal, signUp, signIn } = useProfile(
    (state) => ({ signUp: state.signUp, signIn: state.signIn, setShowAuthModal: state.setShowAuthModal }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  form.watch((value) => {
    if (!submitBtnRef.current) return

    const isValid = formSchema.safeParse(value).success

    if (isValid) {
      submitBtnRef.current.classList.remove("not-filled-btn")
      submitBtnRef.current.classList.add("filled-btn")
      submitBtnRef.current.disabled = false
    }
    else {
      submitBtnRef.current.classList.add("not-filled-btn")
      submitBtnRef.current.classList.remove("filled-btn")
      submitBtnRef.current.disabled = true
    }
  })

  const createProfile = async (agent: Agent, payload: CreatePayload) => {
    const hasSignedUpSuccessfully = await signUp(agent, payload)

    if (!hasSignedUpSuccessfully) {
      toast.error('Sorry an error occurred!')
      return
    }

    if (!await signIn(agent)) return

    toast.success('Successfully signed up!')

    setShowAuthModal(false)
  }

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    if (web5 && did) createProfile({ web5, did }, value)
  }

  return (
    <div className="data-container">
      <form className="auth-form"
        onSubmit={form.handleSubmit(onSubmit)}>
        <FileUploader
          onChange={(file) => form.setValue("profilePicture", file as File)}
        />
        <input
          type="text"
          required
          placeholder="First name"
          {...form.register("firstName")}
        />
        <input
          type="text"
          required
          placeholder="Last name"
          {...form.register("lastName")}
        />

        <textarea
          required
          placeholder="Let's know about you?"
          {...form.register("description")}
        />
        <button
          type="submit"
          style={{ width: "100%", marginRight: "0" }}
          className="not-filled-btn"
          ref={submitBtnRef}
        >
          Fill Form To Proceed
        </button>
      </form>
    </div>
  )
}

