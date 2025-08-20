import { useMemo, useState } from "react"
import { EditorDialog } from "@/components/EditorDialog.tsx"
import { Plus } from "lucide-react"
import { type UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"
import { parse, stringify } from 'yaml'
import { BoxSpecConfigSection } from "./BoxSpecConfigSection.tsx"
import { VolumeSection } from "./VolumeSection.tsx"
import { ComposeProjectEditor } from "./ComposeProjectEditor.tsx"
import { MenuItem } from "./MenuItem.tsx"
import { Menu } from "./Menu.tsx"
import { MenuSection } from "./MenuSection.tsx"
import { ScrollableMenuList } from "./ScrollableMenuList.tsx"

interface BoxSpecTabProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>
}

type BoxVolumeSpec = components["schemas"]["BoxVolumeSpec"]

export function BoxSpecTab({ form }: BoxSpecTabProps) {
  const [showYamlDialog, setShowYamlDialog] = useState(false)
  const [selectedVolumeIndex, setSelectedVolumeIndex] = useState<number | null>(null)
  const [selectedComposeProjectIndex, setSelectedComposeProjectIndex] = useState<number | null>(null)

  const volumes = form.watch("boxSpec.volumes") || []
  const composeProjects = form.watch("boxSpec.composeProjects") || []

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

  const handleBoxSpecConfigClick = () => {
    setSelectedVolumeIndex(null)
    setSelectedComposeProjectIndex(null)
  }

  const handleAddVolume = () => {
    const newVolume: BoxVolumeSpec = {
      name: `volume-${volumes.length + 1}`,
      fileBundle: {
        files: []
      },
      rootUid: 0,
      rootGid: 0,
      rootMode: "0755"
    }
    const updatedVolumes = [...volumes, newVolume]
    form.setValue("boxSpec.volumes", updatedVolumes)
    setSelectedVolumeIndex(updatedVolumes.length - 1)
  }

  const handleVolumeClick = (index: number) => {
    setSelectedVolumeIndex(index)
    setSelectedComposeProjectIndex(null)
  }

  const handleDeleteVolume = (index: number) => {
    const updatedVolumes = [...volumes]
    updatedVolumes.splice(index, 1)
    form.setValue("boxSpec.volumes", updatedVolumes)

    if (updatedVolumes.length === 0) {
      setSelectedVolumeIndex(null)
    } else if (index >= updatedVolumes.length) {
      setSelectedVolumeIndex(updatedVolumes.length - 1)
    }
  }

  const handleAddComposeProject = () => {
    let newIndex = 1
    const buildName = (i: number) => `compose-${i}`
    while (composeProjectInfos.find(pi => pi.name === buildName(newIndex))) {
      newIndex++
    }
    const newName = buildName(newIndex)
    const newProject = `# Empty compose project
name: ${newName}
services:
  # Add your services here
`
    const updatedProjects = [...composeProjects, newProject]
    form.setValue("boxSpec.composeProjects", updatedProjects)
    setSelectedComposeProjectIndex(updatedProjects.length - 1)
    setSelectedVolumeIndex(null)
  }

  const handleComposeProjectClick = (index: number) => {
    setSelectedComposeProjectIndex(index)
    setSelectedVolumeIndex(null)
  }

  const handleDeleteComposeProject = (index: number) => {
    const updatedProjects = [...composeProjects]
    updatedProjects.splice(index, 1)
    form.setValue("boxSpec.composeProjects", updatedProjects)

    if (updatedProjects.length === 0) {
      setSelectedComposeProjectIndex(null)
    } else if (index >= updatedProjects.length) {
      setSelectedComposeProjectIndex(updatedProjects.length - 1)
    }
  }

  const extractComposeProjectInfo = (project: string, index: number) => {
    let name = `<no-name-${index}>`
    let serviceCount = 0
    try {
      // we first try to find the line starting with name: and then parse that as yaml
      // the idea is that this should work even in cases where the rest of the yaml is invalid
      const re = /name:.*/;
      const m = re.exec(project)
      if (m) {
        const nameY = parse(m[0])
        name = nameY.name as string
      }
    } catch {
      // Ignore YAML parsing errors for project name extraction
    }

    try {
      // this might fail
      const y = parse(project)
      serviceCount = (Object.keys(y.services || {})).length
    } catch {
      // Ignore YAML parsing errors for service count
    }

    return {
      name: name,
      serviceCount: serviceCount,
    }
  }

  const composeProjectInfos = useMemo(() => {
    return composeProjects.map((p, i) => extractComposeProjectInfo(p, i))
  }, [composeProjects])

  const renderContent = () => {
    if (selectedVolumeIndex !== null) {
      return <VolumeSection form={form} volumeIndex={selectedVolumeIndex} onDeleteVolume={handleDeleteVolume}/>
    } else if (selectedComposeProjectIndex !== null) {
      return <ComposeProjectEditor form={form} projectIndex={selectedComposeProjectIndex} projectName={composeProjectInfos[selectedComposeProjectIndex].name} onDeleteProject={handleDeleteComposeProject} />
    } else {
      return <BoxSpecConfigSection form={form} onEditYaml={handleYamlEdit} />
    }
  }

  return (
    <div className="flex gap-6 h-full min-h-[500px]">
        {/* Left Sidebar Menu */}
      <Menu>
        <MenuSection >
          <MenuItem
            onClick={handleBoxSpecConfigClick}
            isActive={selectedVolumeIndex === null && selectedComposeProjectIndex === null}
          >
            Box Spec
          </MenuItem>
        </MenuSection>

        <MenuSection showSeparator>
          <MenuItem
            onClick={handleAddVolume}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Volume
          </MenuItem>

          <ScrollableMenuList
            isEmpty={volumes.length === 0}
            emptyMessage="No volumes"
            maxHeight="max-h-40"
          >
            {volumes.map((volume, index) => (
              <MenuItem
                key={index}
                onClick={() => handleVolumeClick(index)}
                isActive={selectedVolumeIndex === index}
              >
                <div className="flex justify-between items-center">
                  <span>{volume.name}</span>
                  <span className="text-xs opacity-70">
                    {volume.fileBundle?.files?.length || 0} files
                  </span>
                </div>
              </MenuItem>
            ))}
          </ScrollableMenuList>
        </MenuSection>

        <MenuSection showSeparator>
          <MenuItem
            onClick={handleAddComposeProject}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Compose
          </MenuItem>

          <ScrollableMenuList
            isEmpty={composeProjects.length === 0}
            emptyMessage="No compose projects"
            maxHeight="max-h-40"
          >
            {composeProjects.map((_, index) => {
              const pi = composeProjectInfos[index]
              return <MenuItem
                key={index}
                onClick={() => handleComposeProjectClick(index)}
                isActive={selectedComposeProjectIndex === index}
              >
                <div className="flex justify-between items-center">
                  <span>{pi.name}</span>
                  <span className="text-xs opacity-70">
                    {pi.serviceCount} services
                  </span>
                </div>
              </MenuItem>
            })}
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
        language={"yaml"}
      />
    </div>
  )
}