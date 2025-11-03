import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import { TimeAgo } from "@/components/TimeAgo.tsx"
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
      <CardContent>
        <DetailsCardLayout>
          <LabelAndValue
            label="Name"
            textValue={data.name}
          />
          
          <LabelAndValue
            label="Type"
            value={
              <Badge variant="outline" className="w-fit capitalize">
                {data.type}
              </Badge>
            }
          />
          
          <LabelAndValue
            label="Status"
            value={
              <StatusBadge
                item={{
                  status: data.status,
                  statusDetails: data.statusDetails
                }}
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
            label="Created"
            value={<TimeAgo date={data.createdAt} />}
          />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
} 