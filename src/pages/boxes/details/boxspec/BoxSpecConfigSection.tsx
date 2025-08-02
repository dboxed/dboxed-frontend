import { Card, CardContent } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { type UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"

interface BoxSpecConfigSectionProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>
  onEditYaml: () => void
}

export function BoxSpecConfigSection({ form, onEditYaml }: BoxSpecConfigSectionProps) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-6">
        {/* General Configuration */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">General</h3>
            <Button 
              variant="outline" 
              onClick={onEditYaml}
              type="button"
            >
              Edit as YAML
            </Button>
          </div>
          <FormField
            control={form.control}
            name="boxSpec.infraImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Infrastructure Image</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter infrastructure image URL"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* DNS Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">DNS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="boxSpec.dns.hostname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hostname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter hostname"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="boxSpec.dns.networkDomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network Domain</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter network domain"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="boxSpec.dns.networkInterface"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network Interface</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter network interface (e.g., eth0)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}