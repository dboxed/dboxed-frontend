import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
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
          <LabelAndValue
            label="Name"
            textValue={data.name}
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
            label="Dboxed Version"
            value={
              <Badge variant="outline" className="w-fit">
                {data.dboxedVersion}
              </Badge>
            }
          />
          
          <LabelAndValue
            label="Network"
            value={
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
            }
          />

          <LabelAndValue
            label="Machine"
            value={
              data.machine ? (
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
              )
            }
          />
        </div>
        
        <LabelAndValue
          label="Created At"
          textValue={new Date(data.createdAt).toLocaleString()}
        />
      </CardContent>
    </Card>
  )
} 