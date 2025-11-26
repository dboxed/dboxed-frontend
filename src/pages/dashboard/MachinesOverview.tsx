import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import { Monitor } from "lucide-react"
import type { components } from "@/api/models/dboxed-schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"
import { CreateMachineDialog } from "@/pages/machines/create/CreateMachineDialog.tsx"
import { Badge } from "@/components/ui/badge.tsx"

export function MachinesOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch machine providers (needed for machine creation validation)
  const machineProvidersQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/machine-providers', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  }, {
    refetchInterval: 10000,
  })

  // Fetch machines
  const machinesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/machines', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const machineProviders = machineProvidersQuery.data?.items || []
  const machines = machinesQuery.data?.items || []

  // Get recent items (last 3)
  const recentMachines = machines
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const items = recentMachines.map((machine: components["schemas"]["Machine"]) => ({
    id: machine.id,
    content: (
      <div
        className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
        onClick={() => navigate(`/workspaces/${workspaceId}/machines/${machine.id}`)}
      >
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{machine.name}</div>
          {machine.machineProviderType && (
            <Badge variant="outline" className="text-xs capitalize">
              {machine.machineProviderType}
            </Badge>
          )}
        </div>
      </div>
    ),
  }))

  return (
    <>
      <WorkspaceOverviewCard
        icon={<Monitor className="h-5 w-5" />}
        title="Machines"
        description="Your deployed and configured machines"
        count={machines.length}
        isLoading={machinesQuery.isLoading}
        error={!!machinesQuery.error}
        items={items}
        addNewDialog={CreateMachineDialog}
        emptyState={{
          message: "No machines created yet",
          createButtonText: "Create First Machine",
          isCreateDisabled: machineProviders.length === 0,
          createDisabledMessage: "Create a machine provider first",
        }}
        actions={{
          viewAllText: "View All",
          onViewAllClick: () => navigate(`/workspaces/${workspaceId}/machines`),
          addNewText: "Add New",
          isAddNewDisabled: machineProviders.length === 0,
        }}
      />
    </>
  )
} 