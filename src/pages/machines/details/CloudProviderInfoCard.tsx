import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { useUnboxedQueryClient } from "@/api/api"
import { Cloud, Server } from "lucide-react"

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
            <Cloud className="h-5 w-5" />
            <span>Cloud Provider</span>
          </CardTitle>
          <CardDescription>
            Cloud provider configuration for this machine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No cloud provider assigned to this machine.
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
            <Cloud className="h-5 w-5" />
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
            <Cloud className="h-5 w-5" />
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
          {cloudProviderType === "aws" ? (
            <Cloud className="h-5 w-5" />
          ) : (
            <Server className="h-5 w-5" />
          )}
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
            <p className="text-sm text-muted-foreground">{cloudProvider.name}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Type</label>
            <Badge variant="secondary" className="capitalize w-fit">
              {cloudProvider.type}
            </Badge>
          </div>
          
          <div>
            <label className="text-sm font-medium">Status</label>
            <Badge 
              variant={cloudProvider.status === "active" ? "default" : "secondary"}
              className="w-fit capitalize"
            >
              {cloudProvider.status}
            </Badge>
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
              <div>
                <label className="text-xs text-muted-foreground">VPC ID</label>
                <p className="text-sm">{cloudProvider.aws.vpc_id || "Not set"}</p>
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