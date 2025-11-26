import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import { Database } from "lucide-react"
import type { components } from "@/api/models/dboxed-schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"
import { CreateVolumeProviderDialog } from "@/pages/volume-providers/create/CreateVolumeProviderDialog.tsx"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import { Badge } from "@/components/ui/badge.tsx"

export function VolumeProvidersOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch volume providers
  const volumeProvidersQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/volume-providers', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  }, {
    refetchInterval: 10000,
  })

  const volumeProviders = volumeProvidersQuery.data?.items || []

  // Get recent items (last 3)
  const recentVolumeProviders = volumeProviders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const items = recentVolumeProviders.map((provider: components["schemas"]["VolumeProvider"]) => ({
    id: provider.id,
    content: (
      <div
        className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
        onClick={() => navigate(`/workspaces/${workspaceId}/volume-providers/${provider.id}`)}
      >
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{provider.name}</div>
          <Badge variant="outline" className="text-xs capitalize">
            {provider.type}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge item={provider}/>
        </div>
      </div>
    ),
  }))

  return (
    <>
      <WorkspaceOverviewCard
      icon={<Database className="h-5 w-5" />}
      title="Volume Providers"
      description="Manage your storage providers"
      count={volumeProviders.length}
      isLoading={volumeProvidersQuery.isLoading}
      error={!!volumeProvidersQuery.error}
      items={items}
      addNewDialog={CreateVolumeProviderDialog}
      emptyState={{
        message: "No volume providers configured yet",
        createButtonText: "Create First Provider",
      }}
      actions={{
        viewAllText: "View All",
        onViewAllClick: () => navigate(`/workspaces/${workspaceId}/volume-providers`),
        addNewText: "Add New",
      }}
      />
    </>
  )
} 