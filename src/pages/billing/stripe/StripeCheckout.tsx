import { useDboxedCloudQueryClient } from "@/api/dboxed-cloud-api.ts";
import { CheckoutProvider } from '@stripe/react-stripe-js/checkout';
import { stripe } from "@/App.tsx";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { useEffect, useState } from "react";
import type { components } from "@/api/models/dboxed-cloud-schema";
import { toast } from "sonner";
import { StripeCheckoutForm } from "@/pages/billing/stripe/StripeCheckoutForm.tsx";

export const StripeCheckout = () => {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedCloudQueryClient();

  const checkoutMutation = client.useMutation("post", "/v1/cloud/workspaces/{workspaceId}/billing/stripe-checkout-session");
  const [checkoutSession, setCheckoutSession] = useState<components["schemas"]["StripeCheckoutSession"]>()

  const returnUrl = window.location.protocol + "//" + window.location.host + `/workspaces/${workspaceId}/billing/checkout-return?session_id={CHECKOUT_SESSION_ID}`

  useEffect(() => {
    checkoutMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
        }
      },
      body: {
        returnUrl: returnUrl,
      },
    }, {
      onSuccess: (data) => {
        toast.success("Checkout session created!")
        setCheckoutSession(data)
      },
      onError: (error) => {
        toast.error("Failed to create checkout session", {
          description: error.detail || "An error occurred while creating the checkout session."
        })
      }
    })
  }, []);

  if (checkoutMutation.isPending) {
    return null
  }
  if (checkoutMutation.error) {
    return null
  }

  if (!checkoutSession?.client_secret) {
    return null
  }

  const options = {
    clientSecret: checkoutSession.client_secret,
  }

  return (
    <CheckoutProvider
      stripe={stripe}
      options={options}
    >
      <StripeCheckoutForm/>
    </CheckoutProvider>
  );
}

