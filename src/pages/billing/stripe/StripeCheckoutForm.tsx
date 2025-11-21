import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  PaymentElement,
  TaxIdElement,
  BillingAddressElement,
  useCheckout
} from '@stripe/react-stripe-js/checkout';
import { Checkbox } from "@/components/ui/checkbox.tsx";
import * as stripeJs from "@stripe/stripe-js";

export const StripeCheckoutForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasingAsBusiness, setIsPurchasingAsBusiness] = useState(true);
  const [name, setName] = useState<string>()

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

    if (!isPurchasingAsBusiness) {
      await checkout.updateTaxIdInfo(null)
    } else if (checkout.taxIdInfo?.taxId && name) {
      await checkout.updateTaxIdInfo({
        taxId: checkout.taxIdInfo.taxId,
        businessName: name,
      })
    }

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

  const handleOrgAddressChange = (e: stripeJs.StripeAddressElementChangeEvent) => {
    setName(e.value.name)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element"/>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="business-purchase"
          checked={isPurchasingAsBusiness}
          onCheckedChange={(checked) => setIsPurchasingAsBusiness(checked === true)}
        />
        <Label
          htmlFor="business-purchase"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I'm purchasing as a business
        </Label>
      </div>

      {isPurchasingAsBusiness && <BillingAddressElement id={"billing-address-organization"} options={{
        display: {
          name: "organization",
        },
      }} onChange={handleOrgAddressChange}/>}
      {!isPurchasingAsBusiness && <BillingAddressElement id={"billing-address-full"} options={{
        display: {
          name: "full",
        },
      }}/>}

      {isPurchasingAsBusiness && <TaxIdElement options={{
        fields: {
          businessName: "never",
        },
      }}/>}

      <Button disabled={isLoading} type={"submit"}>
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
