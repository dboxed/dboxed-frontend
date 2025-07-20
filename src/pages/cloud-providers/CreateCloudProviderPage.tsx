"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BasePage } from "@/pages/base/BasePage.tsx"
import { useUnboxedQueryClient } from "@/api/api.ts"
import { useNavigate } from "react-router"

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  type: z.enum(["aws", "hetzner"], {
    required_error: "Please select a cloud provider type.",
  }),
  ssh_key_public: z.string().optional(),
  aws: z.object({
    aws_access_key_id: z.string().min(1, {
      message: "AWS Access Key ID is required.",
    }),
    aws_secret_access_key: z.string().min(1, {
      message: "AWS Secret Access Key is required.",
    }),
    region: z.string().min(1, {
      message: "AWS Region is required.",
    }),
    vpc_id: z.string().min(1, {
      message: "VPC ID is required.",
    }),
  }).optional(),
  hetzner: z.object({
    cloud_token: z.string().min(1, {
      message: "Hetzner Cloud Token is required.",
    }),
    hetzner_network_name: z.string().min(1, {
      message: "Hetzner Network Name is required.",
    }),
    robot_password: z.string().optional(),
    robot_username: z.string().optional(),
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
  message: "Provider-specific configuration is required.",
  path: ["type"],
})

interface CreateCloudProviderPageProps {
  workspaceId: number
}

export function CreateCloudProviderPage({ workspaceId }: CreateCloudProviderPageProps) {
  const client = useUnboxedQueryClient()
  const navigate = useNavigate()
  const create = client.useMutation('post', '/v1/workspaces/{workspaceId}/cloud-providers')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      type: undefined,
      ssh_key_public: "",
    },
  })

  const watchType = form.watch("type")

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Remove the provider-specific data that doesn't match the selected type
    const submitData = {
      name: data.name,
      type: data.type,
      ssh_key_public: data.ssh_key_public,
      ...(data.type === "aws" ? { aws: data.aws } : {}),
      ...(data.type === "hetzner" ? { hetzner: data.hetzner } : {}),
    }

    create.mutate({
      params: {
        path: {
          workspaceId: workspaceId,
        },
      },
      body: submitData,
    }, {
      onSuccess: () => {
        toast.success("Cloud provider created successfully!")
        navigate(`/workspaces/${workspaceId}/cloud-providers`)
      },
      onError: (error) => {
        toast.error("Failed to create cloud provider", {
          description: error.message || "An error occurred while creating the cloud provider."
        })
      }
    })
  }

  return (
    <BasePage title="Create Cloud Provider">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter cloud provider name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of the cloud provider configuration.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cloud Provider Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cloud provider type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="aws">AWS</SelectItem>
                    <SelectItem value="hetzner">Hetzner</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the cloud provider you want to configure.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ssh_key_public"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SSH Public Key (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter SSH public key" 
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  SSH public key for accessing cloud resources.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchType === "aws" && (
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="text-lg font-medium">AWS Configuration</h3>
              
              <FormField
                control={form.control}
                name="aws.aws_access_key_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AWS Access Key ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter AWS Access Key ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aws.aws_secret_access_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AWS Secret Access Key</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter AWS Secret Access Key" 
                        {...field} 
                      />
                    </FormControl>
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
                      <Input placeholder="e.g., us-east-1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aws.vpc_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VPC ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter VPC ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {watchType === "hetzner" && (
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="text-lg font-medium">Hetzner Configuration</h3>
              
              <FormField
                control={form.control}
                name="hetzner.cloud_token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hetzner Cloud Token</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter Hetzner Cloud Token" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hetzner.hetzner_network_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hetzner Network Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Hetzner Network Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hetzner.robot_username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Robot Username (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter Robot Username" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hetzner.robot_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Robot Password (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter Robot Password" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Creating..." : "Create Cloud Provider"}
          </Button>
        </form>
      </Form>
    </BasePage>
  )
} 