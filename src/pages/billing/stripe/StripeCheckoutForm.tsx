import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import {
  PaymentElement,
  useCheckout
} from '@stripe/react-stripe-js/checkout';

export const StripeCheckoutForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const checkoutState = useCheckout();
  if (checkoutState.type === 'loading') {
    return <div>Loading...</div>
  }
  if (checkoutState.type === 'error') {
    return (
      <div>Error: {checkoutState.error.message}</div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { checkout } = checkoutState;
    setIsLoading(true);

    const confirmResult = await checkout.confirm();

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (confirmResult.type === 'error') {
      toast.error("Error confirming stripe checkout: " + confirmResult.error.message)
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement id="payment-element"/>
      <Button disabled={isLoading} type={"submit"}>
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
