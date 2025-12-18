import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import type { components } from "@/api/models/dboxed-schema"

export function GitCredentialsDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <div>Invalid git credentials ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["GitCredentials"], components["schemas"]["UpdateGitCredentials"]>
      title="Git Credentials"
      resourcePath="/v1/workspaces/{workspaceId}/git-credentials/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/git-credentials`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: id,
        }
      }}
    >
      {(data) => (
        <GeneralInfoCard data={data} />
      )}
    </BaseResourceDetailsPage>
  )
}
