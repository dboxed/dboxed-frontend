import { AddressElement, Elements } from "@stripe/react-stripe-js";
import { useCallback, useMemo, useState } from "react";
import type { StripeAddressElementChangeEvent } from "@stripe/stripe-js";
import { useDboxedCloudQueryClient } from "@/api/client.ts";
import { stripe } from "@/App.tsx";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { components } from "@/api/models/dboxed-cloud-schema";
import { deepClone, deepEqual } from "@/utils/utils.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx";
import { AddTaxIdDialog } from "./AddTaxIdDialog";
import { getTaxIdByCountryAndEnum } from "./taxIdTypes";
import { useDboxedCloudMutation } from "@/api/mutation.ts";

interface Props {
  allowIncomplete?: boolean
  handleDone?: () => void
}

export const StripeBillingAddress = (props: Props) => {
  const { workspaceId } = useSelectedWorkspaceId()

  const [formCustomer, setFormCustomer] = useState<any>({})
  const [formCustomerComplete, setFormCustomerComplete] = useState(false)

  const client = useDboxedCloudQueryClient();
  const customerQuery = client.useQuery('get', '/v1/cloud/workspaces/{workspaceId}/billing/customer', {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    }
  })

  const mutation = useDboxedCloudMutation("patch", "/v1/cloud/workspaces/{workspaceId}/billing/customer", {
    successMessage: "Billing address updated successfully!",
    errorMessage: "Failed to update billing address",
    onSuccess: () => {
      if (props.handleDone) {
        props.handleDone();
      }
      customerQuery.refetch()
    }
  });
  const addTaxIdMutation = useDboxedCloudMutation("post", "/v1/cloud/workspaces/{workspaceId}/billing/customer/tax-ids", {
    successMessage: "Tax ID added successfully!",
    errorMessage: "Failed to add tax ID",
    onComplete: customerQuery.refetch,
  });
  const deleteTaxIdMutation = useDboxedCloudMutation("delete", "/v1/cloud/workspaces/{workspaceId}/billing/customer/tax-ids/{id}", {
    successMessage: "Tax ID deleted successfully!",
    errorMessage: "Failed to delete tax ID",
    onComplete: customerQuery.refetch,
  });

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    return await mutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
        }
      },
      body: updateCustomer,
    })
  }

  const handleChange = useCallback((event: StripeAddressElementChangeEvent) => {
    setFormCustomer(event.value)
    setFormCustomerComplete(event.complete)
   }, [])

  const handleAddTaxId = async (formData: { type: string; value: string }) => {
    return await addTaxIdMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
        }
      },
      body: {
        type: formData.type,
        value: formData.value,
      },
    })
  };

  const handleDeleteTaxId = async (taxIdId: string) => {
    return await deleteTaxIdMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: taxIdId,
        }
      },
    })
  };

  if (!customerQuery.data) {
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
              <AddTaxIdDialog
                onSave={handleAddTaxId}
                country={formCustomer.address?.country}
              />
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
    </div>
  </Elements>
}
