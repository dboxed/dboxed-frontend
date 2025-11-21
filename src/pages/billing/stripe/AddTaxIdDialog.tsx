import { SimpleFormDialog } from "@/components/SimpleFormDialog";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TAX_ID_TYPES } from "./taxIdTypes";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { uniqBy } from "@/utils/utils.ts";

interface AddTaxIdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: { type: string; value: string }) => Promise<boolean>;
  isLoading: boolean;
  country?: string;
}

export function AddTaxIdDialog({
  open,
  onOpenChange,
  onSave,
  isLoading,
  country,
}: AddTaxIdDialogProps) {
  const [filterByCountry, setFilterByCountry] = useState(true);
  const taxIdTypes2 = TAX_ID_TYPES.filter(t => {
    if (filterByCountry && country) {
      return t.country === country
    }
    return true
  })
  const taxIdTypes = uniqBy(taxIdTypes2, v => v.type)
    .sort((a, b) => a.type.localeCompare(b.type))
  return (
    <SimpleFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Tax ID"
      buildInitial={() => ({ type: taxIdTypes[0]?.type || "", value: "" })}
      onSave={onSave}
      saveText="Add"
      isLoading={isLoading}
    >
      {(form) => (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID Type</FormLabel>
                <div className="flex items-center gap-2">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tax ID type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taxIdTypes.map((taxIdType, i) => (
                        <SelectItem key={i} value={taxIdType.type}>
                          <div className="flex flex-col">
                            <span className="font-medium">{taxIdType.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {taxIdType.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {country && (
                    <div className="flex items-center space-x-2 whitespace-nowrap">
                      <Checkbox
                        id="filter-by-country"
                        checked={filterByCountry}
                        onCheckedChange={(checked) => setFilterByCountry(checked === true)}
                      />
                      <Label
                        htmlFor="filter-by-country"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Filter by your country ({country})
                      </Label>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID Value</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter tax ID" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </SimpleFormDialog>
  );
}
