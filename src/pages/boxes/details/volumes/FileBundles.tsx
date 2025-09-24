import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { DataTable } from "@/components/data-table.tsx"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { FileModeDialog } from "./FileModeDialog.tsx"
import { SimpleInputDialog } from "@/components/SimpleInputDialog.tsx"
import { FileBundleEditorDialog } from "./FileBundleEditorDialog.tsx"
import type { components } from "@/api/models/schema"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { deepClone } from "@/utils/clone.ts";

interface FileBundlesProps {
  box: components["schemas"]["Box"]
  saveBox: (newBox: components["schemas"]["UpdateBox"]) => Promise<boolean>
}

export function FileBundles({ box, saveBox }: FileBundlesProps) {
  const [newBundleDialogOpen, setNewBundleDialogOpen] = useState(false)
  
  const volumes = box.boxSpec.volumes || []
  const fileBundleVolumes = volumes.filter(volume => volume.fileBundle != null)

  const getVolumeIndex = (volume: components["schemas"]["BoxVolumeSpec"]) => {
    return volumes.findIndex(v => v === volume)
  }

  const handleNewBundle = (name: string) => {
    const newVolume: components["schemas"]["BoxVolumeSpec"] = {
      name,
      rootUid: 0,
      rootGid: 0,
      rootMode: "0755",
      fileBundle: {
        files: []
      }
    }

    const newBoxSpec = deepClone(box.boxSpec)
    if (!newBoxSpec.volumes) {
      newBoxSpec.volumes = []
    }
    newBoxSpec.volumes.push(newVolume)
    saveBox({
      boxSpec: newBoxSpec,
    })
  }

  const handleDeleteBundle = (volumeIndex: number) => {
    const newBoxSpec = deepClone(box.boxSpec)
    newBoxSpec.volumes = newBoxSpec.volumes?.filter((_, index) => index !== volumeIndex)
    saveBox({
      boxSpec: newBoxSpec,
    })
  }

  const handleSaveBundle = (volumeIndex: number, updatedVolume: components["schemas"]["BoxVolumeSpec"]) => {
    const newBoxSpec = deepClone(box.boxSpec)
    newBoxSpec.volumes![volumeIndex] = updatedVolume
    return saveBox({
      boxSpec: newBoxSpec,
    })
  }

  const columns: ColumnDef<components["schemas"]["BoxVolumeSpec"]>[] = [
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
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <FileBundleEditorDialog
                    volume={row.original}
                    saveFileBundle={(updatedVolume) => handleSaveBundle(getVolumeIndex(row.original), updatedVolume)}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit files</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <FileModeDialog
                    uid={row.original.rootUid || 0}
                    gid={row.original.rootGid || 0}
                    mode={row.original.rootMode || "0755"}
                    onUpdate={(uid, gid, mode) => {
                      const volumeIndex = getVolumeIndex(row.original)
                      const newBoxSpec = deepClone(box.boxSpec)
                      newBoxSpec.volumes![volumeIndex].rootUid = uid
                      newBoxSpec.volumes![volumeIndex].rootGid = gid
                      newBoxSpec.volumes![volumeIndex].rootMode = mode
                      saveBox({
                        boxSpec: newBoxSpec,
                      })
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit permissions</p>
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
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    }
                    title="Delete File Bundle"
                    description={`Are you sure you want to delete the file bundle "${row.original.name}"? This will remove all files in the bundle.`}
                    confirmText="Delete"
                    onConfirm={() => handleDeleteBundle(getVolumeIndex(row.original))}
                    destructive
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete bundle</p>
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
            data={fileBundleVolumes}
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