import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Monitor } from "lucide-react"
import type { components } from "@/api/models/schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"

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
    name: machine.name,
    onClick: () => navigate(`/workspaces/${workspaceId}/machines/${machine.id}`),
    badges: machine.machineProviderType ? [{ text: machine.machineProviderType }] : undefined,
  }))

  return (
    <WorkspaceOverviewCard
      icon={<Monitor className="h-5 w-5" />}
      title="Machines"
      description="Your deployed and configured machines"
      count={machines.length}
      isLoading={machinesQuery.isLoading}
      error={!!machinesQuery.error}
      items={items}
      emptyState={{
        message: "No machines created yet",
        createButtonText: "Create First Machine",
        onCreateClick: () => navigate(`/workspaces/${workspaceId}/machines/create`),
        isCreateDisabled: machineProviders.length === 0,
        createDisabledMessage: "Create a machine provider first",
      }}
      actions={{
        viewAllText: "View All",
        onViewAllClick: () => navigate(`/workspaces/${workspaceId}/machines`),
        addNewText: "Add New",
        onAddNewClick: () => navigate(`/workspaces/${workspaceId}/machines/create`),
        isAddNewDisabled: machineProviders.length === 0,
      }}
    />
  )
} 