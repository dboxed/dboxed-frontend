import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard"
import { MachineProviderInfoCard } from "./MachineProviderInfoCard"
import type { components } from "@/api/models/schema"

export function MachineDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { machineId } = useParams<{ machineId: string }>()

  if (!machineId) {
    return <div>Invalid machine ID</div>
  }

  const buildUpdateDefaults = (): components["schemas"]["UpdateMachine"] => {
    return {

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
      {(data) => (
        <Tabs defaultValue="general" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General Information</TabsTrigger>
              <TabsTrigger value="machine-provider">Machine Provider</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general">
            <GeneralInfoCard data={data} />
          </TabsContent>

          <TabsContent value="machine-provider">
            <MachineProviderInfoCard
              machineProviderId={data.machine_provider}
              machineProviderType={data.machine_provider_type}
              workspaceId={data.workspace}
            />
          </TabsContent>
        </Tabs>
      )}
    </BaseResourceDetailsPage>
  )
} 