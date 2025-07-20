import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginGate } from './components/login-gate';
import { onSigninCallback, useIsAdmin, userManager } from './api/auth';
import { Route, Routes, useParams } from 'react-router';
import MainLayout from "@/layouts/MainLayout.tsx";
import { AuthProvider } from "react-oidc-context";
import { CreateWorkspacePage } from "@/pages/workspaces/CreateWorkspacePage.tsx";
import { ListCloudProvidersPage } from "@/pages/cloud-providers/ListCloudProvidersPage.tsx";
import { CreateCloudProviderPage } from "@/pages/cloud-providers/CreateCloudProviderPage.tsx";
import type { ReactElement } from "react";

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

  if (isAdminQuery.isLoading) return <div>Loading user info...</div>;
  if (isAdminQuery.error) return <div className="text-red-600 p-4">Failed to load user info</div>;

  return (
    <div className="flex h-screen">
      <Routes>
        <Route path="/" element={<MainLayout isAdmin={isAdminQuery.isAdmin} />}>
          <Route path="/workspaces/create" element={<CreateWorkspacePage/>}/>
          <Route path="/workspaces/:workspaceId" element={<></>}/>
          <Route path="/workspaces/:workspaceId/cloud-providers" element={<WorkspacePageWrapper Page={ListCloudProvidersPage}/>}/>
          <Route path="/workspaces/:workspaceId/cloud-providers/create" element={<WorkspacePageWrapper Page={CreateCloudProviderPage} />}/>
        </Route>
        {isAdminQuery.isAdmin && (
          <></>
        )}
      </Routes>
    </div>
  )
}

function WorkspacePageWrapper(props: {Page: ({workspaceId, ...props}: {workspaceId: number}) => ReactElement}) {
  const { workspaceId } = useParams();

  if (!workspaceId) {
    return <>no workspace id</>
  }

  const x = parseInt(workspaceId)
  return <props.Page workspaceId={x}/>
}
