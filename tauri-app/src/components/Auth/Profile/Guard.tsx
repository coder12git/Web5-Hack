import { PropsWithChildren, ReactNode, useEffect } from "react";
import AuthGuard from "../Guard";
import { useProfile } from "@/stores/profile";
import useWeb5Store from "@/stores/useWeb5Store";

const Guard = ({ children, fallback }: PropsWithChildren & { fallback?: ReactNode }) => {
  const agent = useWeb5Store(state => ({ web5: state.web5!, did: state.did! }))
  const { isSignedIn, signIn } = useProfile(state => ({ isSignedIn: state.state.isSignedIn, signIn: state.signIn }))

  useEffect(() => {
    signIn(agent)
  }, [signIn])

  if (!isSignedIn)
    return <>{fallback}</> ?? null

  return <>{children}</>
}

export default function ProfileGuard(props: PropsWithChildren & { fallback?: ReactNode }) {
  return <AuthGuard>
    <Guard {...props} />
  </AuthGuard>
}
