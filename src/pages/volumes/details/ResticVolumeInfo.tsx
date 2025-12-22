import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { formatSize } from "@/utils/size.ts"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
import type { components } from "@/api/models/dboxed-schema"

interface ResticVolumeInfoProps {
  data: components["schemas"]["Volume"]
}

export function ResticVolumeInfo({ data }: ResticVolumeInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Restic Volume Information</CardTitle>
        <CardDescription>
          Filesystem configuration details for this restic volume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DetailsCardLayout>
          <LabelAndValue
            label="Filesystem Size"
            textValue={data.restic?.fsSize ? formatSize(data.restic.fsSize) : 'N/A'}
          />
          <LabelAndValue
            label="Filesystem Type"
            textValue={data.restic?.fsType || 'N/A'}
          />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
}