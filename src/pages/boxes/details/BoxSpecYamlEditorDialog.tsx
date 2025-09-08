import { useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { EditorDialog } from "@/components/EditorDialog.tsx"
import { FileText } from "lucide-react"
import { toast } from "sonner"
import { parse as parseYaml, stringify as stringifyYaml } from "yaml"
import type { components } from "@/api/models/schema"
import type { UseFormReturn } from "react-hook-form"

interface BoxSpecYamlEditorDialogProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>
}

export function BoxSpecYamlEditorDialog({ form }: BoxSpecYamlEditorDialogProps) {
  const [open, setOpen] = useState(false)

  const handleEdit = () => {
    setOpen(true)
  }

  const handleSave = (yamlContent: string): boolean => {
    try {
      // Parse the YAML content
      const parsedData = parseYaml(yamlContent)
      
      if (!parsedData || typeof parsedData !== 'object') {
        toast.error("Invalid YAML: Expected an object")
        return false
      }

      // Update the form with the parsed box spec
      form.setValue("boxSpec", parsedData as components["schemas"]["BoxSpec"])
      
      toast.success("Box spec updated from YAML")
      return true
    } catch (error) {
      console.error("Error parsing YAML:", error)
      toast.error("Invalid YAML syntax", {
        description: error instanceof Error ? error.message : "Please check your YAML formatting"
      })
      return false
    }
  }

  // Get current box spec and convert to YAML
  const currentBoxSpec = form.getValues("boxSpec")
  const currentYaml = currentBoxSpec ? stringifyYaml(currentBoxSpec) : ""

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleEdit}
      >
        <FileText className="w-4 h-4 mr-2" />
        Edit as YAML
      </Button>

      <EditorDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit Box Spec as YAML"
        initialValue={currentYaml}
        onSave={handleSave}
        language="yaml"
      />
    </>
  )
}