import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import { Cloud } from "lucide-react"
import type { components } from "@/api/models/dboxed-schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"
import { CreateMachineProviderDialog } from "@/pages/machine-providers/create/CreateMachineProviderDialog.tsx"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import { Badge } from "@/components/ui/badge.tsx"

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
  }, {
    refetchInterval: 10000,
  })

  const machineProviders = machineProvidersQuery.data?.items || []

  // Get recent items (last 3)
  const recentMachineProviders = machineProviders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const items = recentMachineProviders.map((provider: components["schemas"]["MachineProvider"]) => ({
    id: provider.id,
    content: (
      <div
        className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
        onClick={() => navigate(`/workspaces/${workspaceId}/machine-providers/${provider.id}`)}
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
      icon={<Cloud className="h-5 w-5" />}
      title="Machine Providers"
      description="Manage your cloud infrastructure providers"
      count={machineProviders.length}
      isLoading={machineProvidersQuery.isLoading}
      error={!!machineProvidersQuery.error}
      items={items}
      addNewDialog={CreateMachineProviderDialog}
      emptyState={{
        message: "No machine providers configured yet",
        createButtonText: "Create First Provider",
      }}
      actions={{
        viewAllText: "View All",
        onViewAllClick: () => navigate(`/workspaces/${workspaceId}/machine-providers`),
        addNewText: "Add New",
      }}
      />
    </>
  )
} 