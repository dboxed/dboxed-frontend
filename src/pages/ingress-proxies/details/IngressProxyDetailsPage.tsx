import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"
import { IngressProxyStatusBadge } from "../IngressProxyStatusBadge.tsx"

function IngressProxyDetailsContent({ data }: { data: components["schemas"]["IngressProxy"] }) {
  const { workspaceId } = useSelectedWorkspaceId()

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Ingress proxy configuration and status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Name</dt>
            <dd className="mt-1 text-sm">{data.name}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-muted-foreground">Proxy Type</dt>
            <dd className="mt-1">
              <Badge variant="secondary" className="capitalize">
                {data.proxyType}
              </Badge>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
            <dd className="mt-1">
              <IngressProxyStatusBadge status={data.status} />
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-muted-foreground">Status Details</dt>
            <dd className="mt-1 text-sm">{data.statusDetails || "-"}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-muted-foreground">HTTP Port</dt>
            <dd className="mt-1">
              <code className="text-sm bg-muted px-1 py-0.5 rounded">
                {data.httpPort}
              </code>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-muted-foreground">HTTPS Port</dt>
            <dd className="mt-1">
              <code className="text-sm bg-muted px-1 py-0.5 rounded">
                {data.httpsPort}
              </code>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-muted-foreground">Box</dt>
            <dd className="mt-1">
              <ReferenceLabel
                resourceId={data.boxId}
                resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
                pathParams={{
                  workspaceId: workspaceId!,
                  id: data.boxId
                }}
                detailsUrl={`/workspaces/${workspaceId}/boxes/${data.boxId}`}
                fallbackLabel={data.boxId}
                className="text-blue-600 hover:text-blue-800 underline"
              />
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
            <dd className="mt-1 text-sm">
              {new Date(data.createdAt).toLocaleString()}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-muted-foreground">ID</dt>
            <dd className="mt-1">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                {data.id}
              </code>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

export function IngressProxyDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { proxyId } = useParams<{ proxyId: string }>()

  if (!proxyId) {
    return <div>Invalid proxy ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["IngressProxy"], never>
      title={data => {
        if (!data) {
          return "Ingress Proxy"
        }
        return `Ingress Proxy ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/ingress-proxies/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/ingress-proxies`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: proxyId,
        }
      }}
    >
      {(data) => <IngressProxyDetailsContent data={data} />}
    </BaseResourceDetailsPage>
  )
}
