import { useNavigate } from "react-router"
import { useState } from "react"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Network } from "lucide-react"
import type { components } from "@/api/models/schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"
import { CreateNetworkDialog } from "@/pages/networks/create/CreateNetworkDialog.tsx"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import { Badge } from "@/components/ui/badge.tsx"

export function NetworksOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Fetch networks
  const networksQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/networks', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  }, {
    refetchInterval: 10000,
  })

  const networks = networksQuery.data?.items || []

  // Get recent items (last 3)
  const recentNetworks = networks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const items = recentNetworks.map((network: components["schemas"]["Network"]) => ({
    id: network.id,
    content: (
      <div
        className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
        onClick={() => navigate(`/workspaces/${workspaceId}/networks/${network.id}`)}
      >
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{network.name}</div>
          <Badge variant="outline" className="text-xs capitalize">
            {network.type}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge
            item={{
              status: network.status,
              statusDetails: network.statusDetails,
            }}
          />
        </div>
      </div>
    ),
  }))

  return (
    <>
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
          onCreateClick: () => setCreateDialogOpen(true),
        }}
        actions={{
          viewAllText: "View All",
          onViewAllClick: () => navigate(`/workspaces/${workspaceId}/networks`),
          addNewText: "Add New",
          onAddNewClick: () => setCreateDialogOpen(true),
        }}
      />
      <CreateNetworkDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  )
} 