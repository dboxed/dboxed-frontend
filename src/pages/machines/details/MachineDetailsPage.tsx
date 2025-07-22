import { BaseDetailsPage } from "@/pages/base/BaseDetailsPage.tsx"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard"
import { CloudProviderInfoCard } from "./CloudProviderInfoCard"
import { MachineConnectCard } from "./MachineConnectCard.tsx"
import type { components } from "@/api/models/schema"

export function MachineDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { machineId } = useParams<{ machineId: string }>()

  if (!machineId) {
    return <div>Invalid machine ID</div>
  }

  return (
    <BaseDetailsPage<components["schemas"]["Machine"], components["schemas"]["UpdateMachine"]>
      title="Machine Details"
      resourcePath="/v1/workspaces/{workspaceId}/machines/{id}"
      enableSave={false}
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/machines`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: machineId,
        }
      }}
    >
      {(data, form) => (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="cloud-provider">Cloud Provider</TabsTrigger>
            <TabsTrigger value="connect">Connect Machine</TabsTrigger>
          </TabsList>

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
    </BaseDetailsPage>
  )
} 