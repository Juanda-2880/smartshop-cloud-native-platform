import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { usePlatformStore } from './store/usePlatformStore';
import { PlatformHeader } from './components/organisms/PlatformHeader';
import { PlatformFooter } from './components/organisms/PlatformFooter';
import { LandingView } from './features/landing/LandingView';
import { CatalogView } from './features/catalog/CatalogView';
import { CartView } from './features/cart/CartView';
import { CartDrawer } from './features/cart/CartDrawer';
import { DashboardView } from './features/dashboard/DashboardView';
import { LoginView } from './features/auth/LoginView';

export function App() {
  const { activeTab, toastMessage, clearToast, syncWithBackend } = usePlatformStore();

  useEffect(() => {
    void syncWithBackend();
  }, [syncWithBackend]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => {
      clearToast();
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage, clearToast]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <PlatformHeader />

      {/* Accessible Toast Feedback */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 pointer-events-none flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0"
      >
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="pointer-events-auto surface-elevated rounded-2xl p-4 shadow-2xl border border-blue-500/40 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={clearToast}
                aria-label="Dismiss notification"
                className="w-7 h-7 rounded-lg hover:bg-slate-500/15 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activeTab === 'landing' && <LandingView />}
            {activeTab === 'products' && <CatalogView />}
            {activeTab === 'cart' && <CartView />}
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'login' && <LoginView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <CartDrawer />
      <PlatformFooter />
    </div>
  );
}

export default App;
