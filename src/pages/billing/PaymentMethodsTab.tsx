import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { useDboxedCloudQueryClient } from "@/api/client.ts";
import { DataTable } from "@/components/data-table.tsx";
import { BasePage } from "@/pages/base/BasePage.tsx";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx";
import type { components } from "@/api/models/dboxed-cloud-schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isDboxedCloudTestInstance } from "@/env";
import { AddPaymentMethodDialog } from "@/pages/billing/stripe/AddPaymentMethodDialog.tsx";
import { useDboxedCloudMutation } from "@/api/mutation.ts";
import { useEditDialogOpenState } from "@/hooks/use-edit-dialog-open-state.ts";

type StripePaymentMethod = components["schemas"]["StripePaymentMethod"];

export function PaymentMethodsTab() {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedCloudQueryClient();
  const addPaymentMethodDialog = useEditDialogOpenState();
  const deletePaymentMethodDialog = useEditDialogOpenState<StripePaymentMethod>();
  const setDefaultPaymentMethodDialog = useEditDialogOpenState<StripePaymentMethod>();

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

  const deletePaymentMethodMutation = useDboxedCloudMutation("delete", "/v1/cloud/workspaces/{workspaceId}/billing/payment-methods/{id}", {
    successMessage: "Payment method deleted successfully",
    errorMessage: "Failed to delete payment method",
    onComplete: paymentMethods.refetch,
  });
  const updateCustomerMutation = useDboxedCloudMutation("patch", "/v1/cloud/workspaces/{workspaceId}/billing/customer", {
    successMessage: "Default payment method updated successfully",
    errorMessage: "Failed to update default payment method",
    onComplete: customer.refetch,
  });

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    return await deletePaymentMethodMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: paymentMethodId,
        }
      }
    })
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    return await updateCustomerMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
        }
      },
      body: {
        defaultPaymentMethod: paymentMethodId,
      }
    });
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
        const isDefault = row.original.id === defaultPaymentMethodId;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={deletePaymentMethodMutation.isPending}
              onClick={() => deletePaymentMethodDialog.setItem(row.original)}
            >
              <Trash2 className="h-4 w-4"/>
            </Button>
            {!isDefault && (
              <Button
                variant="outline"
                size="sm"
                disabled={updateCustomerMutation.isPending}
                onClick={() => setDefaultPaymentMethodDialog.setItem(row.original)}
              >
                Set Default
              </Button>
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
        {data.length > 0 && (
          <Button className="mt-4" onClick={() => addPaymentMethodDialog.setOpen(true)}>
            <Plus className="mr-2 h-4 w-4"/>
            Add Payment Method
          </Button>
        )}
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
          <Button className="mt-4" onClick={() => addPaymentMethodDialog.setOpen(true)}>
            <Plus className="mr-2 h-4 w-4"/>
            Add Payment Method
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          searchColumn="type"
          searchPlaceholder="Search payment methods..."
        />
      )}
      <AddPaymentMethodDialog {...addPaymentMethodDialog.dialogProps} />
      {deletePaymentMethodDialog.item && <ConfirmationDialog
        {...deletePaymentMethodDialog.dialogProps}
        title="Delete Payment Method"
        description="Are you sure you want to delete this payment method? This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => handleDeletePaymentMethod(deletePaymentMethodDialog.item!.id)}
        destructive
      />}
      {setDefaultPaymentMethodDialog.item && <ConfirmationDialog
        {...setDefaultPaymentMethodDialog.dialogProps}
        title="Set Default Payment Method"
        description="Are you sure you want to set this as your default payment method? It will be used for future payments."
        confirmText="Set Default"
        onConfirm={() => handleSetDefaultPaymentMethod(setDefaultPaymentMethodDialog.item!.id)}
      />}
    </BasePage>
  );
}
