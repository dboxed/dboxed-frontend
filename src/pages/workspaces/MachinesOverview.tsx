import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher"
import { useDboxedQueryClient } from "@/api/api"
import { Monitor, Plus, ArrowRight } from "lucide-react"
import type { components } from "@/api/models/schema"

export function MachinesOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch machine providers (needed for machine creation validation)
  const machineProvidersQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/machine-providers', {
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

  const machineProviders = machineProvidersQuery.data?.items || []
  const machines = machinesQuery.data?.items || []

  // Get recent items (last 3)
  const recentMachines = machines
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  return (
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
                  disabled={machineProviders.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Machine
                </Button>
                {machineProviders.length === 0 && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Create a machine provider first
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
                        {machine.machine_provider_type && (
                          <Badge variant="outline" className="text-xs">
                            {machine.machine_provider_type}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {machine.dboxed_version}
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
                    disabled={machineProviders.length === 0}
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