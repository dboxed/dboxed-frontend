import { useLocation, useNavigate } from "react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { ListMachineProvidersPage } from "@/pages/machine-providers/ListMachineProvidersPage.tsx"
import { ListMachinesPage } from "@/pages/machines/ListMachinesPage.tsx"

export function MachinesPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  // Determine active tab from URL path
  const activeTab = location.pathname.includes('/machine-providers') ? 'machine-providers' : 'machines'

  const handleTabChange = (value: string) => {
    if (value === 'machines') {
      navigate(`/workspaces/${workspaceId}/machines`, { replace: true })
    } else {
      navigate(`/workspaces/${workspaceId}/machine-providers`, { replace: true })
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="machines">Machines</TabsTrigger>
          <TabsTrigger value="machine-providers">Machine Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="machines">
          <ListMachinesPage />
        </TabsContent>

        <TabsContent value="machine-providers">
          <ListMachineProvidersPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}