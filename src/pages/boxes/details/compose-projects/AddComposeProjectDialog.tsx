import { useCallback } from "react"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import { Editor } from "@monaco-editor/react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { extractComposeProjectInfo } from "./project-info.ts"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { useDboxedMutation } from "@/api/mutation.ts";
import type { components } from "@/api/models/dboxed-schema";

interface AddComposeProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  box: components["schemas"]["Box"]
  onSaved: () => void
}

interface AddProjectFormData {
  name: string
  content: string
}

const DEFAULT_COMPOSE_PROJECT = `name: my-project

services:
  # Add your services here
  # Example:
  # web:
  #   image: nginx:latest
  #   ports:
  #     - "80:80"
`

export function AddComposeProjectDialog({
  open,
  onOpenChange,
  box,
  onSaved,
}: AddComposeProjectDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  const createProjectMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/compose-projects', {
    successMessage: "Compose project created successfully!",
    errorMessage: "Failed to create compose project",
    refetchPath: "/v1/workspaces/{workspaceId}/boxes/{id}/compose-projects",
    onSuccess: () => onSaved(),
  })

  const buildInitialFormData = useCallback((): AddProjectFormData => {
    return {
      name: "",
      content: DEFAULT_COMPOSE_PROJECT
    }
  }, [])

  const handleNewProject = async (formData: AddProjectFormData) => {
    let name = formData.name.trim()

    // If no name provided, extract it from the compose YAML
    if (!name) {
      const info = extractComposeProjectInfo(formData.content, 0)
      name = info.name
    }

    return await createProjectMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: box.id
        }
      },
      body: {
        name: name,
        composeProject: formData.content,
      }
    })
  }

  return (
    <SimpleFormDialog<AddProjectFormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Compose Project"
      buildInitial={buildInitialFormData}
      onSave={handleNewProject}
      saveText="Add Project"
      wide={true}
    >
      {(form) => (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter project name (optional)"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  If left empty, the name will be extracted from the "name:" field in your compose YAML
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Docker Compose Configuration</FormLabel>
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
        </div>
      )}
    </SimpleFormDialog>
  )
}
