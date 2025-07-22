import { Card, CardContent } from "@/components/ui/card.tsx"
import { type UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"
import { FileBundlesTable } from "@/pages/machines/details";

interface FileBundlesEditorProps {
  form: UseFormReturn<components["schemas"]["UpdateMachine"]>
}

type FileBundle = components["schemas"]["FileBundle"]

export function FileBundlesTab({ form }: FileBundlesEditorProps) {
  const fileBundles = form.watch("boxSpec.fileBundles") || []

  const handleSaveBundles = (newBundles: FileBundle[]) => {
    form.setValue("boxSpec.fileBundles", newBundles)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <FileBundlesTable bundles={fileBundles} onChange={handleSaveBundles}/>
        </CardContent>
      </Card>
    </div>
  )
} 