import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { AttachedVolumes } from "./volumes/AttachedVolumes.tsx"
import { ComposeProjects } from "./compose-projects/ComposeProjects.tsx"
import { PortForwardings } from "./port-forwards/PortForwardings.tsx"
import { BoxLoadBalancerServices } from "./load-balancer-services/BoxLoadBalancerServices.tsx"
import type { components } from "@/api/models/schema"

interface VolumesAndProjectsTabProps {
  box: components["schemas"]["Box"]
}

export function BoxConfigTab({ box }: VolumesAndProjectsTabProps) {
  return (
    <Tabs defaultValue="compose" orientation="vertical" className="flex flex-row gap-6">
      <TabsList className="flex flex-col h-fit w-48 items-stretch shrink-0">
        <TabsTrigger value="compose" className="justify-start">
          Compose Projects
        </TabsTrigger>
        <TabsTrigger value="volumes" className="justify-start">
          Volumes
        </TabsTrigger>
        <TabsTrigger value="port-forwards" className="justify-start">
          Port Forwards
        </TabsTrigger>
        <TabsTrigger value="load-balancer-services" className="justify-start">
          Load Balancer Services
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 min-w-0">
        <TabsContent value="compose" className="m-0">
          <ComposeProjects box={box} />
        </TabsContent>

        <TabsContent value="volumes" className="m-0">
          <AttachedVolumes box={box} />
        </TabsContent>

        <TabsContent value="port-forwards" className="m-0">
          <PortForwardings box={box} />
        </TabsContent>

        <TabsContent value="load-balancer-services" className="m-0">
          <BoxLoadBalancerServices box={box} />
        </TabsContent>
      </div>
    </Tabs>
  )
}
