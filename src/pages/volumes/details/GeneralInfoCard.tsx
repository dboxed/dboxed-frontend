import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";
import { LabelAndValue } from "@/components/LabelAndValue.tsx";
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx";
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
        <DetailsCardLayout>
          <LabelAndValue
            label="Name"
            textValue={data.name}
          />
          <LabelAndValue
            label="Provider Type"
            value={
              <Badge variant="secondary" className="capitalize">
                {data.volumeProviderType}
              </Badge>
            }
          />
          <LabelAndValue
            label="Volume Provider"
            value={
              <ReferenceLabel
                resourceId={data.volumeProvider}
                resourcePath="/v1/workspaces/{workspaceId}/volume-providers/{id}"
                pathParams={{
                  workspaceId: workspaceId,
                  id: data.volumeProvider
                }}
                detailsUrl={`/workspaces/${workspaceId}/volume-providers/${data.volumeProvider}`}
                fallbackLabel="Volume Provider"
                className="text-blue-600 hover:text-blue-800 underline"
              />
            }
          />
          <LabelAndValue
            label="Workspace"
            value={
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
            }
          />
          <LabelAndValue
            label="Created"
            textValue={new Date(data.createdAt).toLocaleString()}
          />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
}