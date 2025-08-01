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

interface FileBundleMenuProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>
  bundleIndex: number
}

type FileBundleEntry = components["schemas"]["FileBundleEntry"]

export function FileBundleSection({ form, bundleIndex }: FileBundleMenuProps) {
  const [activeSection, setActiveSection] = useState<string>("config")
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)

  const fileBundles = form.watch("boxSpec.fileBundles") || []
  const bundle = fileBundles[bundleIndex]

  // Reset to config section when bundle changes
  useEffect(() => {
    setActiveSection("config")
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

  const handleFileClick = (fileIndex: number) => {
    setSelectedFileIndex(fileIndex)
    setActiveSection(`file-${fileIndex}`)
  }

  const handleAddFile = () => {
    const newFile: FileBundleEntry = {
      path: `/new-file-${(bundle.files?.length || 0) + 1}.txt`,
      stringData: "",
      mode: "0644",
      uid: 0,
      gid: 0,
    }
    
    const updatedBundles = [...fileBundles]
    const updatedFiles = [...(updatedBundles[bundleIndex].files || [])]
    updatedFiles.push(newFile)
    
    updatedBundles[bundleIndex] = {
      ...updatedBundles[bundleIndex],
      files: updatedFiles
    }
    
    form.setValue("boxSpec.fileBundles", updatedBundles)
    
    // Navigate to the newly created file
    const newFileIndex = updatedFiles.length - 1
    setSelectedFileIndex(newFileIndex)
    setActiveSection(`file-${newFileIndex}`)
  }

  const handleDeleteBundle = () => {
    const updatedBundles = [...fileBundles]
    updatedBundles.splice(bundleIndex, 1)
    form.setValue("boxSpec.fileBundles", updatedBundles)
  }

  const handleDeleteFile = () => {
    // Navigate back to bundle config after file deletion
    setActiveSection("config")
    setSelectedFileIndex(null)
  }

  const renderContent = () => {
    if (activeSection === "config") {
      return <BundleConfigSection form={form} bundleIndex={bundleIndex} onDeleteBundle={handleDeleteBundle} />
    }

    if (activeSection.startsWith("file-") && selectedFileIndex !== null) {
      return <FileContentEditor form={form} bundleIndex={bundleIndex} fileIndex={selectedFileIndex} onDeleteFile={handleDeleteFile} />
    }

    return null
  }

  return (
    <div className="flex gap-6 h-full min-h-[500px]">
      {/* Left Sidebar Menu */}
      <Menu>
        <MenuSection>
          <MenuItem
            onClick={() => setActiveSection("config")}
            isActive={activeSection === "config"}
          >
            Bundle Config
          </MenuItem>
        </MenuSection>

        <MenuSection showSeparator>
          <MenuItem
            onClick={handleAddFile}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
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
                isActive={activeSection === `file-${fileIndex}`}
                className="flex items-center gap-2"
              >
                <File className="h-4 w-4 flex-shrink-0" />
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