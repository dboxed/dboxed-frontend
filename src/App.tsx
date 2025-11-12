import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginGate } from './components/login-gate';
import { onSigninCallback, useIsAdmin, userManager } from './api/auth';
import { Route, Routes, useLocation } from 'react-router';
import MainLayout from "@/layouts/MainLayout.tsx";
import { AuthProvider } from "react-oidc-context";
import { NoWorkspaceScreen } from "@/components/NoWorkspaceScreen.tsx";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { useDboxedQueryClient } from "@/api/api.ts";
import { Toaster } from "sonner";
import { MachineProviderDetailsPage } from "@/pages/machine-providers";
import { MachineDetailsPage, MachinesPage } from "@/pages/machines";
import { WorkspaceDashboardPage } from "@/pages/dashboard/WorkspaceDashboardPage.tsx";
import { ListNetworksPage, NetworkDetailsPage } from "@/pages/networks";
import { BoxDetailsPage } from "@/pages/boxes/details";
import { ListBoxesPage } from "@/pages/boxes";
import { VolumeProviderDetailsPage } from "@/pages/volume-providers";
import { VolumeDetailsPage, VolumesPage } from "@/pages/volumes";
import { SnapshotDetailsPage } from "@/pages/volumes/snapshots/SnapshotDetailsPage.tsx";
import { ListTokensPage, TokenDetailsPage } from "@/pages/tokens";
import { ListS3BucketsPage } from "@/pages/s3-buckets/ListS3BucketsPage.tsx";
import { S3BucketDetailsPage } from "@/pages/s3-buckets/details/S3BucketDetailsPage.tsx";
import { AdminWorkspacesListPage } from "@/pages/admin/AdminWorkspacesListPage.tsx";
import { AdminListUsersPage } from "@/pages/admin/AdminListUsersPage.tsx";
import { ListIngressProxiesPage } from "@/pages/ingress-proxies/ListIngressProxiesPage.tsx";
import { IngressProxyDetailsPage } from "@/pages/ingress-proxies/details/IngressProxyDetailsPage.tsx";
import { ThemeProvider } from "@/components/theme-provider";
import CookieConsentComponent from "@/components/cookie-consent/CookieConsent.tsx";
import { envVars } from "@/env.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

export default function App() {
  return (
    <AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="dboxed-frontend-theme">
          <LoginGate>
            <AuthenticatedApp/>
          </LoginGate>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

function AuthenticatedApp() {
  const isAdminQuery = useIsAdmin()
  const { workspaceId, setWorkspaceId } = useSelectedWorkspaceId()
  const location = useLocation()
  const client = useDboxedQueryClient()
  const workspaces = client.useQuery('get', '/v1/workspaces')

  if (isAdminQuery.isLoading) return <div>Loading user info...</div>;
  if (isAdminQuery.error) return <div className="text-red-600 p-4">Failed to load user info</div>;

  if (workspaces.isLoading) return <div>Loading workspaces...</div>;

  const cookieConsent = envVars.VITE_MATOMO_TAG_MANAGER ? <CookieConsentComponent/> : null

  if (!location.pathname.startsWith("/admin/")) {
    let needNewWorkspaceId = false
    if (!workspaceId) {
      needNewWorkspaceId = true
    } else if (!isAdminQuery.isAdmin && !workspaces.isRefetching && !workspaces.data?.items?.find(x => x.id == workspaceId)) {
      needNewWorkspaceId = true
    }
    if (needNewWorkspaceId) {
      if (!workspaces.data?.items?.length) {
        return <div>
          <Toaster />
          {cookieConsent}
          <NoWorkspaceScreen />
        </div>
      } else {
        setWorkspaceId(workspaces.data.items[0].id)
      }
      return null
    }
  }

  return (
    <div className="flex h-screen">
      <Toaster />
      {cookieConsent}
      <Routes>
        <Route path="/" element={<MainLayout isAdmin={isAdminQuery.isAdmin} />}>
          <Route path="/workspaces/:workspaceId" element={<WorkspaceDashboardPage/>}/>
          <Route path="/workspaces/:workspaceId/machines" element={<MachinesPage/>}/>
          <Route path="/workspaces/:workspaceId/machine-providers" element={<MachinesPage/>}/>
          <Route path="/workspaces/:workspaceId/machine-providers/:machineProviderId" element={<MachineProviderDetailsPage />}/>
          <Route path="/workspaces/:workspaceId/machines/:machineId" element={<MachineDetailsPage/>}/>
          <Route path="/workspaces/:workspaceId/volumes" element={<VolumesPage/>}/>
          <Route path="/workspaces/:workspaceId/volume-providers" element={<VolumesPage/>}/>
          <Route path="/workspaces/:workspaceId/volume-providers/:volumeProviderId" element={<VolumeProviderDetailsPage />}/>
          <Route path="/workspaces/:workspaceId/volumes/:volumeId" element={<VolumeDetailsPage />}/>
          <Route path="/workspaces/:workspaceId/volumes/:volumeId/snapshots/:snapshotId" element={<SnapshotDetailsPage />}/>
          <Route path="/workspaces/:workspaceId/boxes" element={<ListBoxesPage/>}/>
          <Route path="/workspaces/:workspaceId/boxes/:boxId" element={<BoxDetailsPage/>}/>
          <Route path="/workspaces/:workspaceId/networks" element={<ListNetworksPage/>}/>
          <Route path="/workspaces/:workspaceId/networks/:networkId" element={<NetworkDetailsPage/>}/>
          <Route path="/workspaces/:workspaceId/tokens" element={<ListTokensPage/>}/>
          <Route path="/workspaces/:workspaceId/tokens/:tokenId" element={<TokenDetailsPage/>}/>
          <Route path="/workspaces/:workspaceId/s3-buckets" element={<ListS3BucketsPage/>}/>
          <Route path="/workspaces/:workspaceId/s3-buckets/:s3BucketId" element={<S3BucketDetailsPage/>}/>
          <Route path="/workspaces/:workspaceId/ingress-proxies" element={<ListIngressProxiesPage/>}/>
          <Route path="/workspaces/:workspaceId/ingress-proxies/:proxyId" element={<IngressProxyDetailsPage/>}/>
          {isAdminQuery.isAdmin && (
            <>
              <Route path="/admin/workspaces" element={<AdminWorkspacesListPage/>}/>
              <Route path="/admin/users" element={<AdminListUsersPage/>}/>
            </>
          )}
        </Route>
      </Routes>
    </div>
  )
}

