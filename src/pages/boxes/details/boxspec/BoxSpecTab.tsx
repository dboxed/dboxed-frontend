import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { CardTitle, Card, CardHeader, CardContent } from "@/components/ui/card.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { EditorDialog } from "@/components/EditorDialog.tsx"
import { FileBundlesTab } from "@/pages/boxes/details/boxspec/FileBundlesTab.tsx"
import { type UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"
import { parse, stringify } from 'yaml'

interface BoxSpecTabProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>
}

export function BoxSpecTab({ form }: BoxSpecTabProps) {
  const [showYamlDialog, setShowYamlDialog] = useState(false)

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