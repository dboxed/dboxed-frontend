import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { EditorDialog } from "@/components/EditorDialog.tsx"
import { FileText } from "lucide-react"
import { toast } from "sonner"
import { parse as parseYaml, stringify as stringifyYaml } from "yaml"
import type { components } from "@/api/models/schema"

interface BoxSpecYamlEditorDialogProps {
  box: components["schemas"]["Box"]
  saveBox: (newBox: components["schemas"]["UpdateBox"]) => Promise<boolean>
}

export function BoxSpecYamlEditorDialog({ box, saveBox }: BoxSpecYamlEditorDialogProps) {
  const [open, setOpen] = useState(false)
  const [initialYaml, setBoxSpecYaml] = useState("")

  useEffect(() => {
    setBoxSpecYaml(stringifyYaml(box.boxSpec))
  }, [box.boxSpec]);

  const handleEdit = () => {
    setOpen(true)
  }

  const handleSave = async (yamlContent: string) => {
    try {
      // Parse the YAML content
      const parsedData = parseYaml(yamlContent)
      
      if (!parsedData || typeof parsedData !== 'object') {
        toast.error("Invalid YAML: Expected an object")
        return false
      }

      if (await saveBox({
        boxSpec: parsedData,
      })) {
        setOpen(false)
      }
    } catch (error) {
      console.error("Error parsing YAML:", error)
      toast.error("Invalid YAML syntax", {
        description: error instanceof Error ? error.message : "Please check your YAML formatting"
      })
    }
  }

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
        initialValue={initialYaml}
        onSave={handleSave}
        language="yaml"
      />
    </>
  )
}
