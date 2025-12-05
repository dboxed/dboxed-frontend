import { formatTimeAgo } from "@/utils/time.ts";
import { StatusBadge } from "@/components/StatusBadge.tsx";
import type { components } from "@/api/models/dboxed-schema";

interface MachineStatusBadgeProps {
  machine: components["schemas"]["Machine"]
}

export function MachineStatusBadge({ machine }: MachineStatusBadgeProps) {
  const statusTime = machine.runStatus?.statusTime
  const isStale = machine.status === "Stale"

  const tooltip = machine.status === "Stale" ? <div className="text-sm space-y-2">
    {isStale ? (
      <>
        {statusTime ? (
          <p>
            Machine status was updated {formatTimeAgo(statusTime)} and looks stale.
          </p>
        ) : (
          <p>
            Status has never been sent.
          </p>
        )}
        <p>
          The machine may be offline or the dboxed agent may not be running.
        </p>
        <p>
          Check the <strong>Connect</strong> tab for details on how to connect the machine.
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

  return <StatusBadge item={machine} tooltip={tooltip}/>
}
