import { SimpleFormDialog } from "@/components/SimpleFormDialog"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import { useDboxedMutation } from "@/api/mutation.ts"
import { toast } from "sonner"
import { StatusBadge } from "@/components/StatusBadge.tsx"
import { type ReactNode, useState } from "react"

interface AddLoadBalancerServiceDialogProps {
  boxId: string
  trigger: ReactNode
  onSuccess: () => void
}

interface FormData {
  loadBalancerId: string
  hostname: string
  pathPrefix: string
  port: string
  description: string
}

export function AddLoadBalancerServiceDialog({ boxId, trigger, onSuccess }: AddLoadBalancerServiceDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)

  const lbsQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/load-balancers', {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    }
  }, {
    enabled: dialogOpen,
  })

  const createLoadBalancerServiceMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/load-balancer-services', {
    successMessage: "Load Balancer Service created successfully!",
    errorMessage: "Failed to create Load Balancer Service",
    refetchPath: "/v1/workspaces/{workspaceId}/boxes/{id}/load-balancer-services",
    onSuccess: () => onSuccess(),
  })

  const handleSave = async (formData: FormData) => {
    const portNum = parseInt(formData.port, 10)

    if (isNaN(portNum)) {
      toast.error("Invalid port number")
      return false
    }

    if (!formData.loadBalancerId) {
      toast.error("Please select a Load Balancer")
      return false
    }

    return await createLoadBalancerServiceMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId
        }
      },
      body: {
        loadBalancerId: formData.loadBalancerId,
        hostname: formData.hostname,
        pathPrefix: formData.pathPrefix,
        port: portNum,
        description: formData.description || undefined
      }
    })
  }

  const lbs = lbsQuery.data?.items || []

  return (
    <SimpleFormDialog<FormData>
      trigger={trigger}
      title="Add Load Balancer Service"
      onOpenChange={setDialogOpen}
      description="Create a new HTTP Load Balancer Service rule for this box"
      buildInitial={() => ({
        loadBalancerId: "",
        hostname: "",
        pathPrefix: "/",
        port: "",
        description: ""
      })}
      onSave={handleSave}
      saveText="Create"
    >
      {(form) => (
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="loadBalancerId"
            rules={{ required: "Load Balancer is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Load Balancer</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a load balancer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lbs.map((lb) => (
                      <SelectItem key={lb.id} value={lb.id}>
                        <div className="flex items-center gap-2">
                          <span>{lb.name}</span>
                          <StatusBadge item={lb}/>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    placeholder="example.com"
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
                    placeholder="/"
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
                    placeholder="8080"
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
                    placeholder="Web application"
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
