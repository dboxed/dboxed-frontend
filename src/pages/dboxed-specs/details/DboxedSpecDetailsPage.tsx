import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import type { components } from "@/api/models/dboxed-schema"

export function DboxedSpecDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <div>Invalid dboxed spec ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["DboxedSpec"], components["schemas"]["UpdateDboxedSpec"]>
      title="Dboxed Spec"
      resourcePath="/v1/workspaces/{workspaceId}/dboxed-specs/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/dboxed-specs`}
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
