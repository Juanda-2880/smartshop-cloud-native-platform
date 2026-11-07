import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { Button } from '../../components/atoms/Button';

export function CartView() {
  const {
    cartItems,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    checkoutOrder,
    setActiveTab,
    currentUser,
  } = usePlatformStore();

  const [shippingAddress, setShippingAddress] = useState(
    '742 Cloud Native Blvd, Suite 400, San Francisco, CA',
  );
  const [lastOrderNumber, setLastOrderNumber] = useState<string | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const estimatedTax = Number((subtotal * 0.08).toFixed(2));
  const grandTotal = Number((subtotal + estimatedTax).toFixed(2));

  const handleCheckout = (event: FormEvent) => {
    event.preventDefault();
    const order = checkoutOrder(shippingAddress);
    if (order) {
      setLastOrderNumber(order.orderNumber);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-blue-500 font-semibold">
          Transactional Order Pipeline • /api/v1/carts & /api/v1/orders
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
          Enterprise Cart & Express Checkout
        </h1>
      </div>

      {lastOrderNumber && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-emerald-500/12 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-bold text-emerald-400">
                Order {lastOrderNumber} Dispatched to Fulfillment
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Inventory stock decremented and Prometheus counter{' '}
                <code className="font-mono">smartshop_orders_completed_total</code> incremented.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setActiveTab('dashboard')}>
            <span>Inspect in Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </motion.div>
      )}

      {cartItems.length === 0 ? (
        <div className="surface-card rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/12 border border-blue-500/25 flex items-center justify-center mx-auto text-blue-500">
            <ShoppingBag className="w-7 h-7" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold">Your Enterprise Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto">
            Add Kubernetes edge servers, developer workstations, or FIDO2 OIDC security keys from
            the catalog to test the transactional checkout pipeline.
          </p>
          <Button variant="primary" size="lg" onClick={() => setActiveTab('products')}>
            <span>Browse Hardware Catalog</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Line Items ({cartItems.length})
              </h2>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                Clear Entire Cart
              </button>
            </div>

            {cartItems.map((item) => (
              <motion.div
                key={item.productId}
                layout
                className="surface-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-blue-400 font-semibold">
                    {item.sku}
                  </span>
                  <h3 className="text-base font-bold">{item.productName}</h3>
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    ${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} / unit
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="inline-flex items-center rounded-xl surface-elevated p-1">
                    <button
                      type="button"
                      onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.productName}`}
                      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-500/15 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-10 text-center font-mono text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.productName}`}
                      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-500/15 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="text-right min-w-[96px]">
                    <span className="block text-sm font-extrabold font-mono">
                      ${item.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    aria-label={`Remove ${item.productName} from cart`}
                    className="w-10 h-10 rounded-xl surface-elevated text-rose-400 hover:bg-rose-500/15 flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary & OIDC Checkout Form */}
          <form
            onSubmit={handleCheckout}
            className="lg:col-span-5 surface-elevated rounded-2xl p-6 space-y-5"
          >
            <h2 className="text-lg font-extrabold border-b border-[var(--border-subtle)] pb-3">
              Order Summary & OIDC Billing
            </h2>

            <div className="p-3.5 rounded-xl surface-card text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-indigo-400">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>Authenticated Purchaser</span>
              </div>
              <p className="font-mono text-[var(--text-secondary)]">
                {currentUser
                  ? `${currentUser.fullName} (${currentUser.email}) [${currentUser.role}]`
                  : 'Guest Session (Keycloak OIDC Available)'}
              </p>
            </div>

            <div>
              <label
                htmlFor="checkout-shipping-address"
                className="block text-xs font-semibold mb-1.5"
              >
                Data Center / Enterprise Delivery Address
              </label>
              <input
                id="checkout-shipping-address"
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl surface-card text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 text-xs border-t border-[var(--border-subtle)] pt-4 font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Cloud-Edge Priority Freight</span>
                <span className="text-emerald-500">FREE ($0.00)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Estimated Tax (8%)</span>
                <span>${estimatedTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold pt-2 border-t border-[var(--border-subtle)] text-[var(--text-primary)]">
                <span>Total (USD)</span>
                <span>${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <Button type="submit" variant="accent" size="lg" fullWidth>
              <span>Complete Order Checkout</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
