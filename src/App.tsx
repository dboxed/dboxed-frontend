import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginGate } from './components/login-gate';
import { onSigninCallback, useIsAdmin, userManager } from './api/auth';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import MainLayout from "@/layouts/MainLayout.tsx";
import { AuthProvider } from "react-oidc-context";
import { CreateWorkspacePage } from "@/pages/workspaces/CreateWorkspacePage.tsx";
import { ListCloudProvidersPage } from "@/pages/cloud-providers/ListCloudProvidersPage.tsx";
import { CloudProviderDetailsPage } from "@/pages/cloud-providers/details/CloudProviderDetailsPage.tsx";
import { ListMachinesPage } from "@/pages/machines/ListMachinesPage.tsx";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { useUnboxedQueryClient } from "@/api/api.ts";
import { Toaster } from "sonner";
import { CreateCloudProviderPage } from "@/pages/cloud-providers/create/CreateCloudProviderPage.tsx";

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
        <LoginGate>
          <AuthenticatedApp/>
        </LoginGate>
      </QueryClientProvider>
    </AuthProvider>
  )
}

function AuthenticatedApp() {
  const isAdminQuery = useIsAdmin()
  const { workspaceId, setWorkspaceId } = useSelectedWorkspaceId()
  const location = useLocation()
  const navigate = useNavigate()
  const client = useUnboxedQueryClient()
  const workspaces = client.useQuery('get', '/v1/workspaces')

  if (isAdminQuery.isLoading) return <div>Loading user info...</div>;
  if (isAdminQuery.error) return <div className="text-red-600 p-4">Failed to load user info</div>;

  if (workspaces.isLoading) return <div>Loading workspaces...</div>;

  if (!workspaceId && location.pathname !== "/workspaces/create") {
    if (!workspaces.data?.items?.length) {
      navigate("/workspaces/create")
    } else {
      setWorkspaceId(workspaces.data.items[0].id)
    }
    return null
  }

  return (
    <div className="flex h-screen">
      <Toaster />
      <Routes>
        <Route path="/" element={<MainLayout isAdmin={isAdminQuery.isAdmin} />}>
          <Route path="/workspaces/:workspaceId" element={<></>}/>
          <Route path="/workspaces/:workspaceId/cloud-providers" element={<ListCloudProvidersPage/>}/>
          <Route path="/workspaces/:workspaceId/cloud-providers/:cloudProviderId" element={<CloudProviderDetailsPage />}/>
          <Route path="/workspaces/:workspaceId/machines" element={<ListMachinesPage/>}/>
        </Route>
        <Route path="/workspaces/create" element={<CreateWorkspacePage/>}/>
        <Route path="/workspaces/:workspaceId/cloud-providers/create" element={<CreateCloudProviderPage/>}/>
        {isAdminQuery.isAdmin && (
          <></>
        )}
      </Routes>
    </div>
  )
}

