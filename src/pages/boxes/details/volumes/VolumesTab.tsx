import { AttachedVolumes } from "./AttachedVolumes.tsx"
import type { components } from "@/api/models/schema"

interface VolumesTabProps {
  box: components["schemas"]["Box"]
  saveBox: (data: components["schemas"]["UpdateBox"]) => Promise<boolean>
}

export function VolumesTab({ box, saveBox }: VolumesTabProps) {
  return (
    <div className="space-y-6">
      <AttachedVolumes box={box} />
    </div>
  )
}