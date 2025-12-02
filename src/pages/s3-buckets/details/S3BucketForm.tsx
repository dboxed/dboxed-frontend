import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import type { components } from "@/api/models/dboxed-schema"
import type { UseFormReturn, FieldValues, Path } from "react-hook-form"

export type ProviderType = "amazon-s3" | "hetzner" | "generic"

export function detectProviderType(endpoint: string): ProviderType {
  if (endpoint.includes("amazonaws.com")) {
    return "amazon-s3"
  }
  if (endpoint.includes("your-objectstorage.com")) {
    return "hetzner"
  }
  return "generic"
}

export function extractRegionFromEndpoint(endpoint: string, providerType: ProviderType): string {
  switch (providerType) {
    case "amazon-s3": {
      // Extract region from URLs like https://s3.us-east-1.amazonaws.com or https://s3-us-east-1.amazonaws.com
      const match = endpoint.match(/s3[.-]([a-z0-9-]+)\.amazonaws\.com/)
      return match ? match[1] : ""
    }
    case "hetzner": {
      // Extract location from URLs like https://fsn1.your-objectstorage.com
      const match = endpoint.match(/https?:\/\/([a-z0-9]+)\.your-objectstorage\.com/)
      return match ? match[1] : ""
    }
    case "generic":
      return ""
  }
}

export function buildEndpoint(providerType: ProviderType, region: string): string {
  switch (providerType) {
    case "amazon-s3":
      return region ? `https://s3.${region}.amazonaws.com` : "https://s3.amazonaws.com"
    case "hetzner":
      return region ? `https://${region}.your-objectstorage.com` : "https://fsn1.your-objectstorage.com"
    case "generic":
      return ""
  }
}

interface S3StorageFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  fieldPrefix?: string
  showProviderTypeSelector?: boolean
  showPrefixField?: boolean
  accessKeyPlaceholder?: string
  secretAccessKeyPlaceholder?: string
}

export function S3BucketForm<TFieldValues extends FieldValues>({
  form,
  fieldPrefix = "",
  showProviderTypeSelector = true,
  showPrefixField = true,
  accessKeyPlaceholder = "Enter S3 Access Key ID",
  secretAccessKeyPlaceholder = "Enter S3 Secret Access Key"
}: S3StorageFormProps<TFieldValues>) {
  const client = useDboxedQueryClient()

  // Fetch AWS regions and Hetzner locations
  const awsRegionsQuery = client.useQuery('get', '/v1/machine-provider-info/aws/regions')
  const hetznerLocationsQuery = client.useQuery('get', '/v1/machine-provider-info/hetzner/locations')

  const awsRegions = awsRegionsQuery.data?.items || []
  const hetznerLocations = hetznerLocationsQuery.data?.items || []

  const getFieldName = (field: string): Path<TFieldValues> => {
    return (fieldPrefix + field) as Path<TFieldValues>
  }

  const providerType = showProviderTypeSelector ? (form.watch(getFieldName("providerType")) as ProviderType) : ("generic" as ProviderType)

  return (
    <div className="space-y-4">
      {showProviderTypeSelector && (
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={getFieldName("providerType")}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Provider Type</FormLabel>
                <Select {...field} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select provider type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="amazon-s3">Amazon S3</SelectItem>
                    <SelectItem value="hetzner">Hetzner</SelectItem>
                    <SelectItem value="generic">Generic</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {providerType === "amazon-s3" && (
            <FormField
              control={form.control}
              name={getFieldName("region")}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>AWS Region</FormLabel>
                  <Select {...field} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select AWS region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {awsRegionsQuery.isLoading ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">Loading regions...</div>
                      ) : awsRegions.length > 0 ? (
                        awsRegions.map((region: components["schemas"]["AwsRegion"]) => (
                          <SelectItem key={region.RegionName} value={region.RegionName}>
                            {region.RegionName}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">No regions available</div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {providerType === "hetzner" && (
            <FormField
              control={form.control}
              name={getFieldName("region")}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Hetzner Location</FormLabel>
                  <Select {...field} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Hetzner location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hetznerLocationsQuery.isLoading ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">Loading locations...</div>
                      ) : hetznerLocations.length > 0 ? (
                        hetznerLocations.map((location: components["schemas"]["HetznerLocation"]) => (
                          <SelectItem key={location.name} value={location.name}>
                            {location.description} ({location.city}, {location.country})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">No locations available</div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {providerType === "generic" && (
            <FormField
              control={form.control}
              name={getFieldName("endpoint")}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Endpoint</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter S3 endpoint"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      )}

      <FormField
        control={form.control}
        name={getFieldName("accessKeyId")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Access Key ID</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder={accessKeyPlaceholder}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={getFieldName("secretAccessKey")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Secret Access Key</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                placeholder={secretAccessKeyPlaceholder}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={getFieldName("bucket")}
        render={({ field }) => (
          <FormItem>
            <FormLabel>S3 Bucket</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Enter bucket name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {!showProviderTypeSelector && (
        <FormField
          control={form.control}
          name={getFieldName("endpoint")}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endpoint</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter S3 endpoint URL"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {showPrefixField && (
        <FormField
          control={form.control}
          name={getFieldName("prefix")}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prefix</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter S3 prefix (optional)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
