import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import type { components } from "@/api/models/schema"
import { LabelAndValue } from "@/components/LabelAndValue.tsx";
import { StatusBadge } from "@/components/StatusBadge.tsx";
import { TimeAgo } from "@/components/TimeAgo.tsx";

interface GeneralInfoCardProps {
  data: components["schemas"]["S3Bucket"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LabelAndValue label="Bucket Name" value={data.bucket} />
        <LabelAndValue label="Endpoint" value={data.endpoint} />
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
          label="Created At"
          value={<TimeAgo date={data.createdAt} />}
        />
        <LabelAndValue label="ID" value={data.id.toString()} />
      </CardContent>
    </Card>
  )
}
