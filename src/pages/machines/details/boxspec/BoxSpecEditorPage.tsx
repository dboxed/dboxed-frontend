import { useState } from "react"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import type { components } from "@/api/models/schema"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { CardTitle, Card, CardHeader, CardContent } from "@/components/ui/card.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { YamlEditDialog } from "@/components/YamlEditDialog.tsx"
import { FileBundlesTab } from "@/pages/machines/details/boxspec/FileBundlesTab.tsx";
import { parse, stringify } from 'yaml'

export function BoxSpecEditorPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { machineId } = useParams<{ machineId: string }>()
  const [showYamlDialog, setShowYamlDialog] = useState(false)

  if (!machineId) {
    return <div>Invalid machine ID</div>
  }

  const buildUpdateDefaults = (machine: components["schemas"]["Machine"]) => {
    return {
      boxSpec: machine.box_spec
    } as components["schemas"]["UpdateMachine"]
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["Machine"], components["schemas"]["UpdateMachine"]>
      title={data => {
        if (!data) {
          return "Box Spec"
        }
        return `Box Spec for ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/machines/{id}"
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: parseInt(machineId),
        }
      }}
      enableDelete={false}
      enableSave={true}
      buildUpdateDefaults={buildUpdateDefaults}
    >
      {(data, form) => {
        const handleYamlEdit = () => {
          setShowYamlDialog(true)
        }

        const handleYamlSave = (yamlContent: string) => {
          try {
            const parsedData = parse(yamlContent)
            form.reset({'boxSpec': parsedData})
          } catch (error) {
            console.error('Failed to parse YAML:', error)
            // In a real app, you might want to show a toast notification here
            alert('Invalid YAML format. Please check your syntax.')
          }
        }

        const getCurrentYaml = () => {
          const currentValues = form.getValues()
          return stringify(currentValues.boxSpec || {})
        }

        return (
          <div className="space-y-6">
            <Tabs defaultValue="general" className="space-y-6">
              <div className="flex justify-between items-center">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="dns">DNS</TabsTrigger>
                  <TabsTrigger value="files">File Bundles</TabsTrigger>
                </TabsList>
                <Button 
                  variant="outline" 
                  onClick={handleYamlEdit}
                  type="button"
                >
                  Edit as YAML
                </Button>
              </div>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="boxSpec.infraImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Infrastructure Image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter infrastructure image URL"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>DNS Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="boxSpec.dns.hostname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hostname</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter hostname"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="boxSpec.dns.networkDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Network Domain</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter network domain"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="boxSpec.dns.networkInterface"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Network Interface</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter network interface (e.g., eth0)"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

              <TabsContent value="files">
                <FileBundlesTab form={form} />
              </TabsContent>
            </Tabs>

            <YamlEditDialog
              open={showYamlDialog}
              onOpenChange={setShowYamlDialog}
              title="Edit Box Spec as YAML"
              initialValue={getCurrentYaml()}
              onSave={handleYamlSave}
              placeholder="Enter your box spec configuration in YAML format..."
            />
          </div>
        )
      }}
    </BaseResourceDetailsPage>
  )
} 