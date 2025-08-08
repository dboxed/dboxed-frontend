import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher"
import { useDboxedQueryClient } from "@/api/api"
import { ArrowRight, Package, Plus } from "lucide-react"
import type { components } from "@/api/models/schema"

export function BoxesOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch boxes
  const boxesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const boxes = boxesQuery.data?.items || []

  // Get recent items (last 3)
  const recentBoxes = boxes
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Boxes
          <Badge variant="secondary" className="ml-auto">
            {boxes.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Your containerized application configurations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {boxesQuery.isLoading && (
          <div className="text-sm text-muted-foreground">Loading boxes...</div>
        )}

        {boxesQuery.error && (
          <div className="text-sm text-red-600">Failed to load boxes</div>
        )}

        {!boxesQuery.isLoading && !boxesQuery.error && (
          <>
            {boxes.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-sm text-muted-foreground mb-4">
                  No boxes created yet
                </div>
                <Button 
                  onClick={() => navigate(`/workspaces/${workspaceId}/boxes/create`)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Box
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent Boxes</div>
                  {recentBoxes.map((box: components["schemas"]["Box"]) => (
                    <div
                      key={box.id}
                      className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/workspaces/${workspaceId}/boxes/${box.id}`)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{box.name}</div>
                        {box.network_type && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {box.network_type}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(box.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/workspaces/${workspaceId}/boxes`)}
                    className="flex-1"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/workspaces/${workspaceId}/boxes/create`)}
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