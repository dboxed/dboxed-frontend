import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import type { components } from "@/api/models/schema"
import { LabelAndValue } from "@/components/LabelAndValue.tsx";
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx";
import { OpenDialogButton } from "@/components/OpenDialogButton.tsx";

interface AwsEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  save: (update: components["schemas"]["UpdateMachineProvider"]) => Promise<boolean>
}

function AwsEditCredentialsDialog({ open, onOpenChange, save }: AwsEditDialogProps) {
  const buildInitial = (): components["schemas"]["UpdateMachineProviderAws"] => ({
    awsAccessKeyId: undefined,
    awsSecretAccessKey: undefined
  })

  const handleSave = async (formData: components["schemas"]["UpdateMachineProviderAws"]) => {
    return await save({
      aws: {
        awsAccessKeyId: formData.awsAccessKeyId,
        awsSecretAccessKey: formData.awsSecretAccessKey
      }
    })
  }

  return <SimpleFormDialog<components["schemas"]["UpdateMachineProviderAws"]>
    open={open}
    onOpenChange={onOpenChange}
    title="Edit AWS Credentials"
    buildInitial={buildInitial}
    onSave={handleSave}
  >
    {(form) => (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="awsAccessKeyId"
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
          name="awsSecretAccessKey"
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
      </div>
    )}
  </SimpleFormDialog>
}

interface AwsNetworkCardProps {
  awsData: components["schemas"]["MachineProviderAws"]
}

interface AwsCredentialsCardProps {
  save: (data: components["schemas"]["UpdateMachineProvider"]) => Promise<boolean>
}

interface AwsSubnetsCardProps {
  subnets: components["schemas"]["MachineProviderAws"]["subnets"]
}

export function AwsNetworkCard({ awsData }: AwsNetworkCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AWS Network Configuration</CardTitle>
        <CardDescription>
          Network and infrastructure details for the AWS provider.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DetailsCardLayout>
          <LabelAndValue
            label="Region"
            textValue={awsData.region}
          />

          <LabelAndValue
            label="VPC ID"
            textValue={awsData.vpcId || "N/A"}
          />

          <LabelAndValue
            label="Security Group ID"
            textValue={awsData.securityGroupId || "N/A"}
          />

          <LabelAndValue
            label="VPC Name"
            textValue={awsData.vpcName || "N/A"}
          />

          <LabelAndValue
            label="VPC CIDR"
            textValue={awsData.vpcCidr || "N/A"}
          />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
}

export function AwsCredentialsCard({ save }: AwsCredentialsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>AWS Credentials</CardTitle>
          <CardDescription>
            Authentication credentials for AWS API access.
          </CardDescription>
        </div>
        <OpenDialogButton dialog={AwsEditCredentialsDialog} save={save}>
          Edit Credentials
        </OpenDialogButton>
      </CardHeader>
      <CardContent>
        <DetailsCardLayout>
          <LabelAndValue
            label="Access Key ID"
            textValue={"••••••••••••"}
          />

          <LabelAndValue
            label="Secret Access Key"
            textValue={"••••••••••••"}
          />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
}

// Legacy export for backward compatibility - use AwsNetworkCard and AwsCredentialsCard instead
export function AwsDetailsCard({ awsData, save }: { awsData: components["schemas"]["MachineProviderAws"], save: (data: components["schemas"]["UpdateMachineProvider"]) => Promise<boolean> }) {
  return (
    <div className="space-y-6">
      <AwsNetworkCard awsData={awsData} />
      <AwsCredentialsCard save={save} />
    </div>
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