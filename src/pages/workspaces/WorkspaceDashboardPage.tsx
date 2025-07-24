import { useSelectedWorkspaceId } from "@/components/workspace-switcher"
import { useUnboxedQueryClient } from "@/api/api"
import { BasePage } from "@/pages/base/BasePage"
import { CloudProvidersOverview } from "./CloudProvidersOverview"
import { MachinesOverview } from "./MachinesOverview"

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CloudProvidersOverview />
          <MachinesOverview />
        </div>
      </div>
    </BasePage>
  )
} 