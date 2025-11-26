import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import type { components } from "@/api/models/dboxed-schema"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Trash2, Edit } from "lucide-react"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { AddPortForwardDialog } from "./AddPortForwardDialog.tsx"
import { EditPortForwardDialog } from "./EditPortForwardDialog.tsx"
import { toast } from "sonner"

interface PortForwardingsProps {
  box: components["schemas"]["Box"]
}

export function PortForwardings({ box }: PortForwardingsProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const allowEditing = box.boxType === "normal"

  const portForwardsQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes/{id}/port-forwards', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: box.id
      }
    }
  })

  const deletePortForwardMutation = client.useMutation('delete', '/v1/workspaces/{workspaceId}/boxes/{id}/port-forwards/{portForwardId}', {
    onSuccess: () => {
      portForwardsQuery.refetch()
    }
  })

  const handleDeletePortForward = (portForwardId: string) => {
    return new Promise<boolean>(resolve => {
      deletePortForwardMutation.mutate({
        params: {
          path: {
            workspaceId: workspaceId!,
            id: box.id,
            portForwardId: portForwardId
          }
        }
      }, {
        onSuccess: () => {
          toast.success("Port forward deleted successfully!")
          resolve(true)
        },
        onError: (error) => {
          toast.error("Failed to delete port forward", {
            description: error.detail || "An error occurred while deleting the port forward."
          })
          resolve(false)
        }
      })
    })
  }

  const portForwards = portForwardsQuery.data?.items || []

  const columns: ColumnDef<components["schemas"]["BoxPortForward"]>[] = [
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
    {
      accessorKey: "protocol",
      header: "Protocol",
      cell: ({ row }) => {
        return (
          <Badge variant="secondary" className="uppercase">
            {row.original.protocol}
          </Badge>
        )
      }
    },
    {
      accessorKey: "hostPortFirst",
      header: "Host Port(s)",
      cell: ({ row }) => {
        const { hostPortFirst, hostPortLast } = row.original
        const portRange = hostPortFirst === hostPortLast
          ? `${hostPortFirst}`
          : `${hostPortFirst}-${hostPortLast}`

        return (
          <code className="text-sm bg-muted px-1 py-0.5 rounded">
            {portRange}
          </code>
        )
      }
    },
    {
      accessorKey: "sandboxPort",
      header: "Sandbox Port",
      cell: ({ row }) => {
        return (
          <code className="text-sm bg-muted px-1 py-0.5 rounded">
            {row.original.sandboxPort}
          </code>
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
                  <EditPortForwardDialog
                    boxId={box.id}
                    portForward={row.original}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4"/>
                      </Button>
                    }
                    onSuccess={() => portForwardsQuery.refetch()}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit port forward</p>
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
                        disabled={deletePortForwardMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    }
                    title="Delete Port Forward"
                    description={`Are you sure you want to delete this port forward (${row.original.protocol}:${row.original.sandboxPort})?`}
                    confirmText="Delete"
                    onConfirm={() => handleDeletePortForward(row.original.id)}
                    destructive
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete port forward</p>
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
              <CardTitle>Port Forwards</CardTitle>
              <CardDescription>
                Port forwarding rules for this box
              </CardDescription>
            </div>
            {allowEditing && (
              <AddPortForwardDialog
                boxId={box.id}
                trigger={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Port Forward
                  </Button>
                }
                onSuccess={() => portForwardsQuery.refetch()}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={portForwards}
            searchColumn="description"
            searchPlaceholder="Search port forwards..."
          />
        </CardContent>
      </Card>
    </>
  )
}
