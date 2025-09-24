import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Key } from "lucide-react"
import type { UseFormReturn } from "react-hook-form";

interface SshKeyFormProps {
  form: UseFormReturn<any>
}

export function SshKeyForm({ form }: SshKeyFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>SSH Key Configuration</span>
        </CardTitle>
        <CardDescription>
          Optionally provide an SSH public key for secure access to your cloud resources.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="sshKeyPublic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SSH Public Key</FormLabel>
              <FormControl>
                <Input
                  placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The public SSH key that will be used for authentication. This is optional but recommended for secure access.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
} 