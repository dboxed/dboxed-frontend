import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.tsx"
import { useParams, Link } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard"
import { CloudProviderInfoCard } from "./CloudProviderInfoCard"
import { MachineConnectCard } from "./MachineConnectCard.tsx"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import type { components } from "@/api/models/schema"

export function MachineDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { machineId } = useParams<{ machineId: string }>()

  if (!machineId) {
    return <div>Invalid machine ID</div>
  }

  const buildUpdateDefaults = (data: components["schemas"]["Machine"]): components["schemas"]["UpdateMachine"] => {
    return {
      boxSpec: data.box_spec
    }
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["Machine"], components["schemas"]["UpdateMachine"]>
      title={data => {
        if (!data) {
          return "Machine"
        }
        return `Machine ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/machines/{id}"
      enableSave={false}
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/machines`}
      buildUpdateDefaults={buildUpdateDefaults}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: machineId,
        }
      }}
    >
      {(data, form) => (
        <Tabs defaultValue="general" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="general">General Information</TabsTrigger>
              <TabsTrigger value="cloud-provider">Cloud Provider</TabsTrigger>
              <TabsTrigger value="connect">Connect Machine</TabsTrigger>
            </TabsList>
            <Button variant="outline" asChild>
              <Link to={`/workspaces/${workspaceId}/machines/${machineId}/box-spec`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Box Spec
              </Link>
            </Button>
          </div>

          <TabsContent value="general">
            <GeneralInfoCard data={data} />
          </TabsContent>

          <TabsContent value="cloud-provider">
            <CloudProviderInfoCard 
              cloudProviderId={data.cloud_provider} 
              cloudProviderType={data.cloud_provider_type}
              workspaceId={data.workspace}
            />
          </TabsContent>

          <TabsContent value="connect">
            <MachineConnectCard machineId={data.id} workspaceId={data.workspace} />
          </TabsContent>
        </Tabs>
      )}
    </BaseResourceDetailsPage>
  )
} 