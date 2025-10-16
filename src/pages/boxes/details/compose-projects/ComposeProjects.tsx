import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { CreateComposeProjectDialog } from "./CreateComposeProjectDialog.tsx"
import { ComposeProjectEditorDialog } from "./ComposeProjectEditorDialog.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Trash2, Edit } from "lucide-react"
import { useState } from "react"
import {
  type ComposeProjectInfo,
  extractComposeProjectInfo
} from "@/pages/boxes/details/compose-projects/project-info.ts";
import { toast } from "sonner"

interface ComposeProjectsProps {
  box: components["schemas"]["Box"]
}

export function ComposeProjects({ box }: ComposeProjectsProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ComposeProjectInfo | null>(null)

  // Fetch compose projects from the API
  const composeProjectsQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes/{id}/compose-projects', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: box.id
      }
    }
  })

  const createProjectMutation = client.useMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/compose-projects', {
    onSuccess: () => {
      composeProjectsQuery.refetch()
    }
  })

  const updateProjectMutation = client.useMutation('patch', '/v1/workspaces/{workspaceId}/boxes/{id}/compose-projects/{composeName}', {
    onSuccess: () => {
      composeProjectsQuery.refetch()
    }
  })

  const deleteProjectMutation = client.useMutation('delete', '/v1/workspaces/{workspaceId}/boxes/{id}/compose-projects/{composeName}', {
    onSuccess: () => {
      composeProjectsQuery.refetch()
    }
  })

  const composeProjects = composeProjectsQuery.data?.items || []

  // Transform the compose projects into objects for the data table
  const projectItems: ComposeProjectInfo[] = composeProjects.map((project) => {
    return extractComposeProjectInfo(project.composeProject, 0, project.name)
  })

  const handleNewProject = (name: string, content: string) => {
    return new Promise<boolean>((resolve) => {
      createProjectMutation.mutate({
        params: {
          path: {
            workspaceId: workspaceId!,
            id: box.id
          }
        },
        body: {
          name: name,
          composeProject: content
        }
      }, {
        onSuccess: () => {
          toast.success("Compose project created successfully!")
          resolve(true)
        },
        onError: (error) => {
          toast.error("Failed to create compose project", {
            description: error.detail || "An error occurred while creating the compose project."
          })
          resolve(false)
        }
      })
    })
  }

  const handleDeleteProject = (projectName: string) => {
    deleteProjectMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: box.id,
          composeName: projectName
        }
      }
    }, {
      onSuccess: () => {
        toast.success("Compose project deleted successfully!")
      },
      onError: (error) => {
        toast.error("Failed to delete compose project", {
          description: error.detail || "An error occurred while deleting the compose project."
        })
      }
    })
  }

  const handleUpdateProject = (projectName: string, updatedContent: string) => {
    return new Promise<boolean>((resolve) => {
      updateProjectMutation.mutate({
        params: {
          path: {
            workspaceId: workspaceId!,
            id: box.id,
            composeName: projectName
          }
        },
        body: {
          composeProject: updatedContent
        }
      }, {
        onSuccess: () => {
          toast.success("Compose project updated successfully!")
          resolve(true)
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

  const columns: ColumnDef<ComposeProjectInfo>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <code className="text-sm bg-muted px-1 py-0.5 rounded">
            {row.original.name}
          </code>
        )
      }
    },
    {
      accessorKey: "serviceCount",
      header: "Services",
      cell: ({ row }) => {
        return (
          <span className="text-sm text-muted-foreground">
            {row.original.serviceCount}
          </span>
        )
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProject(row.original)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit project</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ConfirmationDialog
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    }
                    title="Delete Compose Project"
                    description={`Are you sure you want to delete "${row.original.name}"? This will remove all services in this project.`}
                    confirmText="Delete"
                    onConfirm={() => handleDeleteProject(row.original.name)}
                    destructive
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete project</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )
      }
    }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compose Projects</CardTitle>
              <CardDescription>
                Docker Compose projects for this box
              </CardDescription>
            </div>
            <Button
              type={"button"}
              variant="outline"
              size="sm"
              onClick={() => setNewProjectDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={projectItems}
            searchColumn="name"
            searchPlaceholder="Search projects..."
          />
        </CardContent>
      </Card>

      <CreateComposeProjectDialog
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
        onSave={handleNewProject}
        isLoading={createProjectMutation.isPending}
      />

      {editingProject && (
        <ComposeProjectEditorDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setEditingProject(null)
            }
          }}
          project={editingProject}
          onUpdateProject={(updatedContent) => handleUpdateProject(editingProject.name, updatedContent)}
        />
      )}
    </>
  )
}