import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import type { components } from "@/api/models/schema";
import type { UseFormReturn } from "react-hook-form"

interface DboxedDetailsCardProps {
  dboxedData: components["schemas"]["VolumeProviderDboxed"]
  form: UseFormReturn<any>
}

export function DboxedDetailsCard({ dboxedData, form }: DboxedDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DBoxed Configuration</CardTitle>
        <CardDescription>
          DBoxed volume provider configuration settings. Sensitive credentials are not displayed for security reasons.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">API URL</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {dboxedData.api_url}
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium">Repository ID</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {dboxedData.repository_id}
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="dboxed.api_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter DBoxed API URL (leave blank to keep current)" 
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
          name="dboxed.repository_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository ID</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Enter repository ID (leave blank to keep current)" 
                  {...field} 
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dboxed.token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token</FormLabel>
              <FormControl>
                <Input 
                  type="password"
                  placeholder="Enter DBoxed API token (leave blank to keep current)" 
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