import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { EditVolumeRootDialog } from "./EditVolumeRootDialog.tsx"
import { SimpleInputDialog } from "@/components/SimpleInputDialog.tsx"
import type { components } from "@/api/models/schema"
import type { UseFormReturn } from "react-hook-form"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface FileBundlesProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>
}

export function FileBundles({ form }: FileBundlesProps) {
  const [newBundleDialogOpen, setNewBundleDialogOpen] = useState(false)
  
  const volumes = form.watch("boxSpec.volumes") || []
  const fileBundleVolumes = volumes.filter(volume => volume.fileBundle != null)

  const handleNewBundle = (name: string) => {
    const currentVolumes = form.getValues("boxSpec.volumes") || []
    const newVolume: components["schemas"]["BoxVolumeSpec"] = {
      name,
      rootUid: 0,
      rootGid: 0,
      rootMode: "0755",
      fileBundle: {
        files: []
      }
    }
    
    form.setValue("boxSpec.volumes", [...currentVolumes, newVolume])
  }

  const handleDeleteBundle = (volumeIndex: number) => {
    const currentVolumes = form.getValues("boxSpec.volumes") || []
    const updatedVolumes = currentVolumes.filter((_, index) => index !== volumeIndex)
    form.setValue("boxSpec.volumes", updatedVolumes)
  }

  const columns: ColumnDef<components["schemas"]["BoxVolumeSpec"] & { _index: number }>[] = [
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
      accessorKey: "rootUid",
      header: "Root UID",
      cell: ({ row }) => {
        return row.original.rootUid
      }
    },
    {
      accessorKey: "rootGid",
      header: "Root GID", 
      cell: ({ row }) => {
        return row.original.rootGid
      }
    },
    {
      accessorKey: "rootMode",
      header: "Root Mode",
      cell: ({ row }) => {
        return (
          <code className="text-sm bg-muted px-1 py-0.5 rounded">
            {row.original.rootMode}
          </code>
        )
      }
    },
    {
      accessorKey: "fileBundle.files",
      header: "Files",
      cell: ({ row }) => {
        const filesCount = row.original.fileBundle?.files?.length || 0
        return (
          <span className="text-sm text-muted-foreground">
            {filesCount} file{filesCount !== 1 ? 's' : ''}
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
            <EditVolumeRootDialog
              volume={row.original}
              onUpdate={(updatedVolume) => {
                const currentVolumes = form.getValues("boxSpec.volumes") || []
                const updatedVolumes = [...currentVolumes]

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _index, ...cleanUpdatedVolume } = updatedVolume as typeof updatedVolume & { _index: number }
                updatedVolumes[row.original._index] = cleanUpdatedVolume
                form.setValue("boxSpec.volumes", updatedVolumes)
              }}
            />
            <ConfirmationDialog
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              }
              title="Delete File Bundle"
              description={`Are you sure you want to delete the file bundle "${row.original.name}"? This will remove all files in the bundle.`}
              confirmText="Delete"
              onConfirm={() => handleDeleteBundle(row.original._index)}
              destructive
            />
          </div>
        )
      }
    }
  ]

  // Add index to each volume for deletion tracking
  const volumesWithIndex = fileBundleVolumes.map((volume) => {
    const originalIndex = volumes.findIndex(v => v === volume)
    return { ...volume, _index: originalIndex }
  })

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>File Bundles</CardTitle>
              <CardDescription>
                Volumes that contain file bundles for this box
              </CardDescription>
            </div>
            <Button
              type={"button"}
              variant="outline"
              size="sm"
              onClick={() => setNewBundleDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Bundle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={volumesWithIndex}
            searchColumn="name"
            searchPlaceholder="Search file bundles..."
          />
        </CardContent>
      </Card>

      <SimpleInputDialog
        open={newBundleDialogOpen}
        onOpenChange={setNewBundleDialogOpen}
        title="Create New File Bundle"
        fieldLabel="Bundle Name"
        placeholder="Enter a name for the file bundle..."
        onOk={handleNewBundle}
      />
    </>
  )
}