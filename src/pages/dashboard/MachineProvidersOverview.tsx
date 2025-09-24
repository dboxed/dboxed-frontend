import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Cloud } from "lucide-react"
import type { components } from "@/api/models/schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"

export function MachineProvidersOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch machine providers
  const machineProvidersQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/machine-providers', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const machineProviders = machineProvidersQuery.data?.items || []

  // Get recent items (last 3)
  const recentMachineProviders = machineProviders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const items = recentMachineProviders.map((provider: components["schemas"]["MachineProvider"]) => ({
    id: provider.id,
    name: provider.name,
    onClick: () => navigate(`/workspaces/${workspaceId}/machine-providers/${provider.id}`),
    badges: [{ text: provider.type }],
    statusBadge: { 
      text: provider.status, 
      variant: provider.status === 'active' ? 'default' as const : 'secondary' as const
    },
  }))

  return (
    <WorkspaceOverviewCard
      icon={<Cloud className="h-5 w-5" />}
      title="Machine Providers"
      description="Manage your cloud infrastructure providers"
      count={machineProviders.length}
      isLoading={machineProvidersQuery.isLoading}
      error={!!machineProvidersQuery.error}
      items={items}
      emptyState={{
        message: "No machine providers configured yet",
        createButtonText: "Create First Provider",
        onCreateClick: () => navigate(`/workspaces/${workspaceId}/machine-providers/create`),
      }}
      actions={{
        viewAllText: "View All",
        onViewAllClick: () => navigate(`/workspaces/${workspaceId}/machine-providers`),
        addNewText: "Add New",
        onAddNewClick: () => navigate(`/workspaces/${workspaceId}/machine-providers/create`),
      }}
    />
  )
} 