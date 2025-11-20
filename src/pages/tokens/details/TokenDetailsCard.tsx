import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
import { Key } from "lucide-react"
import { TimeAgo } from "@/components/TimeAgo.tsx"
import { TokenScopeBadge } from "../TokenScopeBadge.tsx"
import type { components } from "@/api/models/dboxed-schema"

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
            value={<TokenScopeBadge token={token} />}
          />

          <LabelAndValue
            label="Created"
            value={<TimeAgo date={token.createdAt} />}
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