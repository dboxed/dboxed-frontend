import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginGate } from './components/login-gate';
import { onSigninCallback, useIsAdmin, userManager } from './api/auth';
import { Route, Routes } from 'react-router';
import MainLayout from "@/layouts/main.tsx";
import { AuthProvider } from "react-oidc-context";
import { CreateWorkspacePage } from "@/pages/workspaces/Create.tsx";

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
        </Route>
        {isAdminQuery.isAdmin && (
          <></>
        )}
      </Routes>
    </div>
  )
}