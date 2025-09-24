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
                resourceId={data.machineProvider}
                resourcePath="/v1/workspaces/{workspaceId}/machine-providers/{id}"
                pathParams={{ 
                  workspaceId: data.workspace, 
                  id: data.machineProvider
                }}
                detailsUrl={`/workspaces/${data.workspace}/machine-providers/${data.machineProvider}`}
                fallbackLabel="Provider"
              />
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Machine Provider Type</label>
            <p className="text-sm text-muted-foreground">
              <Badge variant="outline" className="w-fit">
                {data.machineProviderType}
              </Badge>
            </p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Created At</label>
          <p className="text-sm text-muted-foreground">
            {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 