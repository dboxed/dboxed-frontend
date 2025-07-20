import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { BaseCreatePage } from "@/pages/base/BaseCreatePage.tsx"
import { CloudProviderTypeSelector, AwsConfigForm, HetznerConfigForm, SshKeyForm } from "@/pages/cloud-providers/create/index.ts"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  type: z.enum(["aws", "hetzner"]).refine((val) => val !== undefined, {
    message: "Please select a cloud provider type.",
  }),
  ssh_key_public: z.string().optional(),
  aws: z.object({
    aws_access_key_id: z.string().min(1, "AWS Access Key ID is required"),
    aws_secret_access_key: z.string().min(1, "AWS Secret Access Key is required"),
    region: z.string().min(1, "AWS Region is required"),
    vpc_id: z.string().min(1, "VPC ID is required"),
  }).optional(),
  hetzner: z.object({
    cloud_token: z.string().min(1, "Hetzner Cloud Token is required"),
    hetzner_network_name: z.string().min(1, "Network Name is required"),
    robot_username: z.string().optional(),
    robot_password: z.string().optional(),
  }).optional(),
}).refine((data) => {
  if (data.type === "aws" && !data.aws) {
    return false
  }
  if (data.type === "hetzner" && !data.hetzner) {
    return false
  }
  return true
}, {
  message: "Please configure the selected cloud provider type.",
  path: ["type"]
})

export function CreateCloudProviderPage() {
  const { workspaceId } = useSelectedWorkspaceId()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)

    const submitData: components["schemas"]["CreateCloudProvider"] = {
      name: data.name,
      type: data.type,
    }

    if (data.ssh_key_public) {
      submitData.ssh_key_public = data.ssh_key_public
    }

    if (data.type === "aws" && data.aws) {
      submitData.aws = data.aws
    }

    if (data.type === "hetzner" && data.hetzner) {
      submitData.hetzner = data.hetzner
    }

    return submitData
  }

  return (
    <BaseCreatePage
      title="Create Cloud Provider"
      apiRoute="/v1/workspaces/{workspaceId}/cloud-providers"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      onSubmit={onSubmit}
      defaultValues={{
        name: "",
        type: undefined,
        ssh_key_public: "",
      }}
      resolver={zodResolver(FormSchema)}
    >
      {(form) => (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter cloud provider name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <CloudProviderTypeSelector form={form} />
          <SshKeyForm form={form} />
          
          {form.watch("type") === "aws" && (
            <AwsConfigForm form={form} />
          )}
          
          {form.watch("type") === "hetzner" && (
            <HetznerConfigForm form={form} />
          )}
        </div>
      )}
    </BaseCreatePage>
  )
} 