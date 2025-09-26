import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import type { components } from "@/api/models/schema"
import { LabelAndValue } from "@/components/LabelAndValue.tsx";

interface GeneralInfoCardProps {
  data: components["schemas"]["MachineProvider"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Basic machine provider details and status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelAndValue
            label="Name"
            textValue={data.name}
          />
          
          <LabelAndValue
            label="Type"
            value={
              <Badge variant="outline" className="w-fit">
                {data.type}
              </Badge>
            }
          />
          
          <LabelAndValue
            label="Status"
            value={
              <Badge variant="outline" className="w-fit">
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
                pathParams={{ workspaceId: data.workspace }}
                detailsUrl={`/workspaces/${data.workspace}`}
                fallbackLabel="Workspace"
              />
            }
          />
          
          <LabelAndValue
            label="Created At"
            textValue={new Date(data.createdAt).toLocaleString()}
          />
        </div>
        
        <LabelAndValue
          label="SSH Key Fingerprint"
          textValue={data.sshKeyFingerprint || "N/A"}
        />
      </CardContent>
    </Card>
  )
} 