import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
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
      <CardContent>
        <DetailsCardLayout>
          <LabelAndValue
            label="Name"
            textValue={data.name}
          />

          <LabelAndValue
            label="Box"
            value={
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
            }
          />
          
          <LabelAndValue
            label="Workspace"
            value={
              <ReferenceLabel
                resourceId={data.workspace}
                resourcePath="/v1/workspaces/{workspaceId}"
                pathParams={{ workspaceId: data.workspace }}
                detailsUrl={`/workspaces/${data.workspace}`}
                fallbackLabel="Workspace"
              />
            }
          />
          
          <LabelAndValue
            label="Machine Provider"
            value={
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
            }
          />
          
          <LabelAndValue
            label="Machine Provider Type"
            value={
              <Badge variant="outline" className="w-fit">
                {data.machineProviderType}
              </Badge>
            }
          />
          <LabelAndValue
            label="Created At"
            textValue={new Date(data.createdAt).toLocaleString()}
          />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
} 