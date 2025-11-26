import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { useDboxedCloudQueryClient } from "@/api/dboxed-cloud-api.ts";
import { DataTable } from "@/components/data-table.tsx";
import { BasePage } from "@/pages/base/BasePage.tsx";
import { CreditCard, Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx";
import { toast } from "sonner";
import type { components } from "@/api/models/dboxed-cloud-schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isDboxedCloudTestInstance } from "@/env";
import { AddPaymentMethodDialog } from "@/pages/billing/stripe/AddPaymentMethodDialog.tsx";

type StripePaymentMethod = components["schemas"]["StripePaymentMethod"];

export function PaymentMethodsTab() {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedCloudQueryClient();

  const customer = client.useQuery("get", "/v1/cloud/workspaces/{workspaceId}/billing/customer", {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    }
  });

  const paymentMethods = client.useQuery("get", "/v1/cloud/workspaces/{workspaceId}/billing/payment-methods", {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    }
  });

  const deletePaymentMethodMutation = client.useMutation("delete", "/v1/cloud/workspaces/{workspaceId}/billing/payment-methods/{id}");
  const updateCustomerMutation = client.useMutation("patch", "/v1/cloud/workspaces/{workspaceId}/billing/customer");

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await deletePaymentMethodMutation.mutateAsync({
        params: {
          path: {
            workspaceId: workspaceId!,
            id: paymentMethodId,
          }
        }
      });
      toast.success("Payment method deleted successfully");
      paymentMethods.refetch();
      return true
    } catch (error: any) {
      toast.error("Failed to delete payment method", {
        description: error.detail || "An error occurred while deleting the payment method."
      });
      console.error("Failed to delete payment method:", error);
      return false
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await updateCustomerMutation.mutateAsync({
        params: {
          path: {
            workspaceId: workspaceId!,
          }
        },
        body: {
          defaultPaymentMethod: paymentMethodId,
        }
      });
      toast.success("Default payment method updated successfully");
      customer.refetch();
      return true
    } catch (error) {
      toast.error("Failed to update default payment method");
      console.error("Failed to update default payment method:", error);
      return false
    }
  };

  const defaultPaymentMethodId = customer.data?.defaultPaymentMethod;

  const columns: ColumnDef<StripePaymentMethod>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        const isDefault = row.original.id === defaultPaymentMethodId;
        return (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground"/>
            <Badge variant="secondary" className="capitalize">
              {type}
            </Badge>
            {isDefault && (
              <Badge variant="default" className="text-xs">
                Default
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "brand",
      header: "Brand",
      cell: ({ row }) => {
        const card = row.original.card;
        if (card?.brand) {
          return (
            <span className="font-medium capitalize">
              {card.brand}
            </span>
          );
        }
        return <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      id: "last4",
      header: "Last 4 Digits",
      cell: ({ row }) => {
        const card = row.original.card;
        if (card?.last4) {
          return (
            <span className="font-mono">
              •••• {card.last4}
            </span>
          );
        }
        return <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      id: "expiry",
      header: "Expiration",
      cell: ({ row }) => {
        const card = row.original.card;
        if (card?.exp_month && card?.exp_year) {
          const month = card.exp_month.toString().padStart(2, "0");
          const year = card.exp_year.toString().slice(-2);
          return (
            <span className="text-sm">
              {month}/{year}
            </span>
          );
        }
        return <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      id: "billingDetails",
      header: "Billing Name",
      cell: ({ row }) => {
        const billingDetails = row.original.billing_details;
        if (billingDetails?.name) {
          return (
            <span className="text-sm">
              {billingDetails.name}
            </span>
          );
        }
        return <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;
        const isDefault = id === defaultPaymentMethodId;
        return (
          <div className="flex items-center gap-2">
            <ConfirmationDialog
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  disabled={deletePaymentMethodMutation.isPending}
                >
                  <Trash2 className="h-4 w-4"/>
                </Button>
              }
              title="Delete Payment Method"
              description="Are you sure you want to delete this payment method? This action cannot be undone."
              confirmText="Delete"
              onConfirm={() => handleDeletePaymentMethod(id)}
              destructive
            />
            {!isDefault && (
              <ConfirmationDialog
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={updateCustomerMutation.isPending}
                  >
                    Set Default
                  </Button>
                }
                title="Set Default Payment Method"
                description="Are you sure you want to set this as your default payment method? It will be used for future payments."
                confirmText="Set Default"
                onConfirm={() => handleSetDefaultPaymentMethod(id)}
              />
            )}
          </div>
        );
      },
    },
  ];

  if (paymentMethods.isLoading || customer.isLoading) {
    return (
      <BasePage title="Payment Methods">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium">Payment Methods</h3>
            <p className="text-sm text-muted-foreground">
              Manage your payment methods for billing
            </p>
          </div>
        </div>
        <div className="text-muted-foreground">Loading payment methods...</div>
      </BasePage>
    );
  }

  if (paymentMethods.error || customer.error) {
    return (
      <BasePage title="Payment Methods">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium">Payment Methods</h3>
            <p className="text-sm text-muted-foreground">
              Manage your payment methods for billing
            </p>
          </div>
        </div>
        <div className="text-red-600">Failed to load payment methods</div>
      </BasePage>
    );
  }

  const data = paymentMethods.data?.items || [];

  return (
    <BasePage title="Payment Methods">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Payment Methods</h3>
          <p className="text-sm text-muted-foreground">
            Manage your payment methods for billing
          </p>
        </div>
        {data.length ? <AddPaymentMethodDialog/> : null}
      </div>

      {isDboxedCloudTestInstance() && (
        <Alert className="mb-6" variant={"destructive"}>
          <CreditCard className="h-4 w-4"/>
          <AlertTitle>Dboxed Test Instance</AlertTitle>
          <AlertDescription>
            <p>
              This is a test environment for Dboxed Cloud. Payments will only be simulated.<br/>
              You can use Stripe test cards to add payment methods.
              Visit{" "}
              <a
                href="https://docs.stripe.com/testing#cards"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Stripe's testing documentation
              </a>{" "}
              for a list of test card numbers.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-4"/>
          <p className="text-lg font-medium">No payment methods</p>
          <p className="text-sm text-muted-foreground max-w-sm mt-2">
            Add a payment method to enable automatic billing for your workspace
          </p>
          <AddPaymentMethodDialog/>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          searchColumn="type"
          searchPlaceholder="Search payment methods..."
        />
      )}
    </BasePage>
  );
}
