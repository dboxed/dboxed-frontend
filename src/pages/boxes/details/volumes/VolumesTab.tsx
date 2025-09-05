import { AttachedVolumes } from "./AttachedVolumes.tsx"
import { FileBundles } from "./FileBundles.tsx"
import type { components } from "@/api/models/schema"
import type { UseFormReturn } from "react-hook-form"

interface VolumesTabProps {
  boxId: number
  form: UseFormReturn<components["schemas"]["UpdateBox"]>
}

export function VolumesTab({ boxId, form }: VolumesTabProps) {
  return (
    <div className="space-y-6">
      <AttachedVolumes boxId={boxId} />
      <FileBundles form={form} />
    </div>
  )
}