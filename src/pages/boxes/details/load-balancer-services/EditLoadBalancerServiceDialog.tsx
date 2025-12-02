import { SimpleFormDialog } from "@/components/SimpleFormDialog"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedMutation } from "@/api/mutation.ts"
import type { components } from "@/api/models/dboxed-schema"
import { toast } from "sonner"
import type { ReactNode } from "react"

interface EditLoadBalancerServiceDialogProps {
  boxId: string
  loadBalancerService: components["schemas"]["LoadBalancerService"]
  trigger: ReactNode
  onSuccess: () => void
}

interface FormData {
  hostname: string
  pathPrefix: string
  port: string
  description: string
}

export function EditLoadBalancerServiceDialog({ boxId, loadBalancerService, trigger, onSuccess }: EditLoadBalancerServiceDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  const updateLoadBalancerServiceMutation = useDboxedMutation('patch', '/v1/workspaces/{workspaceId}/boxes/{id}/load-balancer-services/{loadBalancerServiceId}', {
    successMessage: "Load Balancer Service updated successfully!",
    errorMessage: "Failed to update Load Balancer Service",
    refetchPath: "/v1/workspaces/{workspaceId}/boxes/{id}/load-balancer-services",
    onSuccess: () => onSuccess(),
  })

  const handleSave = async (formData: FormData) => {
    const portNum = parseInt(formData.port, 10)

    if (isNaN(portNum)) {
      toast.error("Invalid port number")
      return false
    }

    return await updateLoadBalancerServiceMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId,
          loadBalancerServiceId: loadBalancerService.id
        }
      },
      body: {
        hostname: formData.hostname,
        pathPrefix: formData.pathPrefix,
        port: portNum,
        description: formData.description || undefined
      }
    })
  }

  return (
    <SimpleFormDialog<FormData>
      trigger={trigger}
      title="Edit Load Balancer Service"
      description="Update the HTTP load balancer service rule for this box"
      buildInitial={() => ({
        hostname: loadBalancerService.hostname,
        pathPrefix: loadBalancerService.pathPrefix,
        port: loadBalancerService.port.toString(),
        description: loadBalancerService.description || ""
      })}
      onSave={handleSave}
      saveText="Save Changes"
    >
      {(form) => (
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="hostname"
            rules={{ required: "Hostname is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hostname</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pathPrefix"
            rules={{ required: "Path prefix is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Path Prefix</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="port"
            rules={{
              required: "Port is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Must be a valid port number"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="65535"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Web application service"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </SimpleFormDialog>
  )
}
