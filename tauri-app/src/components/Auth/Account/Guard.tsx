import { PropsWithChildren, ReactNode } from "react";
import AuthGuard from "../Guard";
import { useProfile } from "@/stores/profile";

const Guard = ({ children, fallback }: PropsWithChildren & { fallback?: ReactNode }) => {
  const isSignedIn = useProfile(state => state.state.isSignedIn)

  if (!isSignedIn)
    return <>{fallback}</> ?? null

  return <>{children}</>
}

export default function AccountGuard(props: PropsWithChildren & { fallback?: ReactNode }) {
  return <AuthGuard>
    <Guard {...props} />
  </AuthGuard>
}
