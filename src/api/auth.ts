import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { useUnboxedQueryClient } from "./api.ts";
import type { components } from "./models/schema";
import { envVars } from "@/env.ts";

export const userManager = new UserManager({
  authority: envVars.VITE_OIDC_ISSUER_URL,
  client_id: envVars.VITE_OIDC_CLIENT_ID,
  redirect_uri: `${window.location.origin}${window.location.pathname}`,
  post_logout_redirect_uri: window.location.origin,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  monitorSession: true, // this allows cross tab login/logout detection
});

export const onSigninCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

export const useCurrentUser = () => {
  const client = useUnboxedQueryClient();

  const userQuery = client.useQuery('get', '/v1/auth/me', {});
  return {
    user: userQuery.data as components['schemas']['User'] | undefined,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error,
  }
}

export const useIsAdmin = () => {
  const userQuery = useCurrentUser()

  const isAdmin = !!userQuery.user && Object.values(userQuery.user?.resource_access || {}).some(
    access => Array.isArray(access.roles) && access.roles.includes('unboxed-admin')
  );

  return {
    isAdmin: isAdmin,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error,
  }
}
