import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import { useDboxedMutation } from "@/api/mutation.ts"
import { BasePage } from "@/pages/base/BasePage.tsx"
import { NetworksOverview } from "./NetworksOverview.tsx"
import { BoxesOverview } from "./BoxesOverview.tsx"
import { VolumeProvidersOverview } from "./VolumeProvidersOverview.tsx"
import { VolumesOverview } from "./VolumesOverview.tsx"
import { S3BucketsOverview } from "./S3BucketsOverview.tsx"
import { LoadBalancersOverview } from "./LoadBalancersOverview.tsx"
import { DeleteButton } from "@/components/DeleteButton.tsx"
import { MachineProvidersOverview } from "@/pages/dashboard/MachineProvidersOverview.tsx";
import { MachinesOverview } from "@/pages/dashboard/MachinesOverview.tsx";

export function WorkspaceDashboardPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const navigate = useNavigate()

  // Fetch workspace
  const workspaceQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const deleteWorkspaceMutation = useDboxedMutation('delete', '/v1/workspaces/{workspaceId}', {
    successMessage: "Workspace deleted successfully!",
    errorMessage: "Failed to delete workspace",
    refetchPath: "/v1/workspaces",
    onSuccess: () => navigate('/workspaces'),
  })

  const handleDeleteWorkspace = async () => {
    return await deleteWorkspaceMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
        }
      }
    })
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
          <BoxesOverview />
          <MachineProvidersOverview />
          <MachinesOverview />
          <NetworksOverview />
          <LoadBalancersOverview />
          {/*<MachineProvidersOverview />*/}
          <VolumeProvidersOverview />
          {/*<MachinesOverview />*/}
          <VolumesOverview />
          <S3BucketsOverview />
        </div>
      </div>
    </BasePage>
  )
} 