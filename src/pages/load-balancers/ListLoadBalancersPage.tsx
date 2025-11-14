import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { CreateLoadBalancerDialog } from "./create/CreateLoadBalancerDialog.tsx"
import { BaseListPage } from "@/pages/base";
import { StatusBadge } from "@/components/StatusBadge.tsx";

export function ListLoadBalancersPage() {
  const { workspaceId } = useSelectedWorkspaceId()

  const columns: ColumnDef<components["schemas"]["LoadBalancer"]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const loadBalancer = row.original
        return (
          <ReferenceLabel
            resourceId={loadBalancer.id}
            resourcePath="/v1/workspaces/{workspaceId}/load-balancers/{id}"
            pathParams={{
              workspaceId: workspaceId!,
              id: loadBalancer.id
            }}
            detailsUrl={`/workspaces/${workspaceId}/load-balancers/${loadBalancer.id}`}
            fallbackLabel={loadBalancer.name}
            className="text-blue-600 hover:text-blue-800 underline"
          />
        )
      }
    },
    {
      accessorKey: "loadBalancerType",
      header: "Type",
      cell: ({ row }) => {
        return (
          <Badge variant="secondary" className="capitalize">
            {row.original.loadBalancerType}
          </Badge>
        )
      }
    },
    {
      accessorKey: "network",
      header: "Network",
      cell: ({ row }) => {
        const loadBalancer = row.original
        return (
          <ReferenceLabel
            resourceId={loadBalancer.network}
            resourcePath="/v1/workspaces/{workspaceId}/networks/{id}"
            pathParams={{
              workspaceId: workspaceId!,
              id: loadBalancer.network
            }}
            detailsUrl={`/workspaces/${workspaceId}/networks/${loadBalancer.network}`}
            fallbackLabel={loadBalancer.network}
            className="text-blue-600 hover:text-blue-800 underline"
          />
        )
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <StatusBadge item={row.original}/>
        )
      },
    },
    {
      accessorKey: "httpPort",
      header: "HTTP Port",
      cell: ({ row }) => {
        return (
          <code className="text-sm bg-muted px-1 py-0.5 rounded">
            {row.original.httpPort}
          </code>
        )
      }
    },
    {
      accessorKey: "httpsPort",
      header: "HTTPS Port",
      cell: ({ row }) => {
        return (
          <code className="text-sm bg-muted px-1 py-0.5 rounded">
            {row.original.httpsPort}
          </code>
        )
      }
    }
  ]

  return (
    <>
      <BaseListPage<components["schemas"]["LoadBalancer"]>
        title="Load Balancers"
        resourcePath="/v1/workspaces/{workspaceId}/load-balancers"
        createDialog={CreateLoadBalancerDialog}
        createButtonText="New Load Balancer"
        columns={columns}
        apiParams={{
          path: {
            workspaceId: workspaceId
          }
        }}
        emptyStateMessage="No load balancers created yet. Create your first load balancer to get started."
        searchColumn="name"
        searchPlaceholder="Search load balancers..."
      />
    </>
  )
}
