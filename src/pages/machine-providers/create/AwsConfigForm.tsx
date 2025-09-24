import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Cloud } from "lucide-react"
import { useDboxedQueryClient } from "@/api/api.ts"
import type { UseFormReturn } from "react-hook-form";

interface AwsConfigFormProps {
  form: UseFormReturn<any>
}

export function AwsConfigForm({ form }: AwsConfigFormProps) {
  const client = useDboxedQueryClient()
  
  // Fetch AWS regions
  const awsRegions = client.useQuery('get', '/v1/machine-provider-info/aws/regions')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cloud className="h-5 w-5" />
          <span>AWS Configuration</span>
        </CardTitle>
        <CardDescription>
          Configure your AWS credentials and network settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="aws.awsAccessKeyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AWS Access Key ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your AWS access key ID for API authentication.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aws.awsSecretAccessKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AWS Secret Access Key</FormLabel>
              <FormControl>
                <Input
                  placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your AWS secret access key for API authentication.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aws.region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AWS Region</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an AWS region" />
                  </SelectTrigger>
                  <SelectContent>
                    {awsRegions.data?.items?.map((region: any) => (
                      <SelectItem key={region.RegionName} value={region.RegionName}>
                        {region.RegionName} - {region.RegionName}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                The AWS region where your resources will be deployed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aws.vpcId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VPC ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="vpc-12345678"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The ID of your AWS VPC where resources will be created.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
} 