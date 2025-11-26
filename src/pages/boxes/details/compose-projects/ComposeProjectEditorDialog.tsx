import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Editor } from "@monaco-editor/react"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form.tsx"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import { useCallback } from "react"
import type { ComposeProjectInfo } from "@/pages/boxes/details/compose-projects/project-info.ts";
import { Button } from "@/components/ui/button.tsx";
import { Edit } from "lucide-react";
import { useDboxedQueryClient } from "@/api/dboxed-api.ts";
import { toast } from "sonner";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/dboxed-schema";

interface ComposeProjectEditorDialogProps {
  box: components["schemas"]["Box"]
  project: ComposeProjectInfo
  onSaved: () => void
}

interface EditProjectFormData {
  content: string
}

export function ComposeProjectEditorDialog({
  box,
  project,
  onSaved,
}: ComposeProjectEditorDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const updateProjectMutation = client.useMutation('patch', '/v1/workspaces/{workspaceId}/boxes/{id}/compose-projects/{composeName}')

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

    return new Promise<boolean>(resolve => {
      updateProjectMutation.mutate({
        params: {
          path: {
            workspaceId: workspaceId!,
            id: box.id,
            composeName: project.name,
          }
        },
        body: {
          composeProject: formData.content,
        }
      }, {
        onSuccess: () => {
          toast.success("Compose project updated successfully!")
          resolve(true)
          onSaved()
        },
        onError: (error) => {
          toast.error("Failed to update compose project", {
            description: error.detail || "An error occurred while updating the compose project."
          })
          resolve(false)
        }
      })
    })
  }

  return (
    <SimpleFormDialog<EditProjectFormData>
      trigger={<Button
        variant="outline"
        size="sm"
      >
        <Edit className="w-4 h-4"/>
      </Button>}
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