import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/UserAvatar"
import type { ColumnDef } from "@tanstack/react-table"
import type { components } from "@/api/models/dboxed-schema"
import { BaseListPage } from "@/pages/base"

export function AdminListUsersPage() {
  // Define columns for the DataTable
  const columns: ColumnDef<components["schemas"]["User"]>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original
        
        return (
          <div className="flex items-center gap-3">
            <UserAvatar user={user} />
            <div>
              <div className="font-medium">{user.fullName}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "id",
      header: "User ID",
      cell: ({ row }) => {
        const id = row.getValue("id") as string
        return (
          <div className="font-mono text-sm text-muted-foreground">
            {id}
          </div>
        )
      },
    },
    {
      accessorKey: "isAdmin",
      header: "Role",
      cell: ({ row }) => {
        const isAdmin = row.getValue("isAdmin") as boolean | undefined
        return (
          <div>
            {isAdmin ? (
              <Badge variant="default">Admin</Badge>
            ) : (
              <Badge variant="secondary">User</Badge>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <BaseListPage<components["schemas"]["User"]>
      title="Users"
      resourcePath="/v1/admin/users"
      columns={columns}
      emptyStateMessage="No users found"
      searchColumn="name"
      searchPlaceholder="Search users..."
    />
  )
}