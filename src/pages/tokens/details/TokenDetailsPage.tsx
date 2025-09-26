import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { TokenDetailsCard } from "./TokenDetailsCard.tsx"
import type { components } from "@/api/models/schema"

export function TokenDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { tokenId } = useParams<{ tokenId: string }>()

  if (!tokenId) {
    return <div>Invalid token ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["Token"], never>
      title={data => {
        if (!data) {
          return "Token"
        }
        return `Token ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/tokens/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/tokens`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: tokenId,
        }
      }}
    >
      {(data) => (
        <div className="space-y-6">
          <TokenDetailsCard token={data} />
        </div>
      )}
    </BaseResourceDetailsPage>
  )
}