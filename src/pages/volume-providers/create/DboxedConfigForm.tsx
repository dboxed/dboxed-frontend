import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import type { UseFormReturn } from "react-hook-form"

interface DboxedConfigFormProps {
  form: UseFormReturn<any>
}

export function DboxedConfigForm({ form }: DboxedConfigFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DBoxed Configuration</CardTitle>
        <CardDescription>
          Configure the DBoxed volume provider settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="dboxed.api_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter DBoxed API URL" 
                  {...field} 
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
                  placeholder="Enter repository ID" 
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
                  placeholder="Enter DBoxed API token" 
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