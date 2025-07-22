import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Cloud } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useUnboxedQueryClient } from "@/api/api"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"

interface AwsMachineConfigFormProps {
  form: UseFormReturn<any>
}

export function AwsMachineConfigForm({ form }: AwsMachineConfigFormProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useUnboxedQueryClient()
  
  const cloudProviderId = form.watch("cloud_provider")
  
  // Fetch the selected cloud provider details to get subnets
  const cloudProviderQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/cloud-providers/{id}', {
    params: {
      path: {
        workspaceId: workspaceId,
        id: cloudProviderId,
      }
    },
    enabled: !!cloudProviderId
  })

  const cloudProvider = cloudProviderQuery.data
  const subnets = cloudProvider?.aws?.subnets || []

  // Common AWS instance types
  const instanceTypes = [
    { value: "t3.micro", label: "t3.micro (1 vCPU, 1 GiB RAM)" },
    { value: "t3.small", label: "t3.small (2 vCPU, 2 GiB RAM)" },
    { value: "t3.medium", label: "t3.medium (2 vCPU, 4 GiB RAM)" },
    { value: "t3.large", label: "t3.large (2 vCPU, 8 GiB RAM)" },
    { value: "t3.xlarge", label: "t3.xlarge (4 vCPU, 16 GiB RAM)" },
    { value: "c5.large", label: "c5.large (2 vCPU, 4 GiB RAM)" },
    { value: "c5.xlarge", label: "c5.xlarge (4 vCPU, 8 GiB RAM)" },
    { value: "m5.large", label: "m5.large (2 vCPU, 8 GiB RAM)" },
    { value: "m5.xlarge", label: "m5.xlarge (4 vCPU, 16 GiB RAM)" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cloud className="h-5 w-5" />
          <span>AWS Machine Configuration</span>
        </CardTitle>
        <CardDescription>
          Configure your AWS EC2 instance settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="aws.instance_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instance Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an instance type" />
                  </SelectTrigger>
                  <SelectContent>
                    {instanceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Choose the EC2 instance type that meets your performance requirements.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aws.subnet_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subnet</FormLabel>
              <FormControl>
                {subnets.length > 0 ? (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subnet" />
                    </SelectTrigger>
                    <SelectContent>
                      {subnets.map((subnet: components["schemas"]["CloudProviderAwsSubnet"]) => (
                        <SelectItem key={subnet.subnet_id} value={subnet.subnet_id}>
                          <div className="flex flex-col">
                            <span>{subnet.subnet_name || subnet.subnet_id}</span>
                            <span className="text-xs text-muted-foreground">
                              {subnet.availability_zone} - {subnet.cidr}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {cloudProviderQuery.isLoading ? "Loading subnets..." : "No subnets available"}
                  </div>
                )}
              </FormControl>
              <FormDescription>
                Select the subnet where the EC2 instance will be launched.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aws.root_volume_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Root Volume Size (GB)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="20"
                  min="8"
                  max="1000"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined
                    field.onChange(value)
                  }}
                />
              </FormControl>
              <FormDescription>
                Size of the root EBS volume in GB (optional, defaults to AMI size).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
} 