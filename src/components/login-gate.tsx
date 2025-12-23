import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";
import { FullScreenLoading } from "@/components/FullScreenLoading.tsx";

/**
 * AuthGate: Ensures the user is authenticated. If not, redirects to OIDC login.
 */
export const LoginGate = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const [redirectTimerStarted, setRedirectTimerStarted] = useState(false)

  useEffect(() => {
    if (auth.error) {
      if (!redirectTimerStarted) {
        setTimeout(() => {
          auth.signinRedirect();
        }, 3000)
        setRedirectTimerStarted(true)
      }
      return
    }
  }, [auth, auth.error, auth.isAuthenticated, redirectTimerStarted]);

  if (auth.activeNavigator === "signinSilent") {
    return <FullScreenLoading title="Signing In" description="Signing you in..." />;
  }
  if (auth.activeNavigator === "signoutRedirect") {
    return <FullScreenLoading title="Signing Out" description="Signing you out..." />;
  }
  if (auth.isLoading) {
    return <FullScreenLoading title="Authentication" description="Loading authentication..." />;
  }
  if (auth.error) {
    return (
      <FullScreenLoading
        title={<span className="text-destructive">Authentication Error</span>}
        description={`${auth.error.message}. Redirecting to login page...`}
      />
    );
  }
  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return <FullScreenLoading title="Redirecting" description="Redirecting to login..." />;
  }
  return <>{children}</>;
};
