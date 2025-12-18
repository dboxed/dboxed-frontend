import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { TimeAgo } from "@/components/TimeAgo.tsx"
import type { components } from "@/api/models/dboxed-schema"

interface GeneralInfoCardProps {
  data: components["schemas"]["GitCredentials"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Git credentials configuration details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Host</dt>
            <dd className="text-sm mt-1">{data.host}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Path Glob</dt>
            <dd className="text-sm mt-1">{data.pathGlob || <span className="text-muted-foreground">—</span>}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Credentials Type</dt>
            <dd className="text-sm mt-1">
              <Badge variant="secondary" className="capitalize">
                {data.credentialsType}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Created</dt>
            <dd className="text-sm mt-1">
              <TimeAgo date={data.createdAt} />
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
