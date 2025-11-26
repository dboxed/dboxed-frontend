import { useNavigate } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import { Globe } from "lucide-react"
import type { components } from "@/api/models/dboxed-schema"
import { WorkspaceOverviewCard } from "@/pages/dashboard/WorkspaceOverviewCard.tsx"
import { CreateLoadBalancerDialog } from "@/pages/load-balancers/create/CreateLoadBalancerDialog.tsx"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import { Badge } from "@/components/ui/badge.tsx"

export function LoadBalancersOverview() {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const loadBalancersQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/load-balancers', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  }, {
    refetchInterval: 10000,
  })

  const loadBalancers = loadBalancersQuery.data?.items || []

  // Get recent items (last 3)
  const recentProxies = loadBalancers
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const items = recentProxies.map((loadBalancer: components["schemas"]["LoadBalancer"]) => ({
    id: loadBalancer.id,
    content: (
      <div
        className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
        onClick={() => navigate(`/workspaces/${workspaceId}/load-balancers/${loadBalancer.id}`)}
      >
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{loadBalancer.name}</div>
          <Badge variant="secondary" className="text-xs capitalize">
            {loadBalancer.loadBalancerType}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge item={loadBalancer}/>
        </div>
      </div>
    ),
  }))

  return (
    <>
      <WorkspaceOverviewCard
        icon={<Globe className="h-5 w-5" />}
        title="Load Balancers"
        description="Manage your load balancer configurations"
        count={loadBalancers.length}
        isLoading={loadBalancersQuery.isLoading}
        error={!!loadBalancersQuery.error}
        items={items}
        addNewDialog={CreateLoadBalancerDialog}
        emptyState={{
          message: "No Load Balancers configured yet",
          createButtonText: "Create First Load Balancer",
        }}
        actions={{
          viewAllText: "View All",
          onViewAllClick: () => navigate(`/workspaces/${workspaceId}/load-balancers`),
          addNewText: "Add New",
        }}
      />
    </>
  )
}
