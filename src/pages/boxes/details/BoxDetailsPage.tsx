import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.tsx"
import { useParams, Link } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard"
import { BoxConnectCard } from "./BoxConnectCard.tsx"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
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
      enableSave={false}
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
      {(data) => (
        <Tabs defaultValue="general" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General Information</TabsTrigger>
              <TabsTrigger value="connect">Connect Box</TabsTrigger>
            </TabsList>
            <Button variant="outline" asChild>
              <Link to={`/workspaces/${workspaceId}/boxes/${boxId}/box-spec`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Box Spec
              </Link>
            </Button>
          </div>

          <TabsContent value="general">
            <GeneralInfoCard data={data} />
          </TabsContent>

          <TabsContent value="connect">
            <BoxConnectCard boxId={data.id} workspaceId={data.workspace} />
          </TabsContent>
        </Tabs>
      )}
    </BaseResourceDetailsPage>
  )
} 