import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { ScrollText } from "lucide-react"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
import { ReconcileLogsDialog } from "./status/ReconcileLogsDialog.tsx"
import { TimeAgo } from "@/components/TimeAgo.tsx"
import { BoxStatusBadge } from "@/pages/boxes/details/status/BoxStatusBadge.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { ContainersCard } from "./ContainersCard.tsx"

interface GeneralInfoCardProps {
  box: components["schemas"]["Box"]
}

export function GeneralInfoCard({ box }: GeneralInfoCardProps) {
  const [showReconcileLogs, setShowReconcileLogs] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>
              Basic box details and configuration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DetailsCardLayout>
              <LabelAndValue
                label="Name"
                textValue={box.name}
              />

              <LabelAndValue
                label="Type"
                value={
                  <Badge variant="secondary" className="capitalize">
                    {box.boxType}
                  </Badge>
                }
              />

              <LabelAndValue
                label="Network"
                value={
                  <ReferenceLabel
                    resourceId={box.network}
                    resourcePath="/v1/workspaces/{workspaceId}/networks/{id}"
                    pathParams={{
                      workspaceId: box.workspace,
                      id: box.network
                    }}
                    detailsUrl={`/workspaces/${box.workspace}/networks/${box.network}`}
                    fallbackLabel="Network"
                  />
                }
              />

              <LabelAndValue
                label="Machine"
                value={
                  box.machine ? (
                    <ReferenceLabel
                      resourceId={box.machine}
                      resourcePath="/v1/workspaces/{workspaceId}/machines/{id}"
                      pathParams={{
                        workspaceId: box.workspace,
                        id: box.machine
                      }}
                      detailsUrl={`/workspaces/${box.workspace}/machines/${box.machine}`}
                      fallbackLabel="Machine"
                    />
                  ) : (
                    <span className="text-muted-foreground">No machine assigned</span>
                  )
                }
              />

              <LabelAndValue
                label="Created"
                value={<TimeAgo date={box.createdAt} />}
              />
            </DetailsCardLayout>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sandbox Status</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReconcileLogs(true)}
                    >
                      <ScrollText className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View sandbox logs</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <DetailsCardLayout>
              <LabelAndValue
                label="Desired State"
                value={
                  <Badge variant={box.desiredState === 'up' ? 'default' : 'outline'} className="capitalize">
                    {box.desiredState}
                  </Badge>
                }
              />

              <LabelAndValue
                label="Status"
                value={
                  <div className="flex items-center gap-2">
                    <BoxStatusBadge box={box} />
                  </div>
                }
              />

              {box.sandboxStatus?.startTime && (
                <LabelAndValue
                  label="Started"
                  value={<TimeAgo date={box.sandboxStatus?.startTime} />}
                />
              )}

              {box.sandboxStatus?.stopTime && (
                <LabelAndValue
                  label="Stopped"
                  value={<TimeAgo date={box.sandboxStatus?.stopTime} />}
                />
              )}
            </DetailsCardLayout>
          </CardContent>
        </Card>
      </div>

      <ContainersCard box={box} />

      <ReconcileLogsDialog
        boxId={box.id}
        open={showReconcileLogs}
        onOpenChange={setShowReconcileLogs}
      />
    </div>
  )
} 