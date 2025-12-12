import { useNavigate } from "react-router"
import { Plus, Trash2, Play, StopCircle } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useDboxedQueryClient } from "@/api/client.ts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { BoxStatusBadge } from "@/pages/boxes/details/status/BoxStatusBadge.tsx"
import { AddBoxDialog } from "./AddBoxDialog.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { useDboxedMutation } from "@/api/mutation.ts";
import { useEditDialogOpenState } from "@/hooks/use-edit-dialog-open-state.ts";

interface BoxesCardProps {
  machineId: string
  workspaceId: string
}

export function BoxesCard({ machineId, workspaceId }: BoxesCardProps) {
  const navigate = useNavigate()
  const client = useDboxedQueryClient()
  const addBoxDialog = useEditDialogOpenState()

  const boxesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/machines/{id}/boxes', {
    params: {
      path: {
        workspaceId: workspaceId,
        id: machineId,
      }
    }
  }, {
    refetchInterval: 10000,
  })

  const removeBoxMutation = useDboxedMutation('delete', '/v1/workspaces/{workspaceId}/machines/{id}/boxes/{boxId}', {
    successMessage: "Box removed from machine",
    errorMessage: "Failed to remove box from machine",
    refetchPath: "/v1/workspaces/{workspaceId}/machines/{id}/boxes",
  })

  const enableBoxMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/enable', {
    successMessage: "Box enabled",
    errorMessage: "Failed to enable box",
    refetchPath: "/v1/workspaces/{workspaceId}/machines/{id}/boxes",
  })

  const disableBoxMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/disable', {
    successMessage: "Box disabled",
    errorMessage: "Failed to disable box",
    refetchPath: "/v1/workspaces/{workspaceId}/machines/{id}/boxes",
  })

  const boxes = boxesQuery.data?.items || []

  const handleRemoveBox = async (boxId: string) => {
    return await removeBoxMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId,
          id: machineId,
          boxId: boxId,
        }
      }
    })
  }

  const handleEnableBox = async (boxId: string) => {
    return await enableBoxMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId,
          id: boxId,
        }
      }
    })
  }

  const handleDisableBox = async (boxId: string) => {
    return await disableBoxMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId,
          id: boxId,
        }
      }
    })
  }

  const columns: ColumnDef<components["schemas"]["Box"]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        const id = row.original.id
        return (
          <button
            onClick={() => navigate(`/workspaces/${workspaceId}/boxes/${id}`)}
            className="font-medium text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            {name}
          </button>
        )
      },
    },
    {
      accessorKey: "boxType",
      header: "Type",
      cell: ({ row }) => {
        const boxType = row.getValue("boxType") as string
        return (
          <Badge variant="secondary">
            {boxType}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <BoxStatusBadge box={row.original} />
      },
    },
    {
      accessorKey: "enabled",
      header: "Enabled",
      cell: ({ row }) => {
        const enabled = row.getValue("enabled") as boolean
        return (
          <Badge variant={enabled ? 'default' : 'outline'}>
            {enabled ? 'Yes' : 'No'}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const box = row.original
        return (
          <div className="flex items-center gap-1">
            <ConfirmationDialog
              trigger={
                <Button variant="ghost" size="sm">
                  {box.enabled ? (
                    <StopCircle className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              }
              title={box.enabled ? "Disable Box?" : "Enable Box?"}
              description={box.enabled
                ? `This will disable "${box.name}" and stop all running containers.`
                : `This will enable "${box.name}" and start all configured containers.`
              }
              confirmText={box.enabled ? "Disable" : "Enable"}
              onConfirm={() => box.enabled ? handleDisableBox(box.id) : handleEnableBox(box.id)}
              destructive={box.enabled}
            />
            <ConfirmationDialog
              trigger={
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
              title="Remove Box"
              description={`Are you sure you want to remove "${box.name}" from this machine?`}
              confirmText="Remove"
              onConfirm={() => handleRemoveBox(box.id)}
              destructive
            />
          </div>
        )
      },
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Boxes</CardTitle>
          <CardDescription>
            Boxes associated with this machine.
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => addBoxDialog.setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Box
        </Button>
      </CardHeader>
      <CardContent>
        {boxesQuery.isLoading ? (
          <div className="text-sm text-muted-foreground">Loading boxes...</div>
        ) : boxes.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No boxes associated with this machine.
          </div>
        ) : (
          <DataTable columns={columns} data={boxes} />
        )}
      </CardContent>
      <AddBoxDialog
        {...addBoxDialog.dialogProps}
        machineId={machineId}
        workspaceId={workspaceId}
      />
    </Card>
  )
}
