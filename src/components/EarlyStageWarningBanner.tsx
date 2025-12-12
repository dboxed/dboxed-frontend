import { AlertTriangle } from "lucide-react"

export function EarlyStageWarningBanner() {
  const isTestInstance = window.location.hostname === "app.test.dboxed.io"

  return (
    <div className="flex items-center gap-2 text-destructive">
      <AlertTriangle className="h-4 w-4" />
      <span className="text-xs">
        <strong>Dboxed is currently in a very early stage.</strong>{" "}
        {isTestInstance && (
          <>
            This is a test instance of Dboxed Cloud.
            All workloads that you define here may be wiped at any time.{" "}
          </>
        )}
        Breaking changes might be introduced at any time.
      </span>
    </div>
  )
}
