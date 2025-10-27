import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import type { components } from "@/api/models/schema"
import { Badge } from "@/components/ui/badge.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx";

interface GeneralInfoCardProps {
  data: components["schemas"]["S3Bucket"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ok":
        return "default"
      case "error":
        return "destructive"
      default:
        return "secondary"
    }
  }

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
            <Badge variant={getStatusVariant(data.status)}>
              {data.status}
            </Badge>
          }
        />
        <LabelAndValue
          label="Created At"
          value={new Date(data.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })}
        />
        <LabelAndValue label="ID" value={data.id.toString()} />
      </CardContent>
    </Card>
  )
}
