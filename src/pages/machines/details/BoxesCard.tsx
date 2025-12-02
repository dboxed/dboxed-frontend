import { useNavigate } from "react-router"
import { Plus, Trash2 } from "lucide-react"
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

interface BoxesCardProps {
  machineId: string
  workspaceId: string
}

export function BoxesCard({ machineId, workspaceId }: BoxesCardProps) {
  const navigate = useNavigate()
  const client = useDboxedQueryClient()

  const boxesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/machines/{id}/boxes', {
    params: {
      path: {
        workspaceId: workspaceId,
        id: machineId,
      }
    }
  })

  const removeBoxMutation = useDboxedMutation('delete', '/v1/workspaces/{workspaceId}/machines/{id}/boxes/{boxId}', {
    successMessage: "Box removed from machine",
    errorMessage: "Failed to remove box from machine",
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
      accessorKey: "desiredState",
      header: "Desired State",
      cell: ({ row }) => {
        const desiredState = row.getValue("desiredState") as string
        return (
          <Badge variant={desiredState === 'up' ? 'default' : 'outline'} className="capitalize">
            {desiredState}
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
        <AddBoxDialog
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Box
            </Button>
          }
          machineId={machineId}
          workspaceId={workspaceId}
        />
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
    </Card>
  )
}
