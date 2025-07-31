import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher"
import { useUnboxedQueryClient } from "@/api/api"
import { BasePage } from "@/pages/base/BasePage"
import { MachineProvidersOverview } from "./MachineProvidersOverview"
import { MachinesOverview } from "./MachinesOverview"
import { NetworksOverview } from "./NetworksOverview"
import { BoxesOverview } from "./BoxesOverview"
import { DeleteButton } from "@/components/DeleteButton"
import { useQueryClient } from "@tanstack/react-query";

export function WorkspaceDashboardPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useUnboxedQueryClient()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch workspace
  const workspaceQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const deleteWorkspaceMutation = client.useMutation('delete', '/v1/workspaces/{workspaceId}', {
    onSuccess: () => {
      // Invalidate and refetch workspaces list
      queryClient.invalidateQueries({ queryKey: ['get', '/v1/workspaces'] })
      // Navigate to workspaces list
      navigate('/workspaces')
    }
  })

  const handleDeleteWorkspace = async () => {
    try {
      await deleteWorkspaceMutation.mutateAsync({
        params: {
          path: {
            workspaceId: workspaceId!,
          }
        }
      })
    } catch (error) {
      console.error('Failed to delete workspace:', error)
    }
  }

  return (
    <BasePage title="Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Workspace {workspaceQuery.data?.name}</h2>
          <DeleteButton
            onDelete={handleDeleteWorkspace}
            resourceName={`workspace "${workspaceQuery.data?.name}"`}
            isLoading={deleteWorkspaceMutation.isPending}
            buttonText="Delete Workspace"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <MachineProvidersOverview />
          <NetworksOverview />
          <BoxesOverview />
          <MachinesOverview />
        </div>
      </div>
    </BasePage>
  )
} 