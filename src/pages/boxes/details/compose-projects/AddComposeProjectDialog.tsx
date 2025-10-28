import { useCallback } from "react"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import { Editor } from "@monaco-editor/react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { extractComposeProjectInfo } from "./project-info.ts"

interface AddComposeProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string, content: string) => Promise<boolean>
  isLoading?: boolean
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
  onSave,
  isLoading = false
}: AddComposeProjectDialogProps) {
  const buildInitialFormData = useCallback((): AddProjectFormData => {
    return {
      name: "",
      content: DEFAULT_COMPOSE_PROJECT
    }
  }, [])

  const handleSave = async (formData: AddProjectFormData) => {
    let name = formData.name.trim()

    // If no name provided, extract it from the compose YAML
    if (!name) {
      const info = extractComposeProjectInfo(formData.content, 0)
      name = info.name
    }

    return await onSave(name, formData.content)
  }

  return (
    <SimpleFormDialog<AddProjectFormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Compose Project"
      buildInitial={buildInitialFormData}
      onSave={handleSave}
      saveText="Add Project"
      isLoading={isLoading}
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
