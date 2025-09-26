import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import type { UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"
import { Label } from "@/components/ui/label.tsx";

interface AwsDetailsCardProps {
  awsData: components["schemas"]["MachineProviderAws"]
  form: UseFormReturn<any>
}

interface AwsSubnetsCardProps {
  subnets: components["schemas"]["MachineProviderAws"]["subnets"]
}

export function AwsDetailsCard({ awsData, form }: AwsDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>AWS Configuration</span>
        </CardTitle>
        <CardDescription>
          AWS machine provider configuration details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Read-only fields in two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Region</Label>
              <p className="text-sm text-muted-foreground">{awsData.region}</p>
            </div>
            
            <div>
              <Label>VPC ID</Label>
              <p className="text-sm text-muted-foreground">{awsData.vpcId || "N/A"}</p>
            </div>
            
            <div>
              <Label>Security Group ID</Label>
              <p className="text-sm text-muted-foreground">{awsData.securityGroupId || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>VPC Name</Label>
              <p className="text-sm text-muted-foreground">{awsData.vpcName || "N/A"}</p>
            </div>
            
            <div>
              <Label>VPC CIDR</Label>
              <p className="text-sm text-muted-foreground">{awsData.vpcCidr || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Editable fields for UpdateMachineProvider */}
        <div className="space-y-4 pt-4 border-t">
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
                    value={field.value || ""}
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
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Your AWS secret access key for API authentication.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function AwsSubnetsCard({ subnets }: AwsSubnetsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subnets</CardTitle>
        <CardDescription>
          AWS VPC subnets associated with this machine provider.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!subnets || subnets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No subnets</p>
        ) : (
          <div className="space-y-4">
            {subnets.map((subnet, index) => (
              <div key={index} className="pl-4 border-l-2 border-muted">
                <p className="text-sm text-muted-foreground">
                  <strong>Subnet ID:</strong> {subnet.subnetId}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Name:</strong> {subnet.subnetName || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>CIDR:</strong> {subnet.cidr}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Availability Zone:</strong> {subnet.availabilityZone}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 