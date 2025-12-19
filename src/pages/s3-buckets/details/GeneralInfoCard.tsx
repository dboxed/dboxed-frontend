import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import { TimeAgo } from "@/components/TimeAgo.tsx"

interface GeneralInfoCardProps {
  data: components["schemas"]["S3Bucket"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Basic information about this S3 bucket.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DetailsCardLayout>
          <LabelAndValue label="Bucket Name" textValue={data.bucket} />
          <LabelAndValue label="Endpoint" textValue={data.endpoint} />
          <LabelAndValue label="Region" textValue={data.determinedRegion || "—"} />
          <LabelAndValue
            label="Status"
            value={<StatusBadge item={data} />}
          />
          <LabelAndValue
            label="Created"
            value={<TimeAgo date={data.createdAt} />}
          />
          <LabelAndValue label="ID" textValue={data.id} />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
}
