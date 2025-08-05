import { Link } from "react-router"
import { useDboxedQueryClient } from "@/api/api.ts"
import type { paths } from "@/api/models/schema";

interface ReferenceLabelProps {
  /** The ID of the resource to fetch and display */
  resourceId: number | null
  /** The API path to fetch the resource (e.g., "/v1/workspaces/{workspaceId}") */
  resourcePath: keyof paths
  /** Parameters to substitute in the resource path */
  pathParams: Record<string, any>
  /** URL to navigate to when the link is clicked */
  detailsUrl: string
  /** Text to show before the ID if resource loading fails */
  fallbackLabel?: string
  /** CSS classes for the link styling */
  className?: string
}

/**
 * A reusable component that fetches a resource by ID and displays it as a clickable link
 * with the resource name. Handles loading states and error fallbacks gracefully.
 * 
 * @example
 * <ReferenceLabel
 *   resourceId={workspaceId}
 *   resourcePath="/v1/workspaces/{workspaceId}"
 *   pathParams={{ workspaceId }}
 *   detailsUrl={`/workspaces/${workspaceId}`}
 *   fallbackLabel="Workspace"
 * />
 */
export function ReferenceLabel({
  resourceId,
  resourcePath,
  pathParams,
  detailsUrl,
  fallbackLabel = "Unknown",
  className = "text-blue-600 hover:text-blue-800 underline"
}: ReferenceLabelProps) {
  const client = useDboxedQueryClient()

  const resourceQuery = client.useQuery('get', resourcePath as any, {
    params: {
      path: pathParams
    },
  }, {
    enabled: !!resourceId
  })

  if (!resourceId) {
    return <span className="text-sm text-muted-foreground">N/A</span>
  }

  if (resourceQuery.isLoading) {
    return <span className="text-sm text-muted-foreground">Loading...</span>
  }

  if (resourceQuery.error || !resourceQuery.data) {
    return (
      <span className="text-sm text-muted-foreground">
        {fallbackLabel} {resourceId}
      </span>
    )
  }

  const resource = resourceQuery.data as { name: string }

  return (
    <Link to={detailsUrl} className={className}>
      {resource.name}
    </Link>
  )
} 