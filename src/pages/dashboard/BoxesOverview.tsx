import { useNavigate } from "react-router"
import { useState } from "react"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Package } from "lucide-react"
import type { components } from "@/api/models/schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"
import { CreateBoxDialog } from "@/pages/boxes/create/CreateBoxDialog.tsx"
import { ContainerStatusBadge } from "@/pages/boxes/details/status/ContainerStatusBadge.tsx"
import { SandboxStatusBadge } from "@/pages/boxes/details/status/SandboxStatusBadge.tsx"
import { Badge } from "@/components/ui/badge.tsx"

export function BoxesOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Fetch boxes
  const boxesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const boxes = boxesQuery.data?.items || []

  // Get recent items (last 3)
  const recentBoxes = boxes
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const items = recentBoxes.map((box: components["schemas"]["Box"]) => ({
    id: box.id,
    content: (
      <div
        className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
        onClick={() => navigate(`/workspaces/${workspaceId}/boxes/${box.id}`)}
      >
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{box.name}</div>
          {box.networkType && (
            <Badge variant="outline" className="text-xs capitalize">
              {box.networkType}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <SandboxStatusBadge box={box} />
          <ContainerStatusBadge box={box} />
        </div>
      </div>
    ),
  }))

  return (
    <>
      <WorkspaceOverviewCard
        icon={<Package className="h-5 w-5" />}
        title="Boxes"
        description="Your containerized application configurations"
        count={boxes.length}
        isLoading={boxesQuery.isLoading}
        error={!!boxesQuery.error}
        items={items}
        emptyState={{
          message: "No boxes created yet",
          createButtonText: "Create First Box",
          onCreateClick: () => setCreateDialogOpen(true),
        }}
        actions={{
          viewAllText: "View All",
          onViewAllClick: () => navigate(`/workspaces/${workspaceId}/boxes`),
          addNewText: "Add New",
          onAddNewClick: () => setCreateDialogOpen(true),
        }}
      />
      <CreateBoxDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  )
} 