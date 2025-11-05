import { useNavigate } from "react-router"
import { useState } from "react"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { HardDrive } from "lucide-react"
import type { components } from "@/api/models/schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"
import { formatSize } from "@/utils/size.ts"
import { CreateVolumeDialog } from "@/pages/volumes/create/CreateVolumeDialog.tsx"
import { Badge } from "@/components/ui/badge.tsx"

export function VolumesOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Fetch volume providers (needed for volume creation validation)
  const volumeProvidersQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/volume-providers', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  }, {
    refetchInterval: 10000,
  })

  // Fetch volumes
  const volumesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/volumes', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const volumeProviders = volumeProvidersQuery.data?.items || []
  const volumes = volumesQuery.data?.items || []

  // Get recent items (last 3)
  const recentVolumes = volumes
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const items = recentVolumes.map((volume: components["schemas"]["Volume"]) => ({
    id: volume.id,
    content: (
      <div
        className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
        onClick={() => navigate(`/workspaces/${workspaceId}/volumes/${volume.id}`)}
      >
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{volume.name}</div>
        </div>
        <div className="flex items-center gap-2">
          {volume.volumeProviderType === "rustic" && volume.rustic && (
            <Badge variant="outline" className="text-xs">
              {formatSize(volume.rustic.fsSize)}
            </Badge>
          )}
        </div>
      </div>
    ),
  }))

  return (
    <>
      <WorkspaceOverviewCard
      icon={<HardDrive className="h-5 w-5" />}
      title="Volumes"
      description="Your storage volumes"
      count={volumes.length}
      isLoading={volumesQuery.isLoading}
      error={!!volumesQuery.error}
      items={items}
      emptyState={{
        message: "No volumes created yet",
        createButtonText: "Create First Volume",
        onCreateClick: () => setCreateDialogOpen(true),
        isCreateDisabled: volumeProviders.length === 0,
        createDisabledMessage: "Create a volume provider first",
      }}
      actions={{
        viewAllText: "View All",
        onViewAllClick: () => navigate(`/workspaces/${workspaceId}/volumes`),
        addNewText: "Add New",
        onAddNewClick: () => setCreateDialogOpen(true),
        isAddNewDisabled: volumeProviders.length === 0,
      }}
      />
      <CreateVolumeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  )
} 