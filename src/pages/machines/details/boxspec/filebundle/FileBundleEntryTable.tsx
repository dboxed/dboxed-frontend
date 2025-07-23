import { type SyntheticEvent, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { SimpleInputDialog } from "@/components/SimpleInputDialog.tsx"
import { Edit, Trash } from "lucide-react"
import type { components } from "@/api/models/schema"
import { EditorDialog } from "@/components/EditorDialog.tsx";

type FileBundleEntry = components["schemas"]["FileBundleEntry"]

interface FileBundleEntryTableProps {
  entries: FileBundleEntry[]
  onUpdate: (entries: FileBundleEntry[]) => void
}

export function FileBundleEntryTable({ entries, onUpdate }: FileBundleEntryTableProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingEntry, setEditingEntry] = useState<FileBundleEntry | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const updateEntry = (index: number, field: keyof FileBundleEntry, value: string | number) => {
    const updatedEntries = [...entries]
    updatedEntries[index] = { ...updatedEntries[index], [field]: value }
    onUpdate(updatedEntries)
  }

  const addNewFile = (e: SyntheticEvent) => {
    e.preventDefault()
    setShowCreateDialog(true)
  }
  const editEntry = (index: number) => {
    setEditingEntry(entries[index])
    setShowEditDialog(true)
  }

  const handleCreateFile = (filePath: string) => {
    if (!filePath.trim()) return
    
    const newEntry: FileBundleEntry = {
      path: filePath.trim(),
      uid: 0,
      gid: 0,
      mode: 0o644,
      stringData: ""
    }
    const updatedEntries = [...entries, newEntry]
    onUpdate(updatedEntries)
  }

  const deleteEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index)
    onUpdate(updatedEntries)
  }

  const handleEditSave = (newContent: string) => {
    if (!editingEntry) return
    
    const entryIndex = entries.findIndex(e => e === editingEntry)
    if (entryIndex !== -1) {
      const updatedEntries = [...entries]
      updatedEntries[entryIndex].stringData = newContent
      onUpdate(updatedEntries)
    }
    setEditingEntry(null)
  }

  const handleEditDialogClose = (open: boolean) => {
    if (!open) {
      setEditingEntry(null)
    }
    setShowEditDialog(open)
  }

  const columns: ColumnDef<FileBundleEntry, any>[] = [
    {
      accessorKey: "path",
      header: "Path",
      cell: ({ row, table }) => {
        const rowIndex = table.getCoreRowModel().rows.indexOf(row)
        const currentValue = entries[rowIndex]?.path ?? row.getValue("path")
        
        return (
          <Input
            type="text"
            value={currentValue}
            onChange={(e) => {
              updateEntry(rowIndex, "path", e.target.value)
            }}
            className="font-mono text-sm min-w-[200px]"
            placeholder="/path/to/file"
          />
        )
      },
    },
    {
      accessorKey: "uid",
      header: "UID",
      cell: ({ row, table }) => {
        const rowIndex = table.getCoreRowModel().rows.indexOf(row)
        const currentValue = entries[rowIndex]?.uid ?? row.getValue("uid")
        
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              updateEntry(rowIndex, "uid", value)
            }}
            className="w-20 h-8"
            min={0}
          />
        )
      },
    },
    {
      accessorKey: "gid",
      header: "GID", 
      cell: ({ row, table }) => {
        const rowIndex = table.getCoreRowModel().rows.indexOf(row)
        const currentValue = entries[rowIndex]?.gid ?? row.getValue("gid")
        
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              updateEntry(rowIndex, "gid", value)
            }}
            className="w-20 h-8"
            min={0}
          />
        )
      },
    },
    {
      accessorKey: "mode",
      header: "Mode",
      cell: ({ row, table }) => {
        const rowIndex = table.getCoreRowModel().rows.indexOf(row)
        const currentValue = entries[rowIndex]?.mode ?? row.getValue("mode")
        const octalValue = currentValue.toString(8)
        
        return (
          <Input
            type="text"
            value={octalValue}
            onChange={(e) => {
              const octalInput = e.target.value.replace(/[^0-7]/g, '') // Only allow octal digits
              const decimalValue = parseInt(octalInput, 8) || 0
              updateEntry(rowIndex, "mode", decimalValue)
            }}
            className="w-24 h-8 font-mono"
            placeholder="644"
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
              size="sm"
              onClick={() => editEntry(rowIndex)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteEntry(rowIndex)}
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
        <h3 className="text-lg font-semibold">File Entries</h3>
        <Button onClick={addNewFile} type={"button"}>
          New File
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={entries}
      />
      
      <SimpleInputDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create New File"
        fieldLabel="File Path"
        placeholder="/path/to/file"
        onOk={handleCreateFile}
      />
      
      {editingEntry && (
        <EditorDialog
          title={`${editingEntry.path} content`}
          open={showEditDialog}
          onOpenChange={handleEditDialogClose}
          initialValue={editingEntry.stringData}
          onSave={handleEditSave}
        />
      )}
    </div>
  )
} 