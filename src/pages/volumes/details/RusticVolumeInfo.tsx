import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { formatSize } from "@/utils/size.ts"
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
            <label className="text-sm font-medium">Filesystem Size</label>
            <p className="text-sm text-muted-foreground">
              {data.rustic?.fsSize ? formatSize(data.rustic.fsSize) : 'N/A'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Filesystem Type</label>
            <p className="text-sm text-muted-foreground">{data.rustic?.fsType || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}