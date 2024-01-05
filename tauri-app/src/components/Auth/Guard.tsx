import useWeb5Store from "@/stores/useWeb5Store"
import { PropsWithChildren, ReactNode } from "react";

export default function AuthGuard({ children, fallback }: PropsWithChildren & { fallback?: ReactNode }) {
  const { web5, did } = useWeb5Store((state) => ({ web5: state.web5, did: state.did }));

  if (!web5 || !did)
    return <>{fallback}</> ?? null
  

  return <>{children}</>
}
