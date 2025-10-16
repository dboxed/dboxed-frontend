import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Editor } from "@monaco-editor/react"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form.tsx"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import { useCallback } from "react"
import type { ComposeProjectInfo } from "@/pages/boxes/details/compose-projects/project-info.ts";

interface ComposeProjectEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ComposeProjectInfo
  onUpdateProject: (newContent: string) => Promise<boolean>
}

interface EditProjectFormData {
  content: string
}

export function ComposeProjectEditorDialog({
  open,
  onOpenChange,
  project,
  onUpdateProject
}: ComposeProjectEditorDialogProps) {
  const buildInitialFormData = useCallback((): EditProjectFormData => {
    return {
      content: project.content
    }
  }, [project.content])

  const handleSave = async (formData: EditProjectFormData) => {
    // Only save if content has changed
    if (formData.content === project.content) {
      return true
    }
    return await onUpdateProject(formData.content)
  }

  return (
    <SimpleFormDialog<EditProjectFormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Compose Project"
      buildInitial={buildInitialFormData}
      onSave={handleSave}
      saveText="Save Changes"
      wide={true}
    >
      {(form) => (
        <div className="flex-1 min-h-0">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="border rounded-md h-[400px]">
                        <Editor
                          language="yaml"
                          value={field.value}
                          onChange={(value) => field.onChange(value || "")}
                          options={{
                            minimap: { enabled: false },
                            lineNumbers: "on",
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                            insertSpaces: true,
                            wordWrap: "on"
                          }}
                          theme="vs-dark"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </SimpleFormDialog>
  )
}