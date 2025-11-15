import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
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
            <div>
              <DetailsCardLayout>
                <LabelAndValue
                  label="Network"
                  value={
                    <ReferenceLabel
                      resourceId={data.network}
                      resourcePath="/v1/workspaces/{workspaceId}/networks/{id}"
                      pathParams={{
                        workspaceId: workspaceId!,
                        id: data.network
                      }}
                      detailsUrl={`/workspaces/${workspaceId}/networks/${data.network}`}
                      fallbackLabel={data.network}
                    />
                  }
                />
              </DetailsCardLayout>
            </div>

            {/* Configuration Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Configuration</h3>
              <DetailsCardLayout>
                <LabelAndValue
                  label="HTTP Port"
                  value={data.httpPort}
                />

                <LabelAndValue
                  label="HTTPS Port"
                  value={data.httpsPort}
                />

                <LabelAndValue
                  label="Replicas"
                  value={data.replicas}
                />
              </DetailsCardLayout>
            </div>
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
