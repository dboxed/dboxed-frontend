import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ColumnDef } from "@tanstack/react-table"
import type { components } from "@/api/models/schema"
import { BaseListPage } from "@/pages/base"

export function AdminListUsersPage() {
  // Define columns for the DataTable
  const columns: ColumnDef<components["schemas"]["User"]>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        const email = row.original.email
        const avatar = row.original.avatar
        
        // Get initials from name for fallback
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-muted-foreground">{email}</div>
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
      resourcePath="/v1/users"
      columns={columns}
      emptyStateMessage="No users found"
      searchColumn="name"
      searchPlaceholder="Search users..."
    />
  )
}