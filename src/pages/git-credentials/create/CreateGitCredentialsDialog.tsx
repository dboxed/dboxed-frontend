import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { useWatch, type UseFormReturn } from "react-hook-form"

interface CreateGitCredentialsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type CreateGitCredentialsForm = UseFormReturn<components["schemas"]["CreateGitCredentials"]>

function CreateGitCredentialsFormContent({ form }: { form: CreateGitCredentialsForm }) {
  const credentialsType = useWatch({ control: form.control, name: "credentialsType" })

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="host"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Host</FormLabel>
            <FormControl>
              <Input placeholder="github.com" autoCapitalize="off" {...field} />
            </FormControl>
            <FormDescription>
              The git host (e.g., github.com, gitlab.com)
            </FormDescription>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pathGlob"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Path Glob</FormLabel>
            <FormControl>
              <Input placeholder="organization/" autoCapitalize="off" {...field} />
            </FormControl>
            <FormDescription>
              Optional path glob to match (e.g., myorg/*)
            </FormDescription>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="credentialsType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Credentials Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select credentials type"/>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="basic-auth">Basic (Username/Password)</SelectItem>
                <SelectItem value="ssh-key">SSH Key</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Username or token name" autoCapitalize="off" {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      {credentialsType === "basic-auth" && (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password / Token</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password or personal access token" {...field} />
              </FormControl>
              <FormDescription>
                For GitHub, use a personal access token instead of your password
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
      )}

      {credentialsType === "ssh-key" && (
        <FormField
          control={form.control}
          name="sshKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SSH Private Key</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="-----BEGIN OPENSSH PRIVATE KEY-----&#10;...&#10;-----END OPENSSH PRIVATE KEY-----"
                  className="font-mono text-sm h-40"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your SSH private key for authentication
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
      )}
    </div>
  )
}

export function CreateGitCredentialsDialog({ open, onOpenChange }: CreateGitCredentialsDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  const handleSubmit = (data: components["schemas"]["CreateGitCredentials"]) => {
    if (data.credentialsType === "basic-auth") {
      data.sshKey = undefined
    } else if (data.credentialsType === "ssh-key") {
      data.password = undefined
    }
    return data
  }

  return (
    <BaseCreateDialog<components["schemas"]["CreateGitCredentials"]>
      open={open}
      onOpenChange={onOpenChange}
      title="Create Git Credentials"
      apiRoute="/v1/workspaces/{workspaceId}/git-credentials"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{
        host: "",
        pathGlob: "",
        credentialsType: "basic-auth",
        username: "",
        password: "",
        sshKey: "",
      }}
      onSubmit={handleSubmit}
    >
      {(form) => <CreateGitCredentialsFormContent form={form}/>}
    </BaseCreateDialog>
  )
}
