import { AttachedVolumes } from "./volumes/AttachedVolumes.tsx"
import { ComposeProjects } from "./compose-projects/ComposeProjects.tsx"
import type { components } from "@/api/models/schema"

interface VolumesAndProjectsTabProps {
  box: components["schemas"]["Box"]
}

export function BoxConfigTab({ box }: VolumesAndProjectsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AttachedVolumes box={box} />
      <ComposeProjects box={box} />
    </div>
  )
}
