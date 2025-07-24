import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { BaseCreatePage } from "@/pages/base/BaseCreatePage.tsx"
import { NetworkTypeSelector, NetbirdConfigForm } from "@/pages/networks/create/index.ts"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  type: z.enum(["netbird"]).refine((val) => val !== undefined, {
    message: "Please select a network type.",
  }),
  netbird: z.object({
    netbirdVersion: z.string().optional().default("latest"),
    apiUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    apiAccessToken: z.string().optional(),
  }).optional(),
}).refine((data) => {
  if (data.type === "netbird" && !data.netbird) {
    return false
  }
  return true
}, {
  message: "Please configure the selected network type.",
  path: ["type"]
})

export function CreateNetworkPage() {
  const { workspaceId } = useSelectedWorkspaceId()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const submitData: components["schemas"]["CreateNetwork"] = {
      name: data.name,
      type: data.type,
    }

    if (data.type === "netbird") {
      const netbirdConfig: components["schemas"]["CreateNetworkNetbird"] = {
        netbirdVersion: data.netbird?.netbirdVersion || "",
      }

      if (data.netbird) {
        if (data.netbird.apiUrl && data.netbird.apiUrl.trim() !== "") {
          netbirdConfig.apiUrl = data.netbird.apiUrl
        }

        if (data.netbird.apiAccessToken && data.netbird.apiAccessToken.trim() !== "") {
          netbirdConfig.apiAccessToken = data.netbird.apiAccessToken
        }
      }
      
      submitData.netbird = netbirdConfig
    }

    return submitData
  }

  return (
    <BaseCreatePage
      title="Create Network"
      apiRoute="/v1/workspaces/{workspaceId}/networks"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      onSubmit={onSubmit}
      defaultValues={{
        name: "",
        type: undefined,
        netbird: {
          netbirdVersion: "latest",
          apiUrl: "",
          apiAccessToken: "",
        },
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
                  <Input placeholder="Enter network name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <NetworkTypeSelector form={form} />
          
          {form.watch("type") === "netbird" && (
            <NetbirdConfigForm form={form} />
          )}
        </div>
      )}
    </BaseCreatePage>
  )
} 