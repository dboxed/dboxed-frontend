import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { useDboxedQueryClient } from "@/api/api"
import { Link } from "react-router"

interface MachineProviderInfoCardProps {
  machineProviderId: number | null
  machineProviderType: string | null
  workspaceId: number
}

export function MachineProviderInfoCard({
  machineProviderId,
  machineProviderType,
  workspaceId 
}: MachineProviderInfoCardProps) {
  const client = useDboxedQueryClient()

  const machineProviderQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/machine-providers/{id}', {
    params: {
      path: {
        workspaceId: workspaceId,
        id: machineProviderId!,
      }
    },
  }, {
    enabled: !!machineProviderId
  })

  if (!machineProviderId || !machineProviderType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Machine Provider</span>
          </CardTitle>
          <CardDescription>
            Machine provider configuration for this machine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            N/A
          </p>
        </CardContent>
      </Card>
    )
  }

  if (machineProviderQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Machine Provider</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading machine provider information...</p>
        </CardContent>
      </Card>
    )
  }

  if (machineProviderQuery.error || !machineProviderQuery.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Machine Provider</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">
            Failed to load machine provider information.
          </p>
        </CardContent>
      </Card>
    )
  }

  const machineProvider = machineProviderQuery.data

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Machine Provider</span>
        </CardTitle>
        <CardDescription>
          Machine provider configuration for this machine.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">
              <Link 
                to={`/workspaces/${workspaceId}/machine-providers/${machineProviderId}`}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {machineProvider.name}
              </Link>
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Type</label>
            <p className="text-sm text-muted-foreground">
              <Badge variant="outline" className="w-fit">
                {machineProvider.type}
              </Badge>
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Status</label>
            <p className="text-sm text-muted-foreground">
              <Badge variant="outline" className="w-fit">
                {machineProvider.status}
              </Badge>
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Created At</label>
            <p className="text-sm text-muted-foreground">
              {new Date(machineProvider.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Show provider-specific information */}
        {machineProvider.aws && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">AWS Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Region</label>
                <p className="text-sm">{machineProvider.aws.region}</p>
              </div>
            </div>
          </div>
        )}

        {machineProvider.hetzner && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Hetzner Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Network Name</label>
                <p className="text-sm">{machineProvider.hetzner.hetzner_network_name}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Network Zone</label>
                <p className="text-sm">{machineProvider.hetzner.hetzner_network_zone || "Not set"}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 