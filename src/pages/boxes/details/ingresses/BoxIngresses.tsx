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
import { AddIngressDialog } from "./AddIngressDialog.tsx"
import { EditIngressDialog } from "./EditIngressDialog.tsx"
import { toast } from "sonner"
import { StatusBadge } from "@/components/StatusBadge.tsx";

interface BoxIngressesProps {
  box: components["schemas"]["Box"]
}

export function BoxIngresses({ box }: BoxIngressesProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editingIngress, setEditingIngress] = useState<components["schemas"]["BoxIngress"] | null>(null)

  const ingressesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes/{id}/ingresses', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: box.id
      }
    }
  })

  // Fetch all ingress proxies to get their status and details
  const proxiesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/ingress-proxies', {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    }
  })

  const deleteIngressMutation = client.useMutation('delete', '/v1/workspaces/{workspaceId}/boxes/{id}/ingresses/{ingressId}', {
    onSuccess: () => {
      ingressesQuery.refetch()
    }
  })

  const handleDeleteIngress = (ingressId: string) => {
    deleteIngressMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: box.id,
          ingressId: ingressId
        }
      }
    }, {
      onSuccess: () => {
        toast.success("Ingress deleted successfully!")
      },
      onError: (error) => {
        toast.error("Failed to delete ingress", {
          description: error.detail || "An error occurred while deleting the ingress."
        })
      }
    })
  }

  const ingresses = ingressesQuery.data?.items || []
  const proxies = proxiesQuery.data?.items || []

  // Create a map of proxy ID to proxy for quick lookup
  const proxyMap = new Map(proxies.map(p => [p.id, p]))

  const columns: ColumnDef<components["schemas"]["BoxIngress"]>[] = [
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
      accessorKey: "proxyId",
      header: "Proxy",
      cell: ({ row }) => {
        const ingress = row.original
        const proxy = proxyMap.get(ingress.proxyId)

        if (!proxy) {
          return (
            <span className="text-sm text-muted-foreground">
              Unknown Proxy
            </span>
          )
        }

        return (
          <div className="flex items-center gap-2">
            <ReferenceLabel
              resourceId={proxy.id}
              resourcePath="/v1/workspaces/{workspaceId}/ingress-proxies/{id}"
              pathParams={{
                workspaceId: workspaceId!,
                id: proxy.id
              }}
              detailsUrl={`/workspaces/${workspaceId}/ingress-proxies/${proxy.id}`}
              fallbackLabel={proxy.name}
              className="text-blue-600 hover:text-blue-800 underline"
            />
            <StatusBadge item={proxy}/>
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
    {
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
                  onClick={() => setEditingIngress(row.original)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit ingress</p>
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
                        disabled={deleteIngressMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    }
                    title="Delete Ingress"
                    description={`Are you sure you want to delete the ingress for ${row.original.hostname}${row.original.pathPrefix}?`}
                    confirmText="Delete"
                    onConfirm={() => handleDeleteIngress(row.original.id)}
                    destructive
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete ingress</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )
      }
    }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ingresses</CardTitle>
              <CardDescription>
                HTTP ingress rules for accessing this box
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Ingress
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={ingresses}
            searchColumn="hostname"
            searchPlaceholder="Search ingresses..."
          />
        </CardContent>
      </Card>

      <AddIngressDialog
        boxId={box.id}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={() => ingressesQuery.refetch()}
      />

      {editingIngress && (
        <EditIngressDialog
          boxId={box.id}
          ingress={editingIngress}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setEditingIngress(null)
            }
          }}
          onSuccess={() => ingressesQuery.refetch()}
        />
      )}
    </>
  )
}
