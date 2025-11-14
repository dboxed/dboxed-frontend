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

interface LoadBalancerConfigCardProps {
  data: components["schemas"]["LoadBalancer"]
  save: (data: components["schemas"]["UpdateLoadBalancer"]) => Promise<boolean>
}

interface PortFormData {
  httpPort: number
  httpsPort: number
  replicas: number
}

export function LoadBalancerConfigCard({ data, save }: LoadBalancerConfigCardProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const buildInitial = (): PortFormData => ({
    httpPort: data.httpPort,
    httpsPort: data.httpsPort,
    replicas: data.replicas
  })

  const handleSave = async (values: PortFormData): Promise<boolean> => {
    return await save({
      httpPort: values.httpPort,
      httpsPort: values.httpsPort,
      replicas: values.replicas
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Load Balancer Configuration</CardTitle>
              <CardDescription>
                Network and protocol configuration for this load balancer
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Box and Network Information Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Resources</h3>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Box</dt>
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
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Network</dt>
                  <dd className="mt-1">
                    <ReferenceLabel
                      resourceId={data.network}
                      resourcePath="/v1/workspaces/{workspaceId}/networks/{id}"
                      pathParams={{
                        workspaceId: workspaceId!,
                        id: data.network
                      }}
                      detailsUrl={`/workspaces/${workspaceId}/networks/${data.network}`}
                      fallbackLabel={data.network}
                      className="text-blue-600 hover:text-blue-800 underline"
                    />
                  </dd>
                </div>
              </dl>
            </div>

            {/* Port Configuration Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Configuration</h3>
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

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Replicas</dt>
                  <dd className="mt-1">
                    <code className="text-sm bg-muted px-1 py-0.5 rounded">
                      {data.replicas}
                    </code>
                  </dd>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Number of loadBalancer instances
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
                Additional loadBalancer configuration options will be displayed here.
              </p>
            </div> */}
          </div>
        </CardContent>
      </Card>

      <SimpleFormDialog<PortFormData>
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Configuration"
        buildInitial={buildInitial}
        onSave={handleSave}
        saveText="Save Changes"
      >
        {(form) => (
          <div className="space-y-4">
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

            <FormField
              control={form.control}
              name="replicas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Replicas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="1"
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
