import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { Label } from "@/components/ui/label.tsx"
import type { components } from "@/api/models/schema"

interface GeneralInfoCardProps {
  data: components["schemas"]["Box"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Basic box details and configuration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <p className="text-sm text-muted-foreground">{data.name}</p>
          </div>
          
          <div>
            <Label>Workspace</Label>
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
            <Label>Dboxed Version</Label>
            <p className="text-sm text-muted-foreground">
              <Badge variant="outline" className="w-fit">
                {data.dboxedVersion}
              </Badge>
            </p>
          </div>
          
          <div>
            <Label>Network</Label>
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

          <div>
            <Label>Machine</Label>
            <p className="text-sm text-muted-foreground">
              {data.machine ? (
                <ReferenceLabel
                  resourceId={data.machine}
                  resourcePath="/v1/workspaces/{workspaceId}/machines/{id}"
                  pathParams={{
                    workspaceId: data.workspace,
                    id: data.machine
                  }}
                  detailsUrl={`/workspaces/${data.workspace}/machines/${data.machine}`}
                  fallbackLabel="Machine"
                />
              ) : (
                <span className="text-muted-foreground">No machine assigned</span>
              )}
            </p>
          </div>
        </div>
        
        <div>
          <Label>Created At</Label>
          <p className="text-sm text-muted-foreground">
            {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 