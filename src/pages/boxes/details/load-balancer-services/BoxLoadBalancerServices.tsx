import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import type { components } from "@/api/models/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Trash2, Edit } from "lucide-react"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { AddLoadBalancerServiceDialog } from "./AddLoadBalancerServiceDialog.tsx"
import { EditLoadBalancerServiceDialog } from "./EditLoadBalancerServiceDialog.tsx"
import { toast } from "sonner"
import { StatusBadge } from "@/components/StatusBadge.tsx";

interface BoxLoadBalancerServicesProps {
  box: components["schemas"]["Box"]
}

export function BoxLoadBalancerServices({ box }: BoxLoadBalancerServicesProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editingLoadBalancerService, setEditingLoadBalancerService] = useState<components["schemas"]["LoadBalancerService"] | null>(null)

  const allowEditing = box.boxType === "normal"

  const loadBalancerServicesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes/{id}/load-balancer-services', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: box.id
      }
    }
  })

  // Fetch all loadBalancerService proxies to get their status and details
  const proxiesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/load-balancers', {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    }
  })

  const deleteLoadBalancerServiceMutation = client.useMutation('delete', '/v1/workspaces/{workspaceId}/boxes/{id}/load-balancer-services/{loadBalancerServiceId}', {
    onSuccess: () => {
      loadBalancerServicesQuery.refetch()
    }
  })

  const handleDeleteLoadBalancerService = (loadBalancerServiceId: string) => {
    deleteLoadBalancerServiceMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: box.id,
          loadBalancerServiceId: loadBalancerServiceId
        }
      }
    }, {
      onSuccess: () => {
        toast.success("LoadBalancerService deleted successfully!")
      },
      onError: (error) => {
        toast.error("Failed to delete loadBalancerService", {
          description: error.detail || "An error occurred while deleting the loadBalancerService."
        })
      }
    })
  }

  const loadBalancerServices = loadBalancerServicesQuery.data?.items || []
  const lbs = proxiesQuery.data?.items || []
  const lbMap = new Map(lbs.map(p => [p.id, p]))

  const columns: ColumnDef<components["schemas"]["LoadBalancerService"]>[] = [
    {
      accessorKey: "hostname",
      header: "Hostname",
      cell: ({ row }) => {
        return (
          <code className="text-sm bg-muted px-1 py-0.5 rounded">
            {row.original.hostname}
          </code>
        )
      }
    },
    {
      accessorKey: "pathPrefix",
      header: "Path Prefix",
      cell: ({ row }) => {
        return (
          <code className="text-sm bg-muted px-1 py-0.5 rounded">
            {row.original.pathPrefix}
          </code>
        )
      }
    },
    {
      accessorKey: "port",
      header: "Port",
      cell: ({ row }) => {
        return (
          <code className="text-sm bg-muted px-1 py-0.5 rounded">
            {row.original.port}
          </code>
        )
      }
    },
    {
      accessorKey: "loadBalancerId",
      header: "Load Balancer",
      cell: ({ row }) => {
        const loadBalancerService = row.original
        const lb = lbMap.get(loadBalancerService.loadBalancerId)

        if (!lb) {
          return (
            <span className="text-sm text-muted-foreground">
              Unknown Load Balancer
            </span>
          )
        }

        return (
          <div className="flex items-center gap-2">
            <ReferenceLabel
              resourceId={lb.id}
              resourcePath="/v1/workspaces/{workspaceId}/load-balancers/{id}"
              pathParams={{
                workspaceId: workspaceId!,
                id: lb.id
              }}
              detailsUrl={`/workspaces/${workspaceId}/load-balancers/${lb.id}`}
              fallbackLabel={lb.name}
              className="text-blue-600 hover:text-blue-800 underline"
            />
            <StatusBadge item={lb}/>
          </div>
        )
      }
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-muted-foreground">
            {row.original.description || "-"}
          </span>
        )
      }
    },
  ]
  if (allowEditing) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingLoadBalancerService(row.original)}
                >
                  <Edit className="w-4 h-4"/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit loadBalancerService</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ConfirmationDialog
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deleteLoadBalancerServiceMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    }
                    title="Delete LoadBalancerService"
                    description={`Are you sure you want to delete the loadBalancerService for ${row.original.hostname}${row.original.pathPrefix}?`}
                    confirmText="Delete"
                    onConfirm={() => handleDeleteLoadBalancerService(row.original.id)}
                    destructive
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete loadBalancerService</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )
      }
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>BoxLoadBalancerServices</CardTitle>
              <CardDescription>
                HTTP loadBalancerService rules for accessing this box
              </CardDescription>
            </div>
            {allowEditing && <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Load Balancer Service
            </Button>}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={loadBalancerServices}
            searchColumn="hostname"
            searchPlaceholder="Search loadBalancerServices..."
          />
        </CardContent>
      </Card>

      <AddLoadBalancerServiceDialog
        boxId={box.id}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={() => loadBalancerServicesQuery.refetch()}
      />

      {editingLoadBalancerService && (
        <EditLoadBalancerServiceDialog
          boxId={box.id}
          loadBalancerService={editingLoadBalancerService}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setEditingLoadBalancerService(null)
            }
          }}
          onSuccess={() => loadBalancerServicesQuery.refetch()}
        />
      )}
    </>
  )
}
