import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard"
import { BoxConnectCard } from "./BoxConnectCard.tsx"
import { LogsPage } from "./logs/LogsPage.tsx"
import { BoxSpecTab } from "./boxspec/BoxSpecTab.tsx"
import type { components } from "@/api/models/schema"

export function BoxDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { boxId } = useParams<{ boxId: string }>()

  if (!boxId) {
    return <div>Invalid box ID</div>
  }

  const buildUpdateDefaults = (data: components["schemas"]["Box"]): components["schemas"]["UpdateBox"] => {
    return {
      boxSpec: data.box_spec
    }
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["Box"], components["schemas"]["UpdateBox"]>
      title={data => {
        if (!data) {
          return "Box"
        }
        return `Box ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
      enableSave={true}
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/boxes`}
      buildUpdateDefaults={buildUpdateDefaults}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: boxId,
        }
      }}
    >
      {(data, form) => (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="connect">Connect Box</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="boxspec">Box Spec</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralInfoCard data={data} />
          </TabsContent>

          <TabsContent value="connect">
            <BoxConnectCard boxId={data.id} workspaceId={data.workspace} />
          </TabsContent>

          <TabsContent value="logs">
            <LogsPage boxId={data.id} />
          </TabsContent>

          <TabsContent value="boxspec">
            <BoxSpecTab form={form} />
          </TabsContent>
        </Tabs>
      )}
    </BaseResourceDetailsPage>
  )
} 