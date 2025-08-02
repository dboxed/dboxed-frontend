import { useState, useEffect } from "react"
import { File, Plus } from "lucide-react"
import { type UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"
import { BundleConfigSection } from "./BundleConfigSection.tsx"
import { FileContentEditor } from "./FileContentEditor.tsx"
import { MenuItem } from "./MenuItem.tsx"
import { Menu } from "./Menu.tsx"
import { MenuSection } from "./MenuSection.tsx"
import { ScrollableMenuList } from "./ScrollableMenuList.tsx"
import { DeleteButton } from "@/components/DeleteButton.tsx"

interface BundleSectionProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>,
  bundleIndex: number,
  onDeleteBundle: (index: number) => void
}

type FileBundleEntry = components["schemas"]["FileBundleEntry"]

export function BundleSection({ form, bundleIndex, onDeleteBundle }: BundleSectionProps) {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)

  const bundle = form.watch(`boxSpec.fileBundles.${bundleIndex}`)

  // Reset to config section when bundle changes
  useEffect(() => {
    setSelectedFileIndex(null)
  }, [bundleIndex])

  if (!bundle) {
    return (
      <div className="flex gap-6 h-full min-h-[500px]">
        <Menu>
          <MenuSection>
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Bundle not found
            </div>
          </MenuSection>
        </Menu>
        <div className="flex-1"></div>
      </div>
    )
  }

  const handleConfigClick = () => {
    setSelectedFileIndex(null)
  }

  const handleFileClick = (fileIndex: number) => {
    setSelectedFileIndex(fileIndex)
  }

  const handleAddFile = () => {
    const newFile: FileBundleEntry = {
      path: `/new-file-${(bundle.files?.length || 0) + 1}.txt`,
      stringData: "",
      mode: "0644",
      uid: 0,
      gid: 0,
    }

    const updatedFiles = [...(bundle.files || [])]
    updatedFiles.push(newFile)
    form.setValue(`boxSpec.fileBundles.${bundleIndex}.files`, updatedFiles)

    // Navigate to the newly created file
    const newFileIndex = updatedFiles.length - 1
    setSelectedFileIndex(newFileIndex)
  }

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...(bundle.files || [])]
    updatedFiles.splice(index, 1)

    form.setValue(`boxSpec.fileBundles.${bundleIndex}.files`, updatedFiles)

    if (updatedFiles.length === 0) {
      setSelectedFileIndex(null)
    } else if (index >= updatedFiles.length) {
      setSelectedFileIndex(updatedFiles.length - 1)
    }
  }

  const renderContent = () => {
    if (selectedFileIndex !== null) {
      return <FileContentEditor form={form} bundleIndex={bundleIndex} fileIndex={selectedFileIndex}
                                onDeleteFile={handleDeleteFile}/>
    } else {
      return <BundleConfigSection form={form} bundleIndex={bundleIndex} />
    }
  }

  return (
    <div className="flex gap-6 h-full min-h-[500px]">
      {/* Left Sidebar Menu */}
      <Menu>
        <MenuSection>
          <div className="flex items-center justify-between gap-2">
            <MenuItem
              onClick={handleConfigClick}
              isActive={selectedFileIndex === null}
              className="flex-1"
            >
              Bundle Config
            </MenuItem>
            <DeleteButton
              onDelete={() => onDeleteBundle(bundleIndex)}
              confirmationTitle="Delete Bundle"
              confirmationDescription={`Are you sure you want to delete "${bundle.name || 'this bundle'}"? This action cannot be undone and will remove all files in this bundle.`}
              buttonText=""
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 h-8 w-8"
            />
          </div>
        </MenuSection>

        <MenuSection showSeparator>
          <MenuItem
            onClick={handleAddFile}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4"/>
            Add File
          </MenuItem>

          <ScrollableMenuList
            isEmpty={!bundle.files || bundle.files.length === 0}
            emptyMessage="No files in bundle"
          >
            {bundle.files?.map((file: FileBundleEntry, fileIndex: number) => (
              <MenuItem
                key={fileIndex}
                onClick={() => handleFileClick(fileIndex)}
                isActive={selectedFileIndex === fileIndex}
                className="flex items-center gap-2"
              >
                <File className="h-4 w-4 flex-shrink-0"/>
                <span className="truncate" title={file.path}>
                  {file.path.split('/').pop() || file.path}
                </span>
              </MenuItem>
            ))}
          </ScrollableMenuList>
        </MenuSection>
      </Menu>

      {/* Main Content Area */}
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  )
}