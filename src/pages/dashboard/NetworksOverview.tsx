import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Network } from "lucide-react"
import type { components } from "@/api/models/schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"

export function NetworksOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch networks
  const networksQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/networks', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const networks = networksQuery.data?.items || []

  // Get recent items (last 3)
  const recentNetworks = networks
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'error':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const items = recentNetworks.map((network: components["schemas"]["Network"]) => ({
    id: network.id,
    name: network.name,
    onClick: () => navigate(`/workspaces/${workspaceId}/networks/${network.id}`),
    badges: [{ text: network.type }],
    statusBadge: { text: network.status, variant: getStatusVariant(network.status) },
  }))

  return (
    <WorkspaceOverviewCard
      icon={<Network className="h-5 w-5" />}
      title="Networks"
      description="Manage your network configurations"
      count={networks.length}
      isLoading={networksQuery.isLoading}
      error={!!networksQuery.error}
      items={items}
      emptyState={{
        message: "No networks configured yet",
        createButtonText: "Create First Network",
        onCreateClick: () => navigate(`/workspaces/${workspaceId}/networks/create`),
      }}
      actions={{
        viewAllText: "View All",
        onViewAllClick: () => navigate(`/workspaces/${workspaceId}/networks`),
        addNewText: "Add New",
        onAddNewClick: () => navigate(`/workspaces/${workspaceId}/networks/create`),
      }}
    />
  )
} 