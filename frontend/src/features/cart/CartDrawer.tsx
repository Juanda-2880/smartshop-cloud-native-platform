import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { Button } from '../../components/atoms/Button';

export function CartDrawer() {
  const {
    isCartDrawerOpen,
    setCartDrawerOpen,
    cartItems,
    updateCartItemQuantity,
    removeFromCart,
    setActiveTab,
  } = usePlatformStore();

  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart drawer"
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="w-full max-w-md h-full surface-elevated flex flex-col justify-between p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-5 h-5 text-blue-500" aria-hidden="true" />
                <h2 className="text-base font-extrabold">Active Shopping Cart</h2>
              </div>
              <button
                type="button"
                onClick={() => setCartDrawerOpen(false)}
                aria-label="Close cart drawer"
                className="w-10 h-10 rounded-xl surface-card flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cartItems.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] text-center py-12">
                  No items in your cart yet.
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="surface-card rounded-xl p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono text-blue-400">{item.sku}</span>
                      <h3 className="text-xs font-bold truncate">{item.productName}</h3>
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        ${item.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                        aria-label={`Decrease ${item.productName}`}
                        className="w-8 h-8 rounded-lg surface-elevated flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3 h-3" aria-hidden="true" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                        aria-label={`Increase ${item.productName}`}
                        className="w-8 h-8 rounded-lg surface-elevated flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3 h-3" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        aria-label={`Remove ${item.productName}`}
                        className="w-8 h-8 rounded-lg text-rose-400 hover:bg-rose-500/15 flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
              <div className="flex items-center justify-between font-mono text-sm font-bold">
                <span>Subtotal</span>
                <span>${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <Button
                variant="accent"
                size="lg"
                fullWidth
                onClick={() => {
                  setCartDrawerOpen(false);
                  setActiveTab('cart');
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
