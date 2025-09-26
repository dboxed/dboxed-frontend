import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Label } from "@/components/ui/label.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { Key } from "lucide-react"
import type { components } from "@/api/models/schema"

interface TokenDetailsCardProps {
  token: components["schemas"]["Token"]
}

export function TokenDetailsCard({ token }: TokenDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Token Details</span>
        </CardTitle>
        <CardDescription>
          API token information and configuration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Name</Label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {token.name}
          </p>
        </div>

        <div>
          <Label>Scope</Label>
          <div className="mt-1">
            <Badge variant={token.forWorkspace ? "default" : "secondary"}>
              {token.forWorkspace ? "Workspace" : "Box"}
            </Badge>
          </div>
        </div>

        {token.boxId && (
          <div>
            <Label>Associated Box</Label>
            <div className="mt-1">
              <ReferenceLabel
                resourceId={token.boxId}
                resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
                pathParams={{
                  workspaceId: token.workspace,
                  id: token.boxId
                }}
                detailsUrl={`/workspaces/${token.workspace}/boxes/${token.boxId}`}
                fallbackLabel="Box"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              />
            </div>
          </div>
        )}

        <div>
          <Label>Created At</Label>
          <p className="text-sm text-muted-foreground">
            {new Date(token.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        <div>
          <Label>Token ID</Label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {token.id}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}