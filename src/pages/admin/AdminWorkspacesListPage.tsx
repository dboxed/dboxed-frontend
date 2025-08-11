import { Button } from "@/components/ui/button.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import type { components } from "@/api/models/schema";
import { BaseListPage } from "@/pages/base";

export function AdminWorkspacesListPage() {
  const navigate = useNavigate()

  // Define columns for the DataTable
  const columns: ColumnDef<components["schemas"]["Workspace"]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        const id = row.original.id
        return (
          <button
            onClick={() => navigate(`/workspaces/${id}`)}
            className="font-medium text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            {name}
          </button>
        )
      },
    },
    {
      accessorKey: "access",
      header: "Users",
      cell: ({ row }) => {
        const access = row.getValue("access") as components["schemas"]["WorkspaceAccess"][] | null
        const userCount = access?.length || 0
        
        return (
          <TooltipProvider>
            <div className="flex flex-wrap gap-1">
              {userCount > 0 ? (
                <>
                  {access!.slice(0, 3).map((userAccess, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="text-xs cursor-help">
                          {userAccess.user.name}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <div className="font-medium">{userAccess.user.email}</div>
                          <div className="text-muted-foreground">ID: {userAccess.user.id}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {userCount > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{userCount - 3} more
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-sm text-muted-foreground">No users</span>
              )}
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
        return (
          <div className="text-sm text-muted-foreground">
            {formattedDate}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/workspaces/${id}`)}
          >
            View Dashboard
          </Button>
        )
      },
    },
  ]

  return (
    <BaseListPage<components["schemas"]["Workspace"]>
      title="Workspaces"
      resourcePath="/v1/workspaces"
      columns={columns}
      emptyStateMessage="No workspaces found"
      searchColumn="name"
      searchPlaceholder="Search workspaces..."
    />
  )
}
