import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher"
import { useDboxedQueryClient } from "@/api/api"
import { ArrowRight, Network, Plus } from "lucide-react"
import type { components } from "@/api/models/schema"

export function NetworksOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch networks
  const networksQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/networks', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const networks = networksQuery.data?.items || []

  // Get recent items (last 3)
  const recentNetworks = networks
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'error':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Networks
          <Badge variant="secondary" className="ml-auto">
            {networks.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Manage your network configurations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {networksQuery.isLoading && (
          <div className="text-sm text-muted-foreground">Loading networks...</div>
        )}

        {networksQuery.error && (
          <div className="text-sm text-red-600">Failed to load networks</div>
        )}

        {!networksQuery.isLoading && !networksQuery.error && (
          <>
            {networks.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-sm text-muted-foreground mb-4">
                  No networks configured yet
                </div>
                <Button 
                  onClick={() => navigate(`/workspaces/${workspaceId}/networks/create`)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Network
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent Networks</div>
                  {recentNetworks.map((network: components["schemas"]["Network"]) => (
                    <div
                      key={network.id}
                      className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/workspaces/${workspaceId}/networks/${network.id}`)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{network.name}</div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {network.type}
                        </Badge>
                      </div>
                      <Badge 
                        variant={getStatusVariant(network.status)}
                        className="text-xs capitalize"
                      >
                        {network.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/workspaces/${workspaceId}/networks`)}
                    className="flex-1"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/workspaces/${workspaceId}/networks/create`)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
} 