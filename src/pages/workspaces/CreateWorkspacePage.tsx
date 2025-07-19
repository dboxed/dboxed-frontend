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
import { BasePage } from "@/pages/base/BasePage.tsx";
import { useUnboxedQueryClient } from "@/api/api.ts";
import type { components } from "@/api/models/schema";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Mame must be at least 1 characters.",
  }),
})

export function CreateWorkspacePage() {
  const client = useUnboxedQueryClient()
  const create = client.useMutation('post', '/v1/workspaces')

  const form = useForm<components["schemas"]["CreateWorkspace"]>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(data: components["schemas"]["CreateWorkspace"]) {
    create.mutate({
      body: data,
    })
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <BasePage title={"Create Workspace"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </BasePage>
  )
}
