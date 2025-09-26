import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { formatSize } from "@/utils/size.ts"
import { Label } from "@/components/ui/label.tsx"
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
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Filesystem Size</Label>
            <p className="text-sm text-muted-foreground">
              {data.rustic?.fsSize ? formatSize(data.rustic.fsSize) : 'N/A'}
            </p>
          </div>
          <div>
            <Label>Filesystem Type</Label>
            <p className="text-sm text-muted-foreground">{data.rustic?.fsType || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}