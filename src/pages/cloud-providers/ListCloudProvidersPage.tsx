import { Button } from "@/components/ui/button"
import { BasePage } from "@/pages/base/BasePage.tsx"
import { useNavigate } from "react-router"
import { Plus } from "lucide-react"
import { useUnboxedQueryClient } from "@/api/api.ts";

interface ListCloudProvidersPageProps {
  workspaceId: number
}

export function ListCloudProvidersPage(props: ListCloudProvidersPageProps) {
  const client = useUnboxedQueryClient()
  const navigate = useNavigate()

  const cloudProviders = client.useQuery('get', '/v1/workspaces/{workspaceId}/cloud-providers', {
    params: {
      path: {
        workspaceId: props.workspaceId,
      },
    }
  })
  console.log("cp", cloudProviders)

  return (
    <BasePage title="Cloud Providers">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cloud Providers</h2>
        <Button onClick={() => navigate(`/workspaces/${props.workspaceId}/cloud-providers/create`)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Cloud Provider
        </Button>
      </div>
      <div className="text-muted-foreground">
        No cloud providers configured yet. Create your first cloud provider to get started.
      </div>
    </BasePage>
  )
}
