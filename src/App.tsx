import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginGate } from './components/login-gate';
import { onSigninCallback, useIsAdmin, userManager } from './api/auth';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import MainLayout from "@/layouts/MainLayout.tsx";
import { AuthProvider } from "react-oidc-context";
import { CreateWorkspacePage } from "@/pages/workspaces/CreateWorkspacePage.tsx";
import { ListMachineProvidersPage } from "@/pages/machine-providers/ListMachineProvidersPage.tsx";
import { MachineProviderDetailsPage } from "@/pages/machine-providers/details/MachineProviderDetailsPage.tsx";
import { ListMachinesPage } from "@/pages/machines/ListMachinesPage.tsx";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { useUnboxedQueryClient } from "@/api/api.ts";
import { Toaster } from "sonner";
import { CreateMachineProviderPage } from "@/pages/machine-providers/create/CreateMachineProviderPage.tsx";
import { CreateMachinePage, MachineDetailsPage } from "@/pages/machines";
import { BoxSpecEditorPage } from "@/pages/machines/details/boxspec/BoxSpecEditorPage.tsx";
import { WorkspaceDashboardPage } from "@/pages/workspaces/WorkspaceDashboardPage.tsx";
import { ListNetworksPage, CreateNetworkPage, NetworkDetailsPage } from "@/pages/networks";

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
          <Route path="/workspaces/:workspaceId" element={<WorkspaceDashboardPage/>}/>
          <Route path="/workspaces/:workspaceId/machine-providers" element={<ListMachineProvidersPage/>}/>
          <Route path="/workspaces/:workspaceId/machine-providers/:machineProviderId" element={<MachineProviderDetailsPage />}/>
          <Route path="/workspaces/:workspaceId/machines" element={<ListMachinesPage/>}/>
          <Route path="/workspaces/:workspaceId/machines/:machineId" element={<MachineDetailsPage/>}/>
          <Route path="/workspaces/:workspaceId/machines/:machineId/box-spec" element={<BoxSpecEditorPage/>}/>
          <Route path="/workspaces/:workspaceId/networks" element={<ListNetworksPage/>}/>
          <Route path="/workspaces/:workspaceId/networks/:networkId" element={<NetworkDetailsPage/>}/>
        </Route>
        <Route path="/workspaces/create" element={<CreateWorkspacePage/>}/>
        <Route path="/workspaces/:workspaceId/machine-providers/create" element={<CreateMachineProviderPage/>}/>
        <Route path="/workspaces/:workspaceId/machines/create" element={<CreateMachinePage/>}/>
        <Route path="/workspaces/:workspaceId/networks/create" element={<CreateNetworkPage/>}/>
        {isAdminQuery.isAdmin && (
          <></>
        )}
      </Routes>
    </div>
  )
}

