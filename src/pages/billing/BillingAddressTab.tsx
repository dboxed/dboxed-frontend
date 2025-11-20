import { StripeBillingAddress } from "./stripe/StripeBillingAddress.tsx";


export function BillingAddressTab() {
  return (
    <div className="space-y-4">
      <StripeBillingAddress/>
    </div>
  )
}
