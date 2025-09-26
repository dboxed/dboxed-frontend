import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
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
      <CardContent>
        <DetailsCardLayout>
          <LabelAndValue
            label="Name"
            textValue={token.name}
          />

          <LabelAndValue
            label="Scope"
            value={
              <Badge variant={token.forWorkspace ? "default" : "secondary"}>
                {token.forWorkspace ? "Workspace" : (
                  <>
                    Box {token.boxId && (
                      <>
                        (<ReferenceLabel
                          resourceId={token.boxId}
                          resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
                          pathParams={{
                            workspaceId: token.workspace,
                            id: token.boxId
                          }}
                          detailsUrl={`/workspaces/${token.workspace}/boxes/${token.boxId}`}
                          fallbackLabel="Box"
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        />)
                      </>
                    )}
                  </>
                )}
              </Badge>
            }
          />

          <LabelAndValue
            label="Created At"
            textValue={new Date(token.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          />

          <LabelAndValue
            label="Token ID"
            textValue={token.id}
          />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
}