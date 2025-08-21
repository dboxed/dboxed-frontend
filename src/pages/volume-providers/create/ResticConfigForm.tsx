import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import type { UseFormReturn } from "react-hook-form"

interface ResticConfigFormProps {
  form: UseFormReturn<any>
}

export function ResticConfigForm({ form }: ResticConfigFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Restic Configuration</CardTitle>
        <CardDescription>
          Configure the Restic backup repository settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="restic.repository"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter repository URL or path (e.g., s3:bucket/path)" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="restic.s3_access_key_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>S3 Access Key ID (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter S3 access key ID" 
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
          name="restic.s3_secret_access_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>S3 Secret Access Key (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="password"
                  placeholder="Enter S3 secret access key" 
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
          name="restic.ssh_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SSH Key (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter SSH private key for repository access" 
                  className="min-h-[100px]"
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}