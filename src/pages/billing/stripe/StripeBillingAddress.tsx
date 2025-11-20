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

interface Props {
  allowIncomplete?: boolean
  handleDone?: () => void
}

export const StripeBillingAddress = (props: Props) => {
  const { workspaceId } = useSelectedWorkspaceId()

  const [formCustomer, setFormCustomer] = useState<any>({})

  const client = useDboxedCloudQueryClient();
  const customerQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/billing/customer', {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    }
  })

  const mutation = client.useMutation("patch", "/v1/workspaces/{workspaceId}/billing/customer");

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
    if (event.value.name && (props.allowIncomplete || event.complete)) {
      setFormCustomer(event.value)
    } else {
      setFormCustomer({})
    }
  }, [])

  if (customerQuery.isLoading || customerQuery.isFetching) {
    return <div>Loading...</div>
  }

  let defaultValues: any = {
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

  return <Elements stripe={stripe}>
    <div className="max-w-lg mx-auto mt-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <AddressElement onChange={handleChange} options={{
              mode: 'billing',
              defaultValues: defaultValues,
            }}/>
          </div>
          <Button disabled={!modified || mutation.isPending} className={"w-full"} >{mutation.isPending ? "Saving..." : "Save"}</Button>
        </form>
      </div>
    </div>
  </Elements>
}
