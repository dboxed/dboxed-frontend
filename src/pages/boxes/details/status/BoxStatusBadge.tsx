import { formatTimeAgo } from "@/utils/time.ts";
import { StatusBadge } from "@/components/StatusBadge.tsx";
import type { components } from "@/api/models/schema";

interface SandboxStatusBadgeProps {
  box: components["schemas"]["Box"]
}

export function BoxStatusBadge({ box }: SandboxStatusBadgeProps) {
  const statusTime = box.sandboxStatus?.statusTime
  const isStale = box.status === "Stale"

  const tooltip = box.status === "Stale" ? <div className="text-sm space-y-2">
    {isStale ? (
      <>
        {statusTime ? (
          <p>
            Box status was updated {formatTimeAgo(statusTime)} and looks stale.
          </p>
        ) : (
          <p>
            Status has never been sent.
          </p>
        )}
        <p>
          Automatic starting of sandboxes for the box is not implemented yet. This will come in a future release
          of dboxed.
        </p>
        <p>
          This means you might need to manually run <code
          className="px-1.5 py-0.5 rounded bg-gray-50/30 font-mono text-xs">dboxed sandbox run
          ...</code> yourself.
        </p>
        <p>
          Check the <strong>Connect Box</strong> tab for details.
        </p>
      </>
    ) : (
      <>
        {statusTime && (
          <p>
            Last updated {formatTimeAgo(statusTime)}
          </p>
        )}
      </>
    )}
  </div> : undefined

  return <StatusBadge item={box} tooltip={tooltip}/>
}
