import { type TreeDataItem, TreeView } from "@/components/tree-view.tsx"
import { SimpleInputDialog } from "@/components/SimpleInputDialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { File, FilePlus, Folder, FolderPlus, Trash2 } from "lucide-react"
import { type ReactNode, useMemo, useState } from "react"
import { MemoryFileSystem, type FileStats } from "@/utils/memory-fs.ts"
import { textModeMarker } from "@/pages/boxes/details/volumes/memory-fs-utils.ts"

interface MemfsEditorProps {
  volume: MemoryFileSystem
  className?: string
  onFileSelect?: (path: string) => void
}

export function MemfsEditor({ volume, className, onFileSelect }: MemfsEditorProps) {
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false)
  const [newDirectoryDialogOpen, setNewDirectoryDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TreeDataItemWithStat | null>(null)

  const [refreshCounter, setRefreshCounter] = useState(1)

  const handleChange = () => {
    setRefreshCounter(n => n + 1)
  }

  const treeData = useMemo(() => {
    if (refreshCounter === 0) {
      // just to turn off warnings
    }
    const {root, flat} = buildTreeData(volume)
    flat.forEach(item => {
      const actions: ReactNode[] = []
      if (item.stat.type === 'dir') {
        actions.push(<Button
            type={"button"}
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedItem(item)
              setNewFileDialogOpen(true)
            }}
            className="h-6 w-6 p-0"
            title="New File"
          >
            <FilePlus className="h-3 w-3"/>
          </Button>
        )
        actions.push(<Button
          type={"button"}
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedItem(item)
            setNewDirectoryDialogOpen(true)
          }}
          className="h-6 w-6 p-0"
          title="New Directory"
        >
          <FolderPlus className="h-3 w-3"/>
        </Button>
        )
      }
      if (item.id !== "/") {
        actions.push(
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedItem(item)
              setDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="h-3 w-3"/>
          </Button>
        )
      }
      item.actions = actions
    })
    return root
  }, [volume, refreshCounter])

  const handleAddFile = (name: string) => {
    if (!selectedItem) {
      return
    }
    const path = selectedItem.id + "/" + name
    try {
      if (volume.exists(path)) {
        console.warn(`File ${path} already exists`)
        return
      }
      volume.writeFile(path, '', { mode: 0o644 | textModeMarker })
      handleChange()
    } catch (error) {
      console.error('Failed to create file:', error)
    }
  }
  const handleAddDirectory = (name: string) => {
    if (!selectedItem) {
      return
    }
    const path = selectedItem.id + "/" + name
    try {
      if (volume.exists(path)) {
        console.warn(`File ${path} already exists`)
        return
      }
      volume.mkdir(path, {mode: 0o700})
      handleChange()
    } catch (error) {
      console.error('Failed to create file:', error)
    }
  }

  const handleDelete = () => {
    if (!selectedItem) {
      return
    }
    try {
      const stat = volume.stat(selectedItem.id)
      if (stat && stat.type === 'dir') {
        volume.rmdir(selectedItem.id, { recursive: true })
      } else {
        volume.unlink(selectedItem.id)
      }
      handleChange()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  return (
    <div className={className}>
      <TreeView
        data={treeData}
        defaultNodeIcon={Folder}
        defaultLeafIcon={File}
        expandAll={false}
        initialSelectedItemId="/"
        onSelectChange={(item) => {
          const typedItem = item as TreeDataItemWithStat
          setSelectedItem(typedItem)
          if (typedItem) {
            onFileSelect?.(typedItem.id)
          }
        }}
        className="min-h-[300px]"
      />
      
      <SimpleInputDialog
        open={newFileDialogOpen}
        onOpenChange={setNewFileDialogOpen}
        title="New File"
        fieldLabel="File Name"
        placeholder="Enter filename..."
        onOk={handleAddFile}
      />

      <SimpleInputDialog
        open={newDirectoryDialogOpen}
        onOpenChange={setNewDirectoryDialogOpen}
        title="New Directory"
        fieldLabel="Directory Name"
        placeholder="Enter directory name..."
        onOk={handleAddDirectory}
      />

      {selectedItem && <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Item"
        description={`Are you sure you want to delete "${selectedItem.id}"? This action cannot be undone.${
          selectedItem.stat.type === 'dir' ? " All contents will be permanently deleted." : ""
        }`}
        confirmText="Delete"
        destructive={true}
        onConfirm={handleDelete}
      />}
    </div>
  )
}

type TreeDataItemWithStat = TreeDataItem & {stat: FileStats}

const buildTreeData = (volume: MemoryFileSystem) => {
  const flat: TreeDataItemWithStat[] = []
  const buildTreeDataItem = (path: string): TreeDataItemWithStat | null => {
    const st = volume.stat(path)
    if (!st) return null
    
    const pathParts = path.split('/').filter(p => p)
    const name = pathParts.length === 0 ? "/" : pathParts[pathParts.length - 1]
    
    const item: TreeDataItemWithStat = {
      stat: st,
      id: path,
      name: name,
      icon: st.type === 'dir' ? Folder : File
    }

    if (st.type === 'dir') {
      item.children = []
      const dirEntries = volume.readdir(path)
      if (dirEntries) {
        dirEntries.forEach((dirEntry) => {
          let newPath = path
          if (!newPath.endsWith("/")) {
            newPath += "/"
          }
          newPath += dirEntry.name
          const newItem = buildTreeDataItem(newPath)
          if (newItem) {
            item.children!.push(newItem)
          }
        })
      }
    }

    flat.push(item)
    return item
  }

  const root = buildTreeDataItem("/")
  return {
    root: root,
    flat: flat,
  }
}
