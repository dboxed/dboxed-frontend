import { useLocation, useNavigate } from "react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { ListVolumeProvidersPage } from "@/pages/volume-providers/ListVolumeProvidersPage.tsx"
import { ListVolumesPage } from "@/pages/volumes/ListVolumesPage.tsx"

export function VolumesPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  // Determine active tab from URL path
  const activeTab = location.pathname.includes('/volume-providers') ? 'volume-providers' : 'volumes'

  const handleTabChange = (value: string) => {
    if (value === 'volumes') {
      navigate(`/workspaces/${workspaceId}/volumes`, { replace: true })
    } else {
      navigate(`/workspaces/${workspaceId}/volume-providers`, { replace: true })
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="volumes">Volumes</TabsTrigger>
          <TabsTrigger value="volume-providers">Volume Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="volumes">
          <ListVolumesPage />
        </TabsContent>

        <TabsContent value="volume-providers">
          <ListVolumeProvidersPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}