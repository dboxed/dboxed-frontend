import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { SimpleInputDialog } from "@/components/SimpleInputDialog.tsx"
import { FileBundleDialog } from "./FileBundleDialog.tsx"
import type { components } from "@/api/models/schema"
import { Edit, Trash } from "lucide-react";

type FileBundle = components["schemas"]["FileBundle"]

interface FileBundlesTableProps {
  bundles: FileBundle[]
  onChange: (bundles: FileBundle[]) => void
}

export function FileBundlesTable({ bundles, onChange }: FileBundlesTableProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingBundle, setEditingBundle] = useState<FileBundle | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleCreateBundle = (bundleName: string) => {
    if (!bundleName.trim()) return
    
    const newBundle: FileBundle = {
      name: bundleName.trim(),
      files: [],
      rootUid: 0,
      rootGid: 0,
      rootMode: 0o755
    }
    const updatedBundles = [...bundles, newBundle]
    onChange(updatedBundles)
  }

  const updateBundle = (index: number, field: keyof FileBundle, value: string | number) => {
    const updatedBundles = [...bundles]
    updatedBundles[index] = { ...updatedBundles[index], [field]: value }
    onChange(updatedBundles)
  }

  const deleteBundle = (index: number) => {
    const updatedBundles = bundles.filter((_, i) => i !== index)
    onChange(updatedBundles)
  }

  const addNewBundle = () => {
    setShowCreateDialog(true)
  }

  const editBundle = (index: number) => {
    setEditingBundle(bundles[index])
    setShowEditDialog(true)
  }

  const handleEditSave = (newBundle: FileBundle) => {
    console.log(newBundle)
    if (!editingBundle) return

    const bundleIndex = bundles.findIndex(b => b.name === editingBundle.name)
    if (bundleIndex !== -1) {
      const updatedBundles = [...bundles]
      updatedBundles[bundleIndex] = newBundle
      onChange(updatedBundles)
    }
    setEditingBundle(null)
  }

  const handleEditDialogClose = (open: boolean) => {
    if (!open) {
      setEditingBundle(null)
    }
    setShowEditDialog(open)
  }

  const columns: ColumnDef<FileBundle, any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row, table }) => {
        const rowIndex = table.getCoreRowModel().rows.indexOf(row)
        const currentValue = bundles[rowIndex]?.name ?? row.getValue("name")
        
        return (
          <Input
            type="text"
            value={currentValue}
            onChange={(e) => {
              updateBundle(rowIndex, "name", e.target.value)
            }}
            className="font-medium min-w-[100px]"
            placeholder="Bundle name"
          />
        )
      },
    },
    {
      accessorKey: "files",
      header: "Files",
      cell: ({ row }) => {
        const files = row.getValue("files") as FileBundle["files"]
        const fileCount = files?.length || 0
        
        return (<>
            <Badge variant="secondary" className="font-mono">
              {fileCount}
            </Badge>
          </>
        )
      },
    },
    {
      accessorKey: "rootUid",
      header: "Root UID",
      cell: ({ row, table }) => {
        const rowIndex = table.getCoreRowModel().rows.indexOf(row)
        const currentValue = bundles[rowIndex]?.rootUid ?? row.getValue("rootUid")
        
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              updateBundle(rowIndex, "rootUid", value)
            }}
            className="w-20 h-8"
            min={0}
          />
        )
      },
    },
    {
      accessorKey: "rootGid", 
      header: "Root GID",
      cell: ({ row, table }) => {
        const rowIndex = table.getCoreRowModel().rows.indexOf(row)
        const currentValue = bundles[rowIndex]?.rootGid ?? row.getValue("rootGid")
        
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              updateBundle(rowIndex, "rootGid", value)
            }}
            className="w-20 h-8"
            min={0}
          />
        )
      },
    },
    {
      accessorKey: "rootMode",
      header: "Root Mode",
      cell: ({ row, table }) => {
        const rowIndex = table.getCoreRowModel().rows.indexOf(row)
        const currentValue = bundles[rowIndex]?.rootMode ?? row.getValue("rootMode")
        const octalValue = currentValue.toString(8)
        
        return (
          <Input
            type="text"
            value={octalValue}
            onChange={(e) => {
              const octalInput = e.target.value.replace(/[^0-7]/g, '') // Only allow octal digits
              const decimalValue = parseInt(octalInput, 8) || 0
              updateBundle(rowIndex, "rootMode", decimalValue)
            }}
            className="w-24 h-8 font-mono"
            placeholder="755"
          />
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ table, row }) => {
        const rowIndex = table.getCoreRowModel().rows.indexOf(row)
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              type={"button"}
              size="sm"
              onClick={() => editBundle(rowIndex)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="outline"
              type={"button"}
              size="sm"
              onClick={() => deleteBundle(rowIndex)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash size={16} />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">File Bundles</h3>
        <Button onClick={addNewBundle} type="button">
          New Bundle
        </Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={bundles}
        searchColumn="name"
        searchPlaceholder="Filter by bundle name..."
      />
      
      <SimpleInputDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New Bundle"
        fieldLabel="Bundle Name"
        placeholder="Enter bundle name..."
        onOk={handleCreateBundle}
      />
      
      {editingBundle && (
        <FileBundleDialog
          open={showEditDialog}
          onOpenChange={handleEditDialogClose}
          bundle={editingBundle}
          onSave={handleEditSave}
        />
      )}
    </div>
  )
} 