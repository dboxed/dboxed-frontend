import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import type { components } from "@/api/models/schema"

type ProviderType = "amazon-s3" | "hetzner" | "generic"

interface S3FormData {
  providerType: ProviderType
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  endpoint: string
  prefix: string
  region: string
}

function detectProviderType(endpoint: string): ProviderType {
  if (endpoint.includes("amazonaws.com")) {
    return "amazon-s3"
  }
  if (endpoint.includes("your-objectstorage.com")) {
    return "hetzner"
  }
  return "generic"
}

function extractRegionFromEndpoint(endpoint: string, providerType: ProviderType): string {
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

function buildEndpoint(providerType: ProviderType, region: string): string {
  switch (providerType) {
    case "amazon-s3":
      return region ? `https://s3.${region}.amazonaws.com` : "https://s3.amazonaws.com"
    case "hetzner":
      return region ? `https://${region}.your-objectstorage.com` : "https://fsn1.your-objectstorage.com"
    case "generic":
      return ""
  }
}

interface S3EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  storageS3: components["schemas"]["VolumeStorageS3"]
  save: (update: components["schemas"]["UpdateVolumeProvider"]) => Promise<boolean>
}

function S3EditDialog({ open, onOpenChange, storageS3, save }: S3EditDialogProps) {
  const client = useDboxedQueryClient()

  // Fetch AWS regions and Hetzner locations
  const awsRegionsQuery = client.useQuery('get', '/v1/machine-provider-info/aws/regions')
  const hetznerLocationsQuery = client.useQuery('get', '/v1/machine-provider-info/hetzner/locations')

  const awsRegions = awsRegionsQuery.data?.items || []
  const hetznerLocations = hetznerLocationsQuery.data?.items || []

  const buildInitial = (): S3FormData => {
    const providerType = detectProviderType(storageS3.endpoint)
    const extractedRegion = extractRegionFromEndpoint(storageS3.endpoint, providerType)

    return {
      providerType,
      accessKeyId: "",
      secretAccessKey: "",
      bucket: storageS3.bucket,
      endpoint: storageS3.endpoint,
      prefix: storageS3.prefix,
      region: extractedRegion || "",
    }
  }

  const handleSave = async (data: S3FormData) => {
    const finalEndpoint = data.providerType === "generic"
      ? data.endpoint
      : buildEndpoint(data.providerType, data.region)

    const updateData: components["schemas"]["UpdateVolumeProvider"] = {
      rustic: {
        storageS3: {
          accessKeyId: data.accessKeyId || undefined,
          secretAccessKey: data.secretAccessKey || undefined,
          bucket: data.bucket || undefined,
          endpoint: finalEndpoint || undefined,
          prefix: data.prefix || undefined,
        },
      },
    }

    return await save(updateData)
  }

  return (
    <SimpleFormDialog<S3FormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Edit S3 Storage Configuration"
      buildInitial={buildInitial}
      onSave={handleSave}
      saveText="Save Changes"
    >
      {(form) => {
        const providerType = form.watch("providerType")

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="providerType"
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
                  name="region"
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
                  name="region"
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
                  name="endpoint"
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

            <FormField
              control={form.control}
              name="accessKeyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Key ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter new access key ID (leave blank to keep current)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secretAccessKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Access Key</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter new secret access key (leave blank to keep current)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bucket"
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

            <FormField
              control={form.control}
              name="prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>S3 Prefix</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter S3 prefix"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )
      }}
    </SimpleFormDialog>
  )
}

interface VolumeStorageS3DetailsCardProps {
  storageS3: components["schemas"]["VolumeStorageS3"]
  save: (update: components["schemas"]["UpdateVolumeProvider"]) => Promise<boolean>
}

export function VolumeStorageS3DetailsCard({ storageS3, save }: VolumeStorageS3DetailsCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>S3 Storage Configuration</CardTitle>
            <CardDescription>
              S3 storage backend configuration for the rustic volume provider.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
          >
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DetailsCardLayout>
          <LabelAndValue
            label="S3 Bucket"
            textValue={storageS3.bucket}
          />

          <LabelAndValue
            label="S3 Endpoint"
            textValue={storageS3.endpoint}
          />

          <LabelAndValue
            label="S3 Prefix"
            textValue={storageS3.prefix}
          />
        </DetailsCardLayout>
      </CardContent>

      <S3EditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        storageS3={storageS3}
        save={save}
      />
    </Card>
  )
}