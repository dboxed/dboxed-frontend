import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { CreateIngressProxyDialog } from "./create/CreateIngressProxyDialog.tsx"
import { BaseListPage } from "@/pages/base";
import { StatusBadge } from "@/components/StatusBadge.tsx";

export function ListIngressProxiesPage() {
  const { workspaceId } = useSelectedWorkspaceId()

  const columns: ColumnDef<components["schemas"]["IngressProxy"]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const proxy = row.original
        return (
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
        )
      }
    },
    {
      accessorKey: "proxyType",
      header: "Proxy Type",
      cell: ({ row }) => {
        return (
          <Badge variant="secondary" className="capitalize">
            {row.original.proxyType}
          </Badge>
        )
      }
    },
    {
      accessorKey: "network",
      header: "Network",
      cell: ({ row }) => {
        const proxy = row.original
        return (
          <ReferenceLabel
            resourceId={proxy.network}
            resourcePath="/v1/workspaces/{workspaceId}/networks/{id}"
            pathParams={{
              workspaceId: workspaceId!,
              id: proxy.network
            }}
            detailsUrl={`/workspaces/${workspaceId}/networks/${proxy.network}`}
            fallbackLabel={proxy.network}
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
    },
    {
      accessorKey: "boxId",
      header: "Box",
      cell: ({ row }) => {
        const proxy = row.original
        return (
          <ReferenceLabel
            resourceId={proxy.boxId}
            resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
            pathParams={{
              workspaceId: workspaceId!,
              id: proxy.boxId
            }}
            detailsUrl={`/workspaces/${workspaceId}/boxes/${proxy.boxId}`}
            fallbackLabel={proxy.boxId}
            className="text-blue-600 hover:text-blue-800 underline"
          />
        )
      }
    }
  ]

  return (
    <>
      <BaseListPage<components["schemas"]["IngressProxy"]>
        title="Ingress Proxies"
        resourcePath="/v1/workspaces/{workspaceId}/ingress-proxies"
        createDialog={CreateIngressProxyDialog}
        createButtonText="New Ingress Proxy"
        columns={columns}
        apiParams={{
          path: {
            workspaceId: workspaceId
          }
        }}
        emptyStateMessage="No ingress proxies created yet. Create your first proxy to get started."
        searchColumn="name"
        searchPlaceholder="Search proxies..."
      />
    </>
  )
}
