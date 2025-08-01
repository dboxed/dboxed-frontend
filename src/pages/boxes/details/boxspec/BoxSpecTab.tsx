import { useState } from "react"
import { EditorDialog } from "@/components/EditorDialog.tsx"
import { Plus } from "lucide-react"
import { type UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"
import { parse, stringify } from 'yaml'
import { BoxSpecConfigSection } from "./BoxSpecConfigSection.tsx"
import { FileBundleSection } from "./FileBundleSection.tsx"
import { MenuItem } from "./MenuItem.tsx"
import { Menu } from "./Menu.tsx"
import { MenuSection } from "./MenuSection.tsx"
import { ScrollableMenuList } from "./ScrollableMenuList.tsx"

interface BoxSpecTabProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>
}

type FileBundle = components["schemas"]["FileBundle"]

export function BoxSpecTab({ form }: BoxSpecTabProps) {
  const [showYamlDialog, setShowYamlDialog] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("config")
  const [selectedBundleIndex, setSelectedBundleIndex] = useState<number | null>(null)

  const fileBundles = form.watch("boxSpec.fileBundles") || []

  const handleYamlEdit = () => {
    setShowYamlDialog(true)
  }

  const handleYamlSave = (yamlContent: string) => {
    try {
      const parsedData = parse(yamlContent)
      form.reset({'boxSpec': parsedData})
    } catch (error) {
      console.error('Failed to parse YAML:', error)
      alert('Invalid YAML format. Please check your syntax.')
    }
  }

  const getCurrentYaml = () => {
    const currentValues = form.getValues()
    return stringify(currentValues.boxSpec || {})
  }

  const handleSaveBundles = (newBundles: FileBundle[]) => {
    form.setValue("boxSpec.fileBundles", newBundles)
  }

  const handleAddBundle = () => {
    const newBundle: FileBundle = {
      name: `bundle-${fileBundles.length + 1}`,
      files: [],
      rootUid: 0,
      rootGid: 0,
      rootMode: "0755"
    }
    const updatedBundles = [...fileBundles, newBundle]
    handleSaveBundles(updatedBundles)
    setSelectedBundleIndex(updatedBundles.length - 1)
    setActiveSection(`bundle-${updatedBundles.length - 1}`)
  }

  const handleBundleClick = (index: number) => {
    setSelectedBundleIndex(index)
    setActiveSection(`bundle-${index}`)
  }

  const renderContent = () => {
    if (activeSection === "config") {
      return <BoxSpecConfigSection form={form} onEditYaml={handleYamlEdit} />
    }

    if (activeSection.startsWith("bundle-") && selectedBundleIndex !== null) {
      return <FileBundleSection form={form} bundleIndex={selectedBundleIndex} />
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
            Box Spec
          </MenuItem>
        </MenuSection>

        <MenuSection showSeparator>
          <MenuItem
            onClick={handleAddBundle}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Bundle
          </MenuItem>

          <ScrollableMenuList 
            isEmpty={fileBundles.length === 0}
            emptyMessage="No bundles"
          >
            {fileBundles.map((bundle, index) => (
              <MenuItem
                key={index}
                onClick={() => handleBundleClick(index)}
                isActive={activeSection === `bundle-${index}`}
              >
                <div className="flex justify-between items-center">
                  <span>{bundle.name}</span>
                  <span className="text-xs opacity-70">
                    {bundle.files?.length || 0} files
                  </span>
                </div>
              </MenuItem>
            ))}
          </ScrollableMenuList>
        </MenuSection>
      </Menu>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="h-full">
          {renderContent()}
        </div>
      </div>

      <EditorDialog
        open={showYamlDialog}
        onOpenChange={setShowYamlDialog}
        title="Edit Box Spec as YAML"
        initialValue={getCurrentYaml()}
        onSave={handleYamlSave}
      />
    </div>
  )
}