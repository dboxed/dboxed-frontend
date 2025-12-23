import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { TimeAgo } from "@/components/TimeAgo.tsx"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"
import { AlertTriangle } from "lucide-react"
import type { components } from "@/api/models/dboxed-schema"
import { StatusBadge } from "@/components/StatusBadge.tsx";

interface GeneralInfoCardProps {
  data: components["schemas"]["DboxedSpec"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  return (
    <div className="space-y-6">
      {data.status === "error" && data.statusDetails && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{data.statusDetails}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>
            Dboxed spec configuration details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">Git URL</dt>
              <dd className="text-sm mt-1 font-mono">{data.gitUrl}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Spec File</dt>
              <dd className="text-sm mt-1 font-mono">{data.specFile}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Subdirectory</dt>
              <dd className="text-sm mt-1">
                {data.subdir ? (
                  <span className="font-mono">{data.subdir}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="text-sm mt-1">
                <StatusBadge item={data}/>
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
    </div>
  )
}
