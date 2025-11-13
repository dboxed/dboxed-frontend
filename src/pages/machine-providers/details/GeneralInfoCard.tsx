import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import type { components } from "@/api/models/schema"
import { LabelAndValue } from "@/components/LabelAndValue.tsx";
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx";
import { StatusBadge } from "@/components/StatusBadge.tsx";
import { TimeAgo } from "@/components/TimeAgo.tsx";

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
      <CardContent>
        <DetailsCardLayout>
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
              <StatusBadge item={data}/>
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
            label="Created"
            value={<TimeAgo date={data.createdAt} />}
          />
          <LabelAndValue
            label="SSH Key Fingerprint"
            textValue={data.sshKeyFingerprint || "N/A"}
          />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
} 