import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import type { components } from "@/api/models/schema"

interface GeneralInfoCardProps {
  data: components["schemas"]["Machine"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Basic machine details and configuration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Machine ID</label>
            <p className="text-sm text-muted-foreground">{data.id}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{data.name}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Workspace ID</label>
            <p className="text-sm text-muted-foreground">{data.workspace}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Unboxed Version</label>
            <Badge variant="outline" className="w-fit">
              {data.unboxed_version}
            </Badge>
          </div>
          
          <div>
            <label className="text-sm font-medium">Cloud Provider ID</label>
            <p className="text-sm text-muted-foreground">
              {data.cloud_provider || "Not assigned"}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Cloud Provider Type</label>
            <p className="text-sm text-muted-foreground">
              {data.cloud_provider_type ? (
                <Badge variant="secondary" className="capitalize">
                  {data.cloud_provider_type}
                </Badge>
              ) : (
                "Not assigned"
              )}
            </p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Created At</label>
          <p className="text-sm text-muted-foreground">
            {new Date(data.created_at).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 