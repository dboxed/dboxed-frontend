import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import type { components } from "@/api/models/schema"

interface GeneralInfoCardProps {
  data: components["schemas"]["CloudProvider"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Basic cloud provider details and status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{data.name}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Type</label>
            <p className="text-sm text-muted-foreground">
              <Badge variant="outline" className="w-fit">
                {data.type}
              </Badge>
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Status</label>
            <p className="text-sm text-muted-foreground">
              <Badge variant="outline" className="w-fit">
                {data.status}
              </Badge>
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
            <label className="text-sm font-medium">Created At</label>
            <p className="text-sm text-muted-foreground">
              {new Date(data.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">SSH Key Fingerprint</label>
          <p className="text-sm text-muted-foreground">
            {data.ssh_key_fingerprint || "N/A"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 