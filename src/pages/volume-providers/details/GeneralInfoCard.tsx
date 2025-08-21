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
        <div className="grid gap-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Name</span>
            <span className="col-span-2">{data.name}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Type</span>
            <span className="col-span-2">
              <Badge variant="secondary" className="capitalize">
                {data.type}
              </Badge>
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Status</span>
            <span className="col-span-2">
              <Badge variant={getStatusVariant(data.status)} className="capitalize">
                {data.status}
              </Badge>
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Workspace</span>
            <span className="col-span-2">
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
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Created</span>
            <span className="col-span-2 text-sm text-muted-foreground">
              {new Date(data.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}