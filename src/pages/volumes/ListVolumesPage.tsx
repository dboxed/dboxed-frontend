import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/dboxed-schema";
import { Badge } from "@/components/ui/badge.tsx";
import { BaseListPage } from "@/pages/base";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";
import { CreateVolumeDialog } from "./create/CreateVolumeDialog.tsx";
import { VolumeMountBadge } from "./details/VolumeMountBadge.tsx";
import { useDboxedQueryClient } from "@/api/client.ts";
import { TimeAgo } from "@/components/TimeAgo.tsx";

export function ListVolumesPage() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  // Fetch volume providers to check if any exist
  const volumeProvidersQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/volume-providers', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const volumeProviders = volumeProvidersQuery.data?.items || []
  const hasVolumeProviders = volumeProviders.length > 0

  // Define columns for the DataTable
  const columns: ColumnDef<components["schemas"]["Volume"]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        const id = row.original.id
        return (
          <button
            onClick={() => navigate(`/workspaces/${workspaceId}/volumes/${id}`)}
            className="font-medium text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            {name}
          </button>
        )
      },
    },
    {
      accessorKey: "volumeProviderType",
      header: "Provider Type",
      cell: ({ row }) => {
        const type = row.getValue("volumeProviderType") as string
        return (
          <Badge variant="secondary" className="capitalize">
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "attachment",
      header: "Attachment",
      cell: ({ row }) => {
        const attachment = row.original.attachment
        if (attachment) {
          return (
            <ReferenceLabel<components["schemas"]["Box"]>
              resourceId={attachment.boxId}
              resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
              pathParams={{
                workspaceId: workspaceId,
                id: attachment.boxId
              }}
              detailsUrl={(box) => `/workspaces/${workspaceId}/boxes/${box.id}`}
              fallbackLabel="Box"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            />
          )
        }
        return (
          <span className="text-sm text-muted-foreground">Not attached</span>
        )
      },
    },
    {
      accessorKey: "mountId",
      header: "Mount",
      cell: ({ row }) => {
        return <VolumeMountBadge mountStatus={row.original.mountStatus} />
      },
    },
    {
      accessorKey: "volumeProvider",
      header: "Volume Provider",
      cell: ({ row }) => {
        const providerId = row.getValue("volumeProvider") as number
        return (
          <ReferenceLabel
            resourceId={providerId}
            resourcePath="/v1/workspaces/{workspaceId}/volume-providers/{id}"
            pathParams={{
              workspaceId: workspaceId,
              id: providerId
            }}
            detailsUrl={`/workspaces/${workspaceId}/volume-providers/${providerId}`}
            fallbackLabel="Volume Provider"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          />
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string
        return <TimeAgo date={createdAt} className="text-sm" />
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
            onClick={() => navigate(`/workspaces/${workspaceId}/volumes/${id}`)}
          >
            View Details
          </Button>
        )
      },
    },
  ]

  return (
    <BaseListPage<components["schemas"]["Volume"]>
      title="Volumes"
      resourcePath="/v1/workspaces/{workspaceId}/volumes"
      createDialog={CreateVolumeDialog}
      columns={columns}
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      allowCreate={hasVolumeProviders}
      createDisabledMessage="Create a volume provider first"
      emptyStateMessage="No volumes configured yet. Create your first volume to get started."
      searchColumn="name"
      searchPlaceholder="Search volumes..."
    />
  )
}