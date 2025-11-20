import { BasePage } from "@/pages/base/BasePage.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { PaymentMethodsTab } from "./PaymentMethodsTab"
import { BillingAddressTab } from "./BillingAddressTab"

export function BillingPage() {
  return (
    <BasePage title="Billing">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
          <p className="text-muted-foreground">
            Manage your payment methods and billing information
          </p>
        </div>

        <Tabs defaultValue="payment-methods" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="billing-address">Billing Address</TabsTrigger>
          </TabsList>

          <TabsContent value="payment-methods">
            <PaymentMethodsTab />
          </TabsContent>

          <TabsContent value="billing-address">
            <BillingAddressTab />
          </TabsContent>
        </Tabs>
      </div>
    </BasePage>
  )
}
