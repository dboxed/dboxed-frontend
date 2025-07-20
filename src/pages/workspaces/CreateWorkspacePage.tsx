
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { BaseCreatePage } from "@/pages/base/BaseCreatePage"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }),
})

export function CreateWorkspacePage() {
  const { setWorkspaceId } = useSelectedWorkspaceId()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    return data
  }

  return (
    <BaseCreatePage
      title="Create Workspace"
      apiRoute="/v1/workspaces"
      onSubmit={onSubmit}
      onSuccess={(data) => {
        setWorkspaceId(data.id)
      }}
      defaultValues={{
        name: "",
      }}
      resolver={zodResolver(FormSchema)}
    >
      {(form) => (
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Please enter the name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of the workspace.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </BaseCreatePage>
  )
}
