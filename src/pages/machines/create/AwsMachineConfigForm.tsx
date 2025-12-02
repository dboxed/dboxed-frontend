import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Cloud } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useDboxedQueryClient } from "@/api/client.ts"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { useEffect } from "react"

interface AwsMachineConfigFormProps {
  form: UseFormReturn<any>
}

export function AwsMachineConfigForm({ form }: AwsMachineConfigFormProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  
  const machineProviderId = form.watch("machineProvider")
  
  // Fetch the selected machine provider details to get subnets
  const machineProviderQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/machine-providers/{id}', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: machineProviderId,
      }
    },
  }, {
    enabled: !!machineProviderId
  })

  const machineProvider = machineProviderQuery.data
  const subnets = machineProvider?.aws?.subnets || []

  // Set first subnet as default when subnets are loaded
  useEffect(() => {
    if (subnets.length > 0 && !form.getValues("aws.subnetId")) {
      form.setValue("aws.subnetId", subnets[0].subnetId)
    }
  }, [subnets, form])

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
          name="aws.instanceType"
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
          name="aws.subnetId"
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
                      {subnets.map((subnet: components["schemas"]["MachineProviderAwsSubnet"]) => (
                        <SelectItem key={subnet.subnetId} value={subnet.subnetId}>
                          <div className="flex flex-col">
                            <span>{subnet.subnetName || subnet.subnetId}</span>
                            <span className="text-xs text-muted-foreground">
                              {subnet.availabilityZone} - {subnet.cidr}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {machineProviderQuery.isLoading ? "Loading subnets..." : "No subnets available"}
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
          name="aws.rootVolumeSize"
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