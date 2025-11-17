import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import type { components } from "@/api/models/schema"

interface TokenScopeBadgeProps {
  token: components["schemas"]["Token"]
}

export function TokenScopeBadge({ token }: TokenScopeBadgeProps) {
  // Determine scope type and resource
  if (token.boxId) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="capitalize">
          Box
        </Badge>
        <ReferenceLabel
          resourceId={token.boxId}
          resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
          pathParams={{
            workspaceId: token.workspace,
            id: token.boxId
          }}
          detailsUrl={`/workspaces/${token.workspace}/boxes/${token.boxId}`}
          fallbackLabel="Box"
        />
      </div>
    )
  }

  if (token.loadBalancerId) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="capitalize">
          Load Balancer
        </Badge>
        <ReferenceLabel
          resourceId={token.loadBalancerId}
          resourcePath="/v1/workspaces/{workspaceId}/load-balancers/{id}"
          pathParams={{
            workspaceId: token.workspace,
            id: token.loadBalancerId
          }}
          detailsUrl={`/workspaces/${token.workspace}/load-balancers/${token.loadBalancerId}`}
          fallbackLabel="Load Balancer"
        />
      </div>
    )
  }

  if (token.forWorkspace) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="capitalize">
          Workspace
        </Badge>
        <ReferenceLabel
          resourceId={token.workspace}
          resourcePath="/v1/workspaces/{workspaceId}"
          pathParams={{
            workspaceId: token.workspace
          }}
          detailsUrl={`/workspaces/${token.workspace}`}
          fallbackLabel="Workspace"
        />
      </div>
    )
  }

  // Fallback for unknown scope
  return (
    <Badge variant="secondary">
      Unknown Scope
    </Badge>
  )
}
