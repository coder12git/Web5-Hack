import { PropsWithChildren, ReactNode, useEffect } from "react";
import AuthGuard from "../Guard";
import { useProfile } from "@/stores/profile";

const Guard = ({ children, fallback }: PropsWithChildren & { fallback?: ReactNode }) => {
  const { isSignedIn } = useProfile(state => ({ isSignedIn: state.state.isSignedIn, signIn: state.signIn }))

  if (!isSignedIn)
    return <>{fallback}</> ?? null

  return <>{children}</>
}

export default function ProfileGuard(props: PropsWithChildren & { fallback?: ReactNode }) {
  return <AuthGuard>
    <Guard {...props} />
  </AuthGuard>
}
