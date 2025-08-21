import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import type { components } from "@/api/models/schema";
import type { UseFormReturn } from "react-hook-form"

interface ResticDetailsCardProps {
  resticData: components["schemas"]["VolumeProviderRestic"]
  form: UseFormReturn<any>
}

export function ResticDetailsCard({ resticData, form }: ResticDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Restic Configuration</CardTitle>
        <CardDescription>
          Restic backup repository configuration settings. Sensitive credentials are not displayed for security reasons.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-sm font-medium">Repository</span>
          <span className="col-span-2 text-sm font-mono break-all">{resticData.repository}</span>
        </div>
        
        <FormField
          control={form.control}
          name="restic.s3_access_key_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>S3 Access Key ID</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter S3 access key ID (leave blank to keep current)" 
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
              <FormLabel>S3 Secret Access Key</FormLabel>
              <FormControl>
                <Input 
                  type="password"
                  placeholder="Enter S3 secret access key (leave blank to keep current)" 
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
              <FormLabel>SSH Key</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter SSH private key for repository access (leave blank to keep current)" 
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