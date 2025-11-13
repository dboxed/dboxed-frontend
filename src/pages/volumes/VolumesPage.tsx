import { useLocation, useNavigate } from "react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { ListVolumeProvidersPage } from "@/pages/volume-providers/ListVolumeProvidersPage.tsx"
import { ListVolumesPage } from "@/pages/volumes/ListVolumesPage.tsx"
import { ListS3BucketsPage } from "@/pages/s3-buckets/ListS3BucketsPage.tsx"

export function VolumesPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  // Determine active tab from URL path
  let activeTab = 'volumes'
  if (location.pathname.includes('/volume-providers')) {
    activeTab = 'volume-providers'
  } else if (location.pathname.includes('/s3-buckets')) {
    activeTab = 's3-buckets'
  }

  const handleTabChange = (value: string) => {
    if (value === 'volumes') {
      navigate(`/workspaces/${workspaceId}/volumes`, { replace: true })
    } else if (value === 'volume-providers') {
      navigate(`/workspaces/${workspaceId}/volume-providers`, { replace: true })
    } else if (value === 's3-buckets') {
      navigate(`/workspaces/${workspaceId}/s3-buckets`, { replace: true })
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="volumes">Volumes</TabsTrigger>
          <TabsTrigger value="volume-providers">Volume Providers</TabsTrigger>
          <TabsTrigger value="s3-buckets">S3 Buckets</TabsTrigger>
        </TabsList>

        <TabsContent value="volumes">
          <ListVolumesPage />
        </TabsContent>

        <TabsContent value="volume-providers">
          <ListVolumeProvidersPage />
        </TabsContent>

        <TabsContent value="s3-buckets">
          <ListS3BucketsPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}