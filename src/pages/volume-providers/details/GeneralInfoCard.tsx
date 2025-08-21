import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";
import type { components } from "@/api/models/schema";

interface GeneralInfoCardProps {
  data: components["schemas"]["VolumeProvider"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'error':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Basic information about this volume provider.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{data.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <div className="mt-1">
              <Badge variant="secondary" className="capitalize">
                {data.type}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <div className="mt-1">
              <Badge variant={getStatusVariant(data.status)} className="capitalize">
                {data.status}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Workspace</label>
            <div className="mt-1">
              <ReferenceLabel
                resourceId={data.workspace}
                resourcePath="/v1/workspaces/{workspaceId}"
                pathParams={{
                  workspaceId: data.workspace
                }}
                detailsUrl={`/workspaces/${data.workspace}`}
                fallbackLabel="Workspace"
                className="text-blue-600 hover:text-blue-800 underline"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Created</label>
            <p className="text-sm text-muted-foreground">
              {new Date(data.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}