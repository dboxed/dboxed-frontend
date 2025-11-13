import { useNavigate } from "react-router"
import { useState } from "react"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Globe } from "lucide-react"
import type { components } from "@/api/models/schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"
import { CreateIngressProxyDialog } from "@/pages/ingress-proxies/create/CreateIngressProxyDialog.tsx"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import { Badge } from "@/components/ui/badge.tsx"

export function IngressProxiesOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Fetch ingress proxies
  const proxiesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/ingress-proxies', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  }, {
    refetchInterval: 10000,
  })

  const proxies = proxiesQuery.data?.items || []

  // Get recent items (last 3)
  const recentProxies = proxies
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const items = recentProxies.map((proxy: components["schemas"]["IngressProxy"]) => ({
    id: proxy.id,
    content: (
      <div
        className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
        onClick={() => navigate(`/workspaces/${workspaceId}/ingress-proxies/${proxy.id}`)}
      >
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{proxy.name}</div>
          <Badge variant="secondary" className="text-xs capitalize">
            {proxy.proxyType}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge item={proxy}/>
        </div>
      </div>
    ),
  }))

  return (
    <>
      <WorkspaceOverviewCard
        icon={<Globe className="h-5 w-5" />}
        title="Ingress Proxies"
        description="Manage your ingress proxy configurations"
        count={proxies.length}
        isLoading={proxiesQuery.isLoading}
        error={!!proxiesQuery.error}
        items={items}
        emptyState={{
          message: "No ingress proxies configured yet",
          createButtonText: "Create First Proxy",
          onCreateClick: () => setCreateDialogOpen(true),
        }}
        actions={{
          viewAllText: "View All",
          onViewAllClick: () => navigate(`/workspaces/${workspaceId}/ingress-proxies`),
          addNewText: "Add New",
          onAddNewClick: () => setCreateDialogOpen(true),
        }}
      />
      <CreateIngressProxyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  )
}
