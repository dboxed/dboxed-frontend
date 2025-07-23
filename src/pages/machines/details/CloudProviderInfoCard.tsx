import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { useUnboxedQueryClient } from "@/api/api"
import { Link } from "react-router"

interface CloudProviderInfoCardProps {
  cloudProviderId: number | null
  cloudProviderType: string | null
  workspaceId: number
}

export function CloudProviderInfoCard({ 
  cloudProviderId, 
  cloudProviderType, 
  workspaceId 
}: CloudProviderInfoCardProps) {
  const client = useUnboxedQueryClient()

  const cloudProviderQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/cloud-providers/{id}', {
    params: {
      path: {
        workspaceId: workspaceId,
        id: cloudProviderId!,
      }
    },
    enabled: !!cloudProviderId
  })

  if (!cloudProviderId || !cloudProviderType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Cloud Provider</span>
          </CardTitle>
          <CardDescription>
            Cloud provider configuration for this machine.
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

  if (cloudProviderQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Cloud Provider</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading cloud provider information...</p>
        </CardContent>
      </Card>
    )
  }

  if (cloudProviderQuery.error || !cloudProviderQuery.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Cloud Provider</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">
            Failed to load cloud provider information.
          </p>
        </CardContent>
      </Card>
    )
  }

  const cloudProvider = cloudProviderQuery.data

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Cloud Provider</span>
        </CardTitle>
        <CardDescription>
          Cloud provider configuration for this machine.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">
              <Link 
                to={`/workspaces/${workspaceId}/cloud-providers/${cloudProviderId}`}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {cloudProvider.name}
              </Link>
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Type</label>
            <p className="text-sm text-muted-foreground">
              <Badge variant="outline" className="w-fit">
                {cloudProvider.type}
              </Badge>
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Status</label>
            <p className="text-sm text-muted-foreground">
              <Badge variant="outline" className="w-fit">
                {cloudProvider.status}
              </Badge>
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Created At</label>
            <p className="text-sm text-muted-foreground">
              {new Date(cloudProvider.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Show provider-specific information */}
        {cloudProvider.aws && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">AWS Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Region</label>
                <p className="text-sm">{cloudProvider.aws.region}</p>
              </div>
            </div>
          </div>
        )}

        {cloudProvider.hetzner && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Hetzner Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Network Name</label>
                <p className="text-sm">{cloudProvider.hetzner.hetzner_network_name}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Network Zone</label>
                <p className="text-sm">{cloudProvider.hetzner.hetzner_network_zone || "Not set"}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 