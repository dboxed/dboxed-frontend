import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { useDboxedCloudQueryClient } from "@/api/dboxed-cloud-api.ts";
import { DataTable } from "@/components/data-table.tsx";
import { BasePage } from "@/pages/base/BasePage.tsx";
import { FileText, ExternalLink } from "lucide-react";
import type { components } from "@/api/models/dboxed-cloud-schema";
import { TimeAgo } from "@/components/TimeAgo.tsx";

type Invoice = components["schemas"]["Invoice"];

export function InvoicesTab() {
  const { workspaceId } = useSelectedWorkspaceId();
  const client = useDboxedCloudQueryClient();

  const invoices = client.useQuery("get", "/v1/cloud/workspaces/{workspaceId}/billing/invoices", {
    params: {
      path: {
        workspaceId: workspaceId!,
      },
    },
  });

  const formatAmount = (amount: string) => {
    try {
      const numAmount = parseFloat(amount);
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(numAmount); // Assuming amount is in cents
    } catch {
      return amount;
    }
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice Number",
      cell: ({ row }) => {
        const invoiceNumber = row.getValue("invoiceNumber") as string;
        return (
          <div className="flex flex-col">
            <span className="font-mono text-sm font-medium">{invoiceNumber}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdTime",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdTime") as string);
        return (
          <div className="flex flex-col">
            <TimeAgo date={date}/>
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.getValue("totalAmount") as string;
        return (
          <span className="font-mono text-sm font-medium">
            {formatAmount(amount)}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusLower = status.toLowerCase();

        let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
        if (statusLower === "paid" || statusLower === "completed") {
          variant = "default";
        } else if (statusLower === "open" || statusLower === "pending") {
          variant = "outline";
        } else if (statusLower === "void" || statusLower === "failed") {
          variant = "destructive";
        }

        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const pdfUrl = row.original.pdfUrl;
        return (
          <div className="flex items-center gap-2">
            {pdfUrl && <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(pdfUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </Button>}
          </div>
        );
      },
    },
  ];

  if (invoices.isLoading) {
    return (
      <BasePage title="Invoices">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium">Invoices</h3>
            <p className="text-sm text-muted-foreground">
              View and download your billing invoices
            </p>
          </div>
        </div>
        <div className="text-muted-foreground">Loading invoices...</div>
      </BasePage>
    );
  }

  if (invoices.error) {
    return (
      <BasePage title="Invoices">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium">Invoices</h3>
            <p className="text-sm text-muted-foreground">
              View and download your billing invoices
            </p>
          </div>
        </div>
        <div className="text-red-600">Failed to load invoices</div>
      </BasePage>
    );
  }

  const data = invoices.data?.items || [];

  return (
    <BasePage title="Invoices">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Invoices</h3>
          <p className="text-sm text-muted-foreground">
            View and download your billing invoices
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No invoices</p>
          <p className="text-sm text-muted-foreground max-w-sm mt-2">
            Your billing invoices will appear here once they are generated
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          searchColumn="invoiceNumber"
          searchPlaceholder="Search invoices..."
        />
      )}
    </BasePage>
  );
}
