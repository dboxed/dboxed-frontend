import { AttachedVolumes } from "./AttachedVolumes.tsx"
import type { components } from "@/api/models/schema"

interface VolumesTabProps {
  box: components["schemas"]["Box"]
}

export function VolumesTab({ box }: VolumesTabProps) {
  return (
    <div className="space-y-6">
      <AttachedVolumes box={box} />
    </div>
  )
}