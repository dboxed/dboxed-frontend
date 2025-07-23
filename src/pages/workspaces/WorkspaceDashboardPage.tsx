import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher"
import { useUnboxedQueryClient } from "@/api/api"
import { BasePage } from "@/pages/base/BasePage"
import { Cloud, Monitor, Plus, ArrowRight } from "lucide-react"
import type { components } from "@/api/models/schema"

export function WorkspaceDashboardPage() {
  const navigate = useNavigate()
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

  // Fetch cloud providers
  const cloudProvidersQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/cloud-providers', {
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

  const cloudProviders = cloudProvidersQuery.data?.items || []
  const machines = machinesQuery.data?.items || []

  // Get recent items (last 3)
  const recentCloudProviders = cloudProviders
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  const recentMachines = machines
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  const CloudProvidersOverview = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Cloud Providers
          <Badge variant="secondary" className="ml-auto">
            {cloudProviders.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Manage your cloud infrastructure providers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {cloudProvidersQuery.isLoading && (
          <div className="text-sm text-muted-foreground">Loading cloud providers...</div>
        )}

        {cloudProvidersQuery.error && (
          <div className="text-sm text-red-600">Failed to load cloud providers</div>
        )}

        {!cloudProvidersQuery.isLoading && !cloudProvidersQuery.error && (
          <>
            {cloudProviders.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-sm text-muted-foreground mb-4">
                  No cloud providers configured yet
                </div>
                <Button 
                  onClick={() => navigate(`/workspaces/${workspaceId}/cloud-providers/create`)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Provider
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent Providers</div>
                  {recentCloudProviders.map((provider: components["schemas"]["CloudProvider"]) => (
                    <div
                      key={provider.id}
                      className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/workspaces/${workspaceId}/cloud-providers/${provider.id}`)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{provider.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {provider.type}
                        </Badge>
                      </div>
                      <Badge 
                        variant={provider.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {provider.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/workspaces/${workspaceId}/cloud-providers`)}
                    className="flex-1"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/workspaces/${workspaceId}/cloud-providers/create`)}
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

  const MachinesOverview = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Machines
          <Badge variant="secondary" className="ml-auto">
            {machines.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Your deployed and configured machines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {machinesQuery.isLoading && (
          <div className="text-sm text-muted-foreground">Loading machines...</div>
        )}

        {machinesQuery.error && (
          <div className="text-sm text-red-600">Failed to load machines</div>
        )}

        {!machinesQuery.isLoading && !machinesQuery.error && (
          <>
            {machines.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-sm text-muted-foreground mb-4">
                  No machines created yet
                </div>
                <Button 
                  onClick={() => navigate(`/workspaces/${workspaceId}/machines/create`)}
                  size="sm"
                  disabled={cloudProviders.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Machine
                </Button>
                {cloudProviders.length === 0 && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Create a cloud provider first
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent Machines</div>
                  {recentMachines.map((machine: components["schemas"]["Machine"]) => (
                    <div
                      key={machine.id}
                      className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/workspaces/${workspaceId}/machines/${machine.id}`)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{machine.name}</div>
                        {machine.cloud_provider_type && (
                          <Badge variant="outline" className="text-xs">
                            {machine.cloud_provider_type}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {machine.unboxed_version}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/workspaces/${workspaceId}/machines`)}
                    className="flex-1"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/workspaces/${workspaceId}/machines/create`)}
                    disabled={cloudProviders.length === 0}
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