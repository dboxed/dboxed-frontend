import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx";
import { LabelAndValue } from "@/components/LabelAndValue.tsx";
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx";
import { StatusBadge } from "@/components/StatusBadge.tsx";
import { TimeAgo } from "@/components/TimeAgo.tsx";
import type { components } from "@/api/models/dboxed-schema";

interface GeneralInfoCardProps {
  data: components["schemas"]["VolumeProvider"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Basic information about this volume provider.
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
              <Badge variant="secondary" className="capitalize">
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
            label="Created"
            value={<TimeAgo date={data.createdAt} />}
          />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
}