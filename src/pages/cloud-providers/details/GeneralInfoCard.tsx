import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import type { components } from "@/api/models/schema"

interface GeneralInfoCardProps {
  data: components["schemas"]["CloudProvider"]
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>
          Basic cloud provider details and status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">ID</label>
            <p className="text-sm text-muted-foreground">{data.id}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{data.name}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Type</label>
            <Badge variant="outline" className="w-fit">
              {data.type}
            </Badge>
          </div>
          
          <div>
            <label className="text-sm font-medium">Status</label>
            <Badge 
              variant={data.status === "active" ? "default" : "secondary"}
              className="w-fit"
            >
              {data.status}
            </Badge>
          </div>
          
          <div>
            <label className="text-sm font-medium">Workspace ID</label>
            <p className="text-sm text-muted-foreground">{data.workspace}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Created At</label>
            <p className="text-sm text-muted-foreground">
              {new Date(data.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">SSH Key Fingerprint</label>
          <p className="text-sm text-muted-foreground">
            {data.ssh_key_fingerprint || "Not set"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 