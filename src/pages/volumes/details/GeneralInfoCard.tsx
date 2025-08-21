import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx";
import { formatSize } from "@/utils/size.ts";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";

interface GeneralInfoCardProps {
  data: components["schemas"]["Volume"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Basic information about this volume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{data.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Size</label>
            <p className="text-sm text-muted-foreground">{formatSize(data.size)}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Provider Type</label>
            <div className="mt-1">
              <Badge variant="secondary" className="capitalize">
                {data.volume_provider_type}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Volume Provider</label>
            <div className="mt-1">
              <ReferenceLabel
                resourceId={data.volume_provider}
                resourcePath="/v1/workspaces/{workspaceId}/volume-providers/{id}"
                pathParams={{
                  workspaceId: workspaceId,
                  id: data.volume_provider
                }}
                detailsUrl={`/workspaces/${workspaceId}/volume-providers/${data.volume_provider}`}
                fallbackLabel="Volume Provider"
                className="text-blue-600 hover:text-blue-800 underline"
              />
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