import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Editor } from "@monaco-editor/react"
import { type UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"
import { DeleteButton } from "@/components/DeleteButton.tsx"

interface ComposeProjectEditorProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>,
  projectIndex: number,
  onDeleteProject: (index: number) => void,
  projectName: string
}

export function ComposeProjectEditor({
                                       form,
                                       projectIndex,
                                       onDeleteProject,
                                       projectName
                                     }: ComposeProjectEditorProps) {
  const project = form.watch(`boxSpec.composeProjects.${projectIndex}`)

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      form.setValue(`boxSpec.composeProjects.${projectIndex}`, value)
    }
  }

  const handleDeleteProject = () => {
    onDeleteProject(projectIndex)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Compose Project: {projectName}</CardTitle>
          <DeleteButton
            onDelete={handleDeleteProject}
            confirmationTitle="Delete Compose Project"
            confirmationDescription={`Are you sure you want to delete the compose project "${projectName}"? This action cannot be undone and will remove all services in this project.`}
            buttonText=""
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 h-8 w-8"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 border rounded-md m-4 mt-0">
          <Editor
            language="yaml"
            value={project}
            onChange={handleContentChange}
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
      </CardContent>
    </Card>
  )
}