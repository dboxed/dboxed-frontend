import { CheckoutProvider } from '@stripe/react-stripe-js/checkout';
import { stripe } from "@/App.tsx";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { type RefObject, useEffect, useState } from "react";
import type { components } from "@/api/models/dboxed-cloud-schema";
import { StripeCheckoutForm } from "@/pages/billing/stripe/StripeCheckoutForm.tsx";
import { useDboxedCloudMutation } from "@/api/mutation.ts";

interface StripeCheckoutProps {
  handleSaveRef: RefObject<() => Promise<boolean>>
}

export const StripeCheckout = ({handleSaveRef}: StripeCheckoutProps) => {
  const { workspaceId } = useSelectedWorkspaceId()

  const [checkoutSession, setCheckoutSession] = useState<components["schemas"]["StripeCheckoutSession"]>()
  const checkoutMutation = useDboxedCloudMutation("post", "/v1/cloud/workspaces/{workspaceId}/billing/stripe-checkout-session", {
    successMessage: "Checkout session created!",
    errorMessage: "Failed to create checkout session",
    onSuccess: (data) => {
      setCheckoutSession(data)
    }
  });

  const returnUrl = window.location.protocol + "//" + window.location.host + `/workspaces/${workspaceId}/billing/checkout-return?session_id={CHECKOUT_SESSION_ID}`

  useEffect(() => {
    checkoutMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
        }
      },
      body: {
        returnUrl: returnUrl,
      },
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
      <StripeCheckoutForm handleSaveRef={handleSaveRef}/>
    </CheckoutProvider>
  );
}
