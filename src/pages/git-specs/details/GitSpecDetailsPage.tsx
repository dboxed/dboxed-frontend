import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import type { components } from "@/api/models/dboxed-schema"

export function GitSpecDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <div>Invalid git spec ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["GitSpec"], components["schemas"]["UpdateGitSpec"]>
      title="Git Spec"
      resourcePath="/v1/workspaces/{workspaceId}/git-specs/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/git-specs`}
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
