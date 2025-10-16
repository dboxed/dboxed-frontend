import { useCallback } from "react"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import { Editor } from "@monaco-editor/react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"

interface CreateComposeProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string, content: string) => Promise<boolean>
  isLoading?: boolean
}

interface CreateProjectFormData {
  name: string
  content: string
}

const DEFAULT_COMPOSE_PROJECT = `services:
  # Add your services here
  # Example:
  # web:
  #   image: nginx:latest
  #   ports:
  #     - "80:80"
`

export function CreateComposeProjectDialog({
  open,
  onOpenChange,
  onSave,
  isLoading = false
}: CreateComposeProjectDialogProps) {
  const buildInitialFormData = useCallback((): CreateProjectFormData => {
    return {
      name: "",
      content: DEFAULT_COMPOSE_PROJECT
    }
  }, [])

  const handleSave = async (formData: CreateProjectFormData) => {
    return await onSave(formData.name, formData.content)
  }

  return (
    <SimpleFormDialog<CreateProjectFormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Compose Project"
      buildInitial={buildInitialFormData}
      onSave={handleSave}
      saveText="Create Project"
      isLoading={isLoading}
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
                    placeholder="Enter project name"
                    {...field}
                  />
                </FormControl>
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
