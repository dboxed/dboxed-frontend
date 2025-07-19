import { useAuth } from "react-oidc-context";

/**
 * AuthGate: Ensures the user is authenticated. If not, redirects to OIDC login.
 */
export const LoginGate = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  if (!auth) {
    return <div>auth is null</div>
  }

  if (auth.activeNavigator === "signinSilent") {
    return <div>Signing you in...</div>;
  }
  if (auth.activeNavigator === "signoutRedirect") {
    return <div>Signing you out...</div>;
  }
  if (auth.isLoading) {
    return <div>Loading authentication...</div>;
  }
  if (auth.error) {
    return <div className="text-center text-red-600 py-8">Auth error: {auth.error.message}</div>;
  }
  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return <div>Redirecting to login...</div>;
  }
  return <>{children}</>;
};
