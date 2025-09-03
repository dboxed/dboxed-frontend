import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { formatSize } from "@/utils/size.ts"
import type { components } from "@/api/models/schema"

interface DboxedVolumeInfoProps {
  data: components["schemas"]["Volume"]
}

export function DboxedVolumeInfo({ data }: DboxedVolumeInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DBoxed Volume Information</CardTitle>
        <CardDescription>
          Filesystem configuration details for this DBoxed volume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Filesystem Size</label>
            <p className="text-sm text-muted-foreground">
              {data.dboxed?.fs_size ? formatSize(data.dboxed.fs_size) : 'N/A'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Filesystem Type</label>
            <p className="text-sm text-muted-foreground">{data.dboxed?.fs_type || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}