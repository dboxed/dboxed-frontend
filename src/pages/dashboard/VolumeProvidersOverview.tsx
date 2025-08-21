import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Database } from "lucide-react"
import type { components } from "@/api/models/schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"

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
  })

  const volumeProviders = volumeProvidersQuery.data?.items || []

  // Get recent items (last 3)
  const recentVolumeProviders = volumeProviders
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  const items = recentVolumeProviders.map((provider: components["schemas"]["VolumeProvider"]) => ({
    id: provider.id,
    name: provider.name,
    onClick: () => navigate(`/workspaces/${workspaceId}/volume-providers/${provider.id}`),
    badges: [{ text: provider.type }],
    statusBadge: { 
      text: provider.status, 
      variant: provider.status === 'active' ? 'default' as const : 'secondary' as const
    },
  }))

  return (
    <WorkspaceOverviewCard
      icon={<Database className="h-5 w-5" />}
      title="Volume Providers"
      description="Manage your storage providers"
      count={volumeProviders.length}
      isLoading={volumeProvidersQuery.isLoading}
      error={!!volumeProvidersQuery.error}
      items={items}
      emptyState={{
        message: "No volume providers configured yet",
        createButtonText: "Create First Provider",
        onCreateClick: () => navigate(`/workspaces/${workspaceId}/volume-providers/create`),
      }}
      actions={{
        viewAllText: "View All",
        onViewAllClick: () => navigate(`/workspaces/${workspaceId}/volume-providers`),
        addNewText: "Add New",
        onAddNewClick: () => navigate(`/workspaces/${workspaceId}/volume-providers/create`),
      }}
    />
  )
} 