import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import { useDboxedMutation } from "@/api/mutation.ts"
import type { components } from "@/api/models/dboxed-schema"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Trash2, Edit } from "lucide-react"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { AddLoadBalancerServiceDialog } from "./AddLoadBalancerServiceDialog.tsx"
import { EditLoadBalancerServiceDialog } from "./EditLoadBalancerServiceDialog.tsx"
import { StatusBadge } from "@/components/StatusBadge.tsx";

interface BoxLoadBalancerServicesProps {
  box: components["schemas"]["Box"]
}

export function BoxLoadBalancerServices({ box }: BoxLoadBalancerServicesProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

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

  const deleteLoadBalancerServiceMutation = useDboxedMutation('delete', '/v1/workspaces/{workspaceId}/boxes/{id}/load-balancer-services/{loadBalancerServiceId}', {
    successMessage: "Load Balancer Service deleted successfully!",
    errorMessage: "Failed to delete load balancer service",
    refetchPath: "/v1/workspaces/{workspaceId}/boxes/{id}/load-balancer-services",
  })

  const handleDeleteLoadBalancerService = async (loadBalancerServiceId: string) => {
    return await deleteLoadBalancerServiceMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: box.id,
          loadBalancerServiceId: loadBalancerServiceId
        }
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
                <div>
                  <EditLoadBalancerServiceDialog
                    boxId={box.id}
                    loadBalancerService={row.original}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4"/>
                      </Button>
                    }
                    onSuccess={() => loadBalancerServicesQuery.refetch()}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit load balancer service</p>
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
                    title="Delete Load Balancer Service"
                    description={`Are you sure you want to delete the load balancer service for ${row.original.hostname}${row.original.pathPrefix}?`}
                    confirmText="Delete"
                    onConfirm={() => handleDeleteLoadBalancerService(row.original.id)}
                    destructive
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete load balancer service</p>
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
            {allowEditing && (
              <AddLoadBalancerServiceDialog
                boxId={box.id}
                trigger={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Load Balancer Service
                  </Button>
                }
                onSuccess={() => loadBalancerServicesQuery.refetch()}
              />
            )}
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
    </>
  )
}
