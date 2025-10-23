import { Alert, AlertDescription } from "@/components/ui/alert.tsx"
import { AlertTriangle } from "lucide-react"

export function EarlyStageWarningBanner() {
  const isTestInstance = window.location.hostname === "app.test.dboxed.io"

  return (
    <Alert variant="destructive" className="rounded-none border-x-0 border-0">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Dboxed is currently in a very early stage.</strong>{" "}
        {isTestInstance && (
          <>
            This is a test instance of Dboxed Cloud.
            All workloads that you define here may be wiped at any time.{" "}
          </>
        )}
        Breaking changes might be introduced at any time.
      </AlertDescription>
    </Alert>
  )
}
