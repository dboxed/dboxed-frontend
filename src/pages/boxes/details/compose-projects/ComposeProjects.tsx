import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { SimpleInputDialog } from "@/components/SimpleInputDialog.tsx"
import { ComposeProjectEditorDialog } from "./ComposeProjectEditorDialog.tsx"
import type { components } from "@/api/models/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import {
  type ComposeProjectInfo,
  extractComposeProjectInfo
} from "@/pages/boxes/details/compose-projects/project-info.ts";
import { deepClone } from "@/utils/clone.ts";

interface ComposeProjectsProps {
  box: components["schemas"]["Box"]
  saveBox: (data: components["schemas"]["UpdateBox"]) => Promise<boolean>
}

export function ComposeProjects({ box, saveBox }: ComposeProjectsProps) {
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false)
  
  const composeProjects = box.box_spec.composeProjects || []

  // Transform the string array into objects for the data table
  const projectItems: ComposeProjectInfo[] = composeProjects.map((project, index) => {
    return extractComposeProjectInfo(project, index)
  })

  const handleNewProject = (name: string) => {
    const newProject = `name: ${name}
services:
  # Add your services here
`
    const newBoxSpec = deepClone(box.box_spec)
    if (!newBoxSpec.composeProjects) {
      newBoxSpec.composeProjects = []
    }
    newBoxSpec.composeProjects.push(newProject)
    saveBox({
      boxSpec: newBoxSpec,
    })
  }

  const handleDeleteProject = (projectIndex: number) => {
    const newBoxSpec = deepClone(box.box_spec)
    newBoxSpec.composeProjects = newBoxSpec.composeProjects?.filter((_, index) => index !== projectIndex)
    saveBox({
      boxSpec: newBoxSpec,
    })
  }

  const handleUpdateProject = (projectIndex: number, updatedContent: string) => {
    const newBoxSpec = deepClone(box.box_spec)
    newBoxSpec.composeProjects![projectIndex] = updatedContent
    saveBox({
      boxSpec: newBoxSpec,
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
                <div>
                  <ComposeProjectEditorDialog
                    project={row.original}
                    onUpdateProject={(updatedContent) => handleUpdateProject(row.original.index, updatedContent)}
                  />
                </div>
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
                    onConfirm={() => handleDeleteProject(row.original.index)}
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

      <SimpleInputDialog
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
        title="Create New Compose Project"
        fieldLabel="Project Name"
        placeholder="Enter a name for the compose project..."
        onOk={handleNewProject}
      />
    </>
  )
}