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
            <label className="text-sm font-medium">Box</label>
            <p className="text-sm text-muted-foreground">
              <ReferenceLabel
                resourceId={data.box}
                resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
                pathParams={{
                  workspaceId: data.workspace,
                  id: data.box
                }}
                detailsUrl={`/workspaces/${data.workspace}/boxes/${data.box}`}
                fallbackLabel="Box"
              />
            </p>
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
            <label className="text-sm font-medium">Machine Provider</label>
            <p className="text-sm text-muted-foreground">
              <ReferenceLabel
                resourceId={data.machine_provider}
                resourcePath="/v1/workspaces/{workspaceId}/machine-providers/{id}"
                pathParams={{ 
                  workspaceId: data.workspace, 
                  id: data.machine_provider
                }}
                detailsUrl={`/workspaces/${data.workspace}/machine-providers/${data.machine_provider}`}
                fallbackLabel="Provider"
              />
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Machine Provider Type</label>
            <p className="text-sm text-muted-foreground">
              {data.machine_provider_type ? (
                <Badge variant="outline" className="w-fit">
                  {data.machine_provider_type}
                </Badge>
              ) : (
                "N/A"
              )}
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