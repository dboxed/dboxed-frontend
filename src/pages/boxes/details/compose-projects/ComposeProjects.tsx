import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { AddComposeProjectDialog } from "./AddComposeProjectDialog.tsx"
import { ComposeProjectEditorDialog } from "./ComposeProjectEditorDialog.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import { useDboxedMutation } from "@/api/mutation.ts"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"
import type { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import {
  type ComposeProjectInfo,
  extractComposeProjectInfo
} from "@/pages/boxes/details/compose-projects/project-info.ts";

interface ComposeProjectsProps {
  box: components["schemas"]["Box"]
}

export function ComposeProjects({ box }: ComposeProjectsProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const allowEditing = box.boxType === "normal"

  // Fetch compose projects from the API
  const composeProjectsQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes/{id}/compose-projects', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: box.id
      }
    }
  })

  const deleteProjectMutation = useDboxedMutation('delete', '/v1/workspaces/{workspaceId}/boxes/{id}/compose-projects/{composeName}', {
    successMessage: "Compose project deleted successfully!",
    errorMessage: "Failed to delete compose project",
    refetchPath: "/v1/workspaces/{workspaceId}/boxes/{id}/compose-projects",
  })

  const composeProjects = composeProjectsQuery.data?.items || []

  // Transform the compose projects into objects for the data table
  const projectItems: ComposeProjectInfo[] = composeProjects.map((project) => {
    return extractComposeProjectInfo(project.composeProject, 0, project.name)
  })

  const handleDeleteProject = async (projectName: string) => {
    return await deleteProjectMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: box.id,
          composeName: projectName
        }
      }
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
                <ComposeProjectEditorDialog
                  box={box}
                  project={row.original}
                  onSaved={() => composeProjectsQuery.refetch()}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit project</p>
              </TooltipContent>
            </Tooltip>
            {allowEditing && <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <ConfirmationDialog
                            trigger={
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4"/>
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
            </Tooltip>}
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
            {allowEditing && <AddComposeProjectDialog
                box={box}
                onSaved={() => composeProjectsQuery.refetch()}
            />}
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
    </>
  )
}