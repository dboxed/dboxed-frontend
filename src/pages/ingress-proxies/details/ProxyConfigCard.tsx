import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"
import { Edit } from "lucide-react"

interface ProxyConfigCardProps {
  data: components["schemas"]["IngressProxy"]
  save: (data: components["schemas"]["UpdateIngressProxy"]) => Promise<boolean>
}

interface PortFormData {
  httpPort: number
  httpsPort: number
}

export function ProxyConfigCard({ data, save }: ProxyConfigCardProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const buildInitial = (): PortFormData => ({
    httpPort: data.httpPort,
    httpsPort: data.httpsPort
  })

  const handleSave = async (values: PortFormData): Promise<boolean> => {
    return await save({
      httpPort: values.httpPort,
      httpsPort: values.httpsPort
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Proxy Configuration</CardTitle>
          <CardDescription>
            Network and protocol configuration for this ingress proxy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Box Information Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Box</h3>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Running On</dt>
                <dd className="mt-1">
                  <ReferenceLabel
                    resourceId={data.boxId}
                    resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
                    pathParams={{
                      workspaceId: workspaceId!,
                      id: data.boxId
                    }}
                    detailsUrl={`/workspaces/${workspaceId}/boxes/${data.boxId}`}
                    fallbackLabel={data.boxId}
                    className="text-blue-600 hover:text-blue-800 underline"
                  />
                </dd>
              </div>
            </div>

            {/* Port Configuration Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Port Configuration</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Ports
                </Button>
              </div>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">HTTP Port</dt>
                  <dd className="mt-1">
                    <code className="text-sm bg-muted px-1 py-0.5 rounded">
                      {data.httpPort}
                    </code>
                  </dd>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Port for HTTP traffic (typically 80)
                  </p>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">HTTPS Port</dt>
                  <dd className="mt-1">
                    <code className="text-sm bg-muted px-1 py-0.5 rounded">
                      {data.httpsPort}
                    </code>
                  </dd>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Port for HTTPS traffic (typically 443)
                  </p>
                </div>
              </dl>
            </div>

            {/* Placeholder sections for future configuration */}
            {/* Uncomment and expand as new configuration options are added to the API */}

            {/* SSL/TLS Configuration Section */}
            {/* <div>
              <h3 className="text-sm font-semibold mb-3">SSL/TLS Configuration</h3>
              <p className="text-sm text-muted-foreground">
                SSL certificate and TLS settings will be displayed here.
              </p>
            </div> */}

            {/* Routing Configuration Section */}
            {/* <div>
              <h3 className="text-sm font-semibold mb-3">Routing Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Default routing rules and middleware configuration will be displayed here.
              </p>
            </div> */}

            {/* Advanced Settings Section */}
            {/* <div>
              <h3 className="text-sm font-semibold mb-3">Advanced Settings</h3>
              <p className="text-sm text-muted-foreground">
                Additional proxy configuration options will be displayed here.
              </p>
            </div> */}
          </div>
        </CardContent>
      </Card>

      <SimpleFormDialog<PortFormData>
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Ports"
        buildInitial={buildInitial}
        onSave={handleSave}
        saveText="Save Changes"
      >
        {(form) => (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="httpPort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HTTP Port</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="65535"
                      placeholder="80"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="httpsPort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HTTPS Port</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="65535"
                      placeholder="443"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </SimpleFormDialog>
    </>
  )
}
