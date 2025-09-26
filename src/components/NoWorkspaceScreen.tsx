import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateWorkspaceDialog } from "@/pages/workspaces/CreateWorkspaceDialog.tsx"

export function NoWorkspaceScreen() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Auto-open the dialog when this screen is shown
  useEffect(() => {
    setCreateDialogOpen(true)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Welcome to DBoxed</h1>
          <p className="text-muted-foreground">
            You need to create a workspace to get started. Workspaces help you organize and manage your containers and infrastructure.
          </p>
        </div>

        <Button
          onClick={() => setCreateDialogOpen(true)}
          size="lg"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Your First Workspace
        </Button>
      </div>

      <CreateWorkspaceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  )
}