import { useSelectedWorkspaceId } from "@/components/workspace-switcher"
import { useUnboxedQueryClient } from "@/api/api"
import { BasePage } from "@/pages/base/BasePage"
import { MachineProvidersOverview } from "./MachineProvidersOverview"
import { MachinesOverview } from "./MachinesOverview"
import { NetworksOverview } from "./NetworksOverview"

export function WorkspaceDashboardPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useUnboxedQueryClient()

  // Fetch workspace
  const workspaceQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  return (
    <BasePage title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Workspace {workspaceQuery.data?.name}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <MachineProvidersOverview />
          <NetworksOverview />
          <MachinesOverview />
        </div>
      </div>
    </BasePage>
  )
} 