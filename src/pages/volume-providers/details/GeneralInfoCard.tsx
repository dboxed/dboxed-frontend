import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx";
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx";
import { LabelAndValue } from "@/components/LabelAndValue.tsx";
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
          <LabelAndValue
            label="Name"
            textValue={data.name}
          />
          <LabelAndValue
            label="Type"
            value={
              <Badge variant="secondary" className="capitalize">
                {data.type}
              </Badge>
            }
          />
          <LabelAndValue
            label="Status"
            value={
              <Badge variant={getStatusVariant(data.status)} className="capitalize">
                {data.status}
              </Badge>
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
        </div>
      </CardContent>
    </Card>
  )
}