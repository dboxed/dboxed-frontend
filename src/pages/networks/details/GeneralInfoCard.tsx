import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { Label } from "@/components/ui/label.tsx"
import type { components } from "@/api/models/schema"

interface GeneralInfoCardProps {
  data: components["schemas"]["Network"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Basic network details and status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <p className="text-sm text-muted-foreground">{data.name}</p>
          </div>
          
          <div>
            <Label>Type</Label>
            <p className="text-sm text-muted-foreground">
              <Badge variant="outline" className="w-fit capitalize">
                {data.type}
              </Badge>
            </p>
          </div>
          
          <div>
            <Label>Status</Label>
            <p className="text-sm text-muted-foreground">
              <Badge variant={"outline"} className="w-fit capitalize">
                {data.status}
              </Badge>
            </p>
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
            <Label>Created At</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(data.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 