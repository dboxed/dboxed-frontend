import { useLocation, useNavigate } from "react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { ListGitCredentialsPage } from "@/pages/git-credentials/ListGitCredentialsPage.tsx"
import { ListDboxedSpecsPage } from "@/pages/dboxed-specs/ListDboxedSpecsPage.tsx"

export function DboxedSpecsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  // Determine active tab from URL path
  let activeTab = 'dboxed-specs'
  if (location.pathname.includes('/git-credentials')) {
    activeTab = 'git-credentials'
  }

  const handleTabChange = (value: string) => {
    navigate(`/workspaces/${workspaceId}/${value}`, { replace: true })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dboxed-specs">Specs</TabsTrigger>
          <TabsTrigger value="git-credentials">Credentials</TabsTrigger>
        </TabsList>

        <TabsContent value="dboxed-specs">
          <ListDboxedSpecsPage />
        </TabsContent>

        <TabsContent value="git-credentials">
          <ListGitCredentialsPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
