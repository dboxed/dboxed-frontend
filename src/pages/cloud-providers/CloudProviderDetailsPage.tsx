"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useNavigate } from "react-router"
import { ArrowLeft, Save, Trash2 } from "lucide-react"

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
import { BasePage } from "@/pages/base/BasePage.tsx"
import { useUnboxedQueryClient } from "@/api/api.ts"

// Define the UpdateCloudProvider schema based on the API
const UpdateCloudProviderSchema = z.object({
  ssh_key_public: z.string().nullable(),
  aws: z.object({
    aws_access_key_id: z.string().nullable(),
    aws_secret_access_key: z.string().nullable(),
  }).optional(),
  hetzner: z.object({
    cloud_token: z.string().nullable(),
    robot_password: z.string().nullable(),
    robot_username: z.string().nullable(),
    robot_vswitch_id: z.number().nullable(),
  }).optional(),
})

interface CloudProviderDetailsPageProps {
  workspaceId: number
  cloudProviderId: number
}

export function CloudProviderDetailsPage({ workspaceId, cloudProviderId }: CloudProviderDetailsPageProps) {
  const client = useUnboxedQueryClient()
  const navigate = useNavigate()
  
  // Fetch cloud provider details
  const cloudProvider = client.useQuery('get', '/v1/workspaces/{workspaceId}/cloud-providers/{id}', {
    params: {
      path: {
        workspaceId: workspaceId,
        id: cloudProviderId,
      }
    }
  })

  // Update mutation
  const update = client.useMutation('patch', '/v1/workspaces/{workspaceId}/cloud-providers/{id}')
  
  // Delete mutation
  const deleteProvider = client.useMutation('delete', '/v1/workspaces/{workspaceId}/cloud-providers/{id}')

  const form = useForm<z.infer<typeof UpdateCloudProviderSchema>>({
    resolver: zodResolver(UpdateCloudProviderSchema),
    defaultValues: {
      ssh_key_public: "",
      aws: {
        aws_access_key_id: "",
        aws_secret_access_key: "",
      },
      hetzner: {
        cloud_token: "",
        robot_password: "",
        robot_username: "",
        robot_vswitch_id: null,
      },
    },
  })

  // Update form values when data is loaded
  React.useEffect(() => {
    if (cloudProvider.data) {
      const data = cloudProvider.data
      form.reset({
        ssh_key_public: data.ssh_key_fingerprint || "",
        aws: data.aws ? {
          aws_access_key_id: "",
          aws_secret_access_key: "",
        } : undefined,
        hetzner: data.hetzner ? {
          cloud_token: "",
          robot_password: "",
          robot_username: "",
          robot_vswitch_id: data.hetzner.robot_vswitch_id,
        } : undefined,
      })
    }
  }, [cloudProvider.data, form])

  function onSubmit(data: z.infer<typeof UpdateCloudProviderSchema>) {
    // Only include fields that have values
    const submitData: any = {}
    
    if (data.ssh_key_public !== "") {
      submitData.ssh_key_public = data.ssh_key_public
    }
    
    if (data.aws) {
      const awsData: any = {}
      if (data.aws.aws_access_key_id !== "") {
        awsData.aws_access_key_id = data.aws.aws_access_key_id
      }
      if (data.aws.aws_secret_access_key !== "") {
        awsData.aws_secret_access_key = data.aws.aws_secret_access_key
      }
      if (Object.keys(awsData).length > 0) {
        submitData.aws = awsData
      }
    }
    
    if (data.hetzner) {
      const hetznerData: any = {}
      if (data.hetzner.cloud_token !== "") {
        hetznerData.cloud_token = data.hetzner.cloud_token
      }
      if (data.hetzner.robot_password !== "") {
        hetznerData.robot_password = data.hetzner.robot_password
      }
      if (data.hetzner.robot_username !== "") {
        hetznerData.robot_username = data.hetzner.robot_username
      }
      if (data.hetzner.robot_vswitch_id !== null) {
        hetznerData.robot_vswitch_id = data.hetzner.robot_vswitch_id
      }
      if (Object.keys(hetznerData).length > 0) {
        submitData.hetzner = hetznerData
      }
    }

    update.mutate({
      params: {
        path: {
          workspaceId: workspaceId,
          id: cloudProviderId,
        },
      },
      body: submitData,
    }, {
      onSuccess: () => {
        toast.success("Cloud provider updated successfully!")
        cloudProvider.refetch()
      },
      onError: (error) => {
        toast.error("Failed to update cloud provider", {
          description: error.message || "An error occurred while updating the cloud provider."
        })
      }
    })
  }

  function handleDelete() {
    if (confirm("Are you sure you want to delete this cloud provider? This action cannot be undone.")) {
      deleteProvider.mutate({
        params: {
          path: {
            workspaceId: workspaceId,
            id: cloudProviderId,
          },
        },
      }, {
        onSuccess: () => {
          toast.success("Cloud provider deleted successfully!")
          navigate(`/workspaces/${workspaceId}/cloud-providers`)
        },
        onError: (error) => {
          toast.error("Failed to delete cloud provider", {
            description: error.message || "An error occurred while deleting the cloud provider."
          })
        }
      })
    }
  }

  if (cloudProvider.isLoading) {
    return (
      <BasePage title="Cloud Provider Details">
        <div className="text-muted-foreground">Loading cloud provider details...</div>
      </BasePage>
    )
  }

  if (cloudProvider.error) {
    return (
      <BasePage title="Cloud Provider Details">
        <div className="text-red-600">Failed to load cloud provider details</div>
      </BasePage>
    )
  }

  const data = cloudProvider.data

  return (
    <BasePage title={`${data.name} - Cloud Provider Details`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/workspaces/${workspaceId}/cloud-providers`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cloud Providers
          </Button>
          <h2 className="text-2xl font-bold">{data.name}</h2>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground capitalize">
            {data.type}
          </span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleteProvider.isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {deleteProvider.isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Read-only information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Cloud Provider Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">ID:</span>
              <span className="ml-2">{data.id}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Status:</span>
              <span className="ml-2 capitalize">{data.status}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Created:</span>
              <span className="ml-2">
                {new Date(data.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">SSH Key Fingerprint:</span>
              <span className="ml-2 font-mono text-xs">
                {data.ssh_key_fingerprint || "Not configured"}
              </span>
            </div>
          </div>
        </div>

        {/* Editable form */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Edit Configuration</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ssh_key_public"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SSH Public Key</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter new SSH public key (leave empty to keep current)" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Update the SSH public key for accessing cloud resources. Leave empty to keep the current key.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {data.type === "aws" && data.aws && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h4 className="text-md font-medium">AWS Configuration</h4>
                  
                  <FormField
                    control={form.control}
                    name="aws.aws_access_key_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AWS Access Key ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter new AWS Access Key ID (leave empty to keep current)" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Update the AWS Access Key ID. Leave empty to keep the current value.
                        </FormDescription>
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
                            placeholder="Enter new AWS Secret Access Key (leave empty to keep current)" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Update the AWS Secret Access Key. Leave empty to keep the current value.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Read-only AWS information */}
                  <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                    <div>
                      <span className="font-medium text-muted-foreground">Region:</span>
                      <span className="ml-2">{data.aws.region}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">VPC ID:</span>
                      <span className="ml-2">{data.aws.vpc_id || "Not configured"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">VPC Name:</span>
                      <span className="ml-2">{data.aws.vpc_name || "Not configured"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Security Group ID:</span>
                      <span className="ml-2">{data.aws.security_group_id || "Not configured"}</span>
                    </div>
                  </div>
                </div>
              )}

              {data.type === "hetzner" && data.hetzner && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h4 className="text-md font-medium">Hetzner Configuration</h4>
                  
                  <FormField
                    control={form.control}
                    name="hetzner.cloud_token"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hetzner Cloud Token</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Enter new Hetzner Cloud Token (leave empty to keep current)" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Update the Hetzner Cloud Token. Leave empty to keep the current value.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hetzner.robot_username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Robot Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter new Robot Username (leave empty to keep current)" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Update the Robot Username. Leave empty to keep the current value.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hetzner.robot_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Robot Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Enter new Robot Password (leave empty to keep current)" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Update the Robot Password. Leave empty to keep the current value.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hetzner.robot_vswitch_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Robot VSwitch ID</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="Enter new Robot VSwitch ID (leave empty to keep current)" 
                            {...field} 
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(value === "" ? null : parseInt(value))
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Update the Robot VSwitch ID. Leave empty to keep the current value.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Read-only Hetzner information */}
                  <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                    <div>
                      <span className="font-medium text-muted-foreground">Network Name:</span>
                      <span className="ml-2">{data.hetzner.hetzner_network_name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Network Zone:</span>
                      <span className="ml-2">{data.hetzner.hetzner_network_zone || "Not configured"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Network ID:</span>
                      <span className="ml-2">{data.hetzner.hetzner_network_id || "Not configured"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Cloud Subnet CIDR:</span>
                      <span className="ml-2">{data.hetzner.cloud_subnet_cidr || "Not configured"}</span>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" disabled={update.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {update.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </BasePage>
  )
} 