import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import type { components } from "@/api/models/schema"

interface GeneralInfoCardProps {
  data: components["schemas"]["Machine"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Basic machine details and configuration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{data.name}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Workspace</label>
            <p className="text-sm text-muted-foreground">
              <ReferenceLabel
                resourceId={data.workspace}
                resourcePath="/v1/workspaces/{workspaceId}"
                pathParams={{ workspaceId: data.workspace }}
                detailsUrl={`/workspaces/${data.workspace}`}
                fallbackLabel="Workspace"
              />
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Unboxed Version</label>
            <p className="text-sm text-muted-foreground">
              <Badge variant="outline" className="w-fit">
                {data.unboxed_version}
              </Badge>
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Cloud Provider</label>
            <p className="text-sm text-muted-foreground">
              <ReferenceLabel
                resourceId={data.cloud_provider}
                resourcePath="/v1/workspaces/{workspaceId}/cloud-providers/{id}"
                pathParams={{ 
                  workspaceId: data.workspace, 
                  id: data.cloud_provider 
                }}
                detailsUrl={`/workspaces/${data.workspace}/cloud-providers/${data.cloud_provider}`}
                fallbackLabel="Provider"
              />
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Cloud Provider Type</label>
            <p className="text-sm text-muted-foreground">
              {data.cloud_provider_type ? (
                <Badge variant="outline" className="w-fit">
                  {data.cloud_provider_type}
                </Badge>
              ) : (
                "N/A"
              )}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Network</label>
            <p className="text-sm text-muted-foreground">
              <ReferenceLabel
                resourceId={data.network}
                resourcePath="/v1/workspaces/{workspaceId}/networks/{id}"
                pathParams={{
                  workspaceId: data.workspace,
                  id: data.network
                }}
                detailsUrl={`/workspaces/${data.workspace}/networks/${data.network}`}
                fallbackLabel="Network"
              />
            </p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Created At</label>
          <p className="text-sm text-muted-foreground">
            {new Date(data.created_at).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 