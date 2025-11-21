import { AddressElement, Elements } from "@stripe/react-stripe-js";
import { useCallback, useMemo, useState } from "react";
import type { StripeAddressElementChangeEvent } from "@stripe/stripe-js";
import { useDboxedCloudQueryClient } from "@/api/dboxed-cloud-api.ts";
import { stripe } from "@/App.tsx";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import type { components } from "@/api/models/dboxed-cloud-schema";
import { deepClone, deepEqual } from "@/utils/utils.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Plus, Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx";
import { AddTaxIdDialog } from "./AddTaxIdDialog";
import { getTaxIdByCountryAndEnum } from "./taxIdTypes";

interface Props {
  allowIncomplete?: boolean
  handleDone?: () => void
}

export const StripeBillingAddress = (props: Props) => {
  const { workspaceId } = useSelectedWorkspaceId()

  const [formCustomer, setFormCustomer] = useState<any>({})
  const [formCustomerComplete, setFormCustomerComplete] = useState(false)
  const [isAddTaxIdDialogOpen, setIsAddTaxIdDialogOpen] = useState(false)

  const client = useDboxedCloudQueryClient();
  const customerQuery = client.useQuery('get', '/v1/cloud/workspaces/{workspaceId}/billing/customer', {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    }
  })

  const mutation = client.useMutation("patch", "/v1/cloud/workspaces/{workspaceId}/billing/customer");
  const addTaxIdMutation = client.useMutation("post", "/v1/cloud/workspaces/{workspaceId}/billing/customer/tax-ids");
  const deleteTaxIdMutation = client.useMutation("delete", "/v1/cloud/workspaces/{workspaceId}/billing/customer/tax-ids/{id}");

  const buildUpdateCustomer = () => {
    if (!customerQuery.data) {
      return {}
    }

    const customer: components["schemas"]["UpdateCustomer"]  = {}
    if (formCustomer.name !== customerQuery.data.name) {
      customer.name = formCustomer.name
    }
    if (formCustomer.address) {
      const newAddress: components["schemas"]["Address"] = deepClone(customerQuery.data.address || {})
      if (formCustomer.address.city !== customerQuery.data.address?.city) {
        newAddress.city = formCustomer.address.city
      }
      if (formCustomer.address.country !== customerQuery.data.address?.country) {
        newAddress.country = formCustomer.address.country
      }
      if (formCustomer.address.line1 !== customerQuery.data.address?.line1) {
        newAddress.line1 = formCustomer.address.line1
      }
      if (formCustomer.address.line2 !== customerQuery.data.address?.line2) {
        newAddress.line2 = formCustomer.address.line2
      }
      if (formCustomer.address.postal_code !== customerQuery.data.address?.postalCode) {
        newAddress.postalCode = formCustomer.address.postal_code
      }
      if (formCustomer.address.state !== customerQuery.data.address?.state) {
        newAddress.state = formCustomer.address.state
      }
      if (!deepEqual(customerQuery.data.address, newAddress)) {
        customer.address = newAddress
      }
    }
    return customer
  }
  const updateCustomer = useMemo(() => buildUpdateCustomer(), [formCustomer, customerQuery.data])
  const modified = useMemo(() => !deepEqual({}, updateCustomer), [updateCustomer])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    mutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
        }
      },
      body: updateCustomer,
    }, {
      onSuccess: () => {
        toast.success("Billing address updated successfully!")
        if (props.handleDone) {
          props.handleDone();
        }
      },
      onError: (error) => {
        toast.error("Failed to update billing address", {
          description: error.detail || "An error occurred while updating the billing address."
        })
      }
    })
  }

  const handleChange = useCallback((event: StripeAddressElementChangeEvent) => {
    setFormCustomer(event.value)
    setFormCustomerComplete(event.complete)
   }, [])

  const handleDeleteTaxId = async (taxIdId: string) => {
    deleteTaxIdMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: taxIdId,
        }
      },
    }, {
      onSuccess: () => {
        toast.success("Tax ID deleted successfully!");
        customerQuery.refetch();
      },
      onError: (error) => {
        toast.error("Failed to delete tax ID", {
          description: error.detail || "An error occurred while deleting the tax ID."
        })
      }
    })
  };

  const handleAddTaxId = async (formData: { type: string; value: string }) => {
    addTaxIdMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
        }
      },
      body: {
        type: formData.type,
        value: formData.value,
      },
    }, {
      onSuccess: () => {
        toast.success("Tax ID added successfully!");
        customerQuery.refetch();
        setIsAddTaxIdDialogOpen(false);
      },
      onError: (error) => {
        toast.error("Failed to add tax ID", {
          description: error.detail || "An error occurred while adding the tax ID."
        })
      }
    })

    return true;
  };

  if (customerQuery.isLoading || customerQuery.isFetching) {
    return <div>Loading...</div>
  }

  const defaultValues: any = {
    name: undefined,
  }
  if (customerQuery.data) {
    defaultValues.name = customerQuery.data.name
    if (customerQuery.data.address) {
      defaultValues.address = {
        line1: customerQuery.data.address.line1,
        line2: customerQuery.data.address.line2,
        city: customerQuery.data.address.city,
        state: customerQuery.data.address.state,
        postal_code: customerQuery.data.address.postalCode,
        country: customerQuery.data.address.country,
      }
    }
  }

  const taxIds = customerQuery.data?.taxIds || [];

  return <Elements stripe={stripe}>
    <div className="max-w-6xl mx-auto mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <AddressElement onChange={handleChange} options={{
                  mode: 'billing',
                  defaultValues: defaultValues,
                }}/>
              </div>
              <Button disabled={!modified || mutation.isPending || !formCustomerComplete} className={"w-full"} >{mutation.isPending ? "Saving..." : "Save"}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tax IDs</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddTaxIdDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tax ID
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {taxIds.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tax IDs configured. Add a tax ID for your business.
              </p>
            ) : (
              <div className="space-y-2">
                {taxIds.map((taxId) => {
                  const taxIdType = getTaxIdByCountryAndEnum(customerQuery.data?.address?.country, taxId.type)
                  const displayName = taxIdType?.label || taxId.type;

                  return (
                    <div
                      key={taxId.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">{displayName}</p>
                        <p className="text-sm text-muted-foreground">{taxId.value}</p>
                      </div>
                      <ConfirmationDialog
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={deleteTaxIdMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                        title="Delete Tax ID"
                        description="Are you sure you want to delete this tax ID? This action cannot be undone."
                        confirmText="Delete"
                        onConfirm={() => handleDeleteTaxId(taxId.id)}
                        destructive
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddTaxIdDialog
        open={isAddTaxIdDialogOpen}
        onOpenChange={setIsAddTaxIdDialogOpen}
        onSave={handleAddTaxId}
        isLoading={addTaxIdMutation.isPending}
        country={formCustomer.address?.country}
      />
    </div>
  </Elements>
}
