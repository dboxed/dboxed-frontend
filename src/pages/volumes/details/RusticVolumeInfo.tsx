import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { formatSize } from "@/utils/size.ts"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
import type { components } from "@/api/models/schema"

interface RusticVolumeInfoProps {
  data: components["schemas"]["Volume"]
}

export function RusticVolumeInfo({ data }: RusticVolumeInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rustic Volume Information</CardTitle>
        <CardDescription>
          Filesystem configuration details for this rustic volume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DetailsCardLayout>
          <LabelAndValue
            label="Filesystem Size"
            textValue={data.rustic?.fsSize ? formatSize(data.rustic.fsSize) : 'N/A'}
          />
          <LabelAndValue
            label="Filesystem Type"
            textValue={data.rustic?.fsType || 'N/A'}
          />
        </DetailsCardLayout>
      </CardContent>
    </Card>
  )
}