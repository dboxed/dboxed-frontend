import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import { useDboxedMutation } from "@/api/mutation.ts"
import { useEditDialogOpenState } from "@/hooks/use-edit-dialog-open-state.ts"
import type { components } from "@/api/models/dboxed-schema"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Trash2, Edit } from "lucide-react"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { AddPortForwardDialog } from "./AddPortForwardDialog.tsx"
import { EditPortForwardDialog } from "./EditPortForwardDialog.tsx"

interface PortForwardingsProps {
  box: components["schemas"]["Box"]
}

export function PortForwardings({ box }: PortForwardingsProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const editDialog = useEditDialogOpenState<components["schemas"]["BoxPortForward"]>()
  const deleteDialog = useEditDialogOpenState<components["schemas"]["BoxPortForward"]>()

  const allowEditing = box.boxType === "normal"

  const portForwardsQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes/{id}/port-forwards', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: box.id
      }
    }
  })

  const deletePortForwardMutation = useDboxedMutation('delete', '/v1/workspaces/{workspaceId}/boxes/{id}/port-forwards/{portForwardId}', {
    successMessage: "Port forward deleted successfully!",
    errorMessage: "Failed to delete port forward",
    refetchPath: "/v1/workspaces/{workspaceId}/boxes/{id}/port-forwards",
  })

  const handleDeletePortForward = async (portForwardId: string) => {
    return await deletePortForwardMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: box.id,
          portForwardId: portForwardId
        }
      }
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editDialog.setItem(row.original)}
                >
                  <Edit className="w-4 h-4"/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit port forward</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteDialog.setItem(row.original)}
                >
                  <Trash2 className="w-4 h-4"/>
                </Button>
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
      {editDialog.item && <EditPortForwardDialog
        boxId={box.id}
        portForward={editDialog.item}
        {...editDialog.dialogProps}
        onSuccess={() => portForwardsQuery.refetch()}
      />}
      {deleteDialog.item && <ConfirmationDialog
        {...deleteDialog.dialogProps}
        title="Delete Port Forward"
        description={`Are you sure you want to delete this port forward (${deleteDialog.item.protocol}:${deleteDialog.item.sandboxPort})?`}
        confirmText="Delete"
        onConfirm={() => handleDeletePortForward(deleteDialog.item!.id)}
        destructive
      />}
    </>
  )
}
