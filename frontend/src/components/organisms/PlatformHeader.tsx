import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Boxes,
  Layers,
  Lock,
  Menu,
  Moon,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import type { NavigationTab } from '../../types/ecommerce';
import { StatusBadge } from '../atoms/StatusBadge';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: typeof Sparkles;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'landing', label: 'Platform Overview', icon: Sparkles },
  { id: 'products', label: 'Cloud Catalog', icon: Boxes },
  { id: 'dashboard', label: 'Executive & SRE Dashboard', icon: Activity },
  { id: 'cart', label: 'Cart & Checkout', icon: ShoppingCart },
  { id: 'login', label: 'Keycloak SSO', icon: Lock },
];

export function PlatformHeader() {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    cartItems,
    setCartDrawerOpen,
    currentUser,
    activeDeploymentSlot,
    switchDeploymentSlot,
    hpaReplicaCount,
  } = usePlatformStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 surface-glass">
      {/* Top Cloud-Native Telemetry Ribbon */}
      <div className="border-b border-[var(--border-subtle)] bg-slate-950/40 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-x-auto">
            <StatusBadge
              label={`Minikube v1.39 • K8s 1.34 (${hpaReplicaCount} Pods Ready)`}
              tone="emerald"
            />
            <button
              type="button"
              onClick={switchDeploymentSlot}
              aria-label="Toggle active Blue/Green deployment slot"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold cursor-pointer border transition-colors bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
            >
              <Layers className="w-3 h-3" aria-hidden="true" />
              <span>Slot: {activeDeploymentSlot} (Switch Zero-Downtime)</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[var(--text-muted)] font-mono text-[11px]">
            <span>RED P95: 18.4ms</span>
            <span>•</span>
            <span>Prometheus + Grafana + ELK 9 + Kubecost: ACTIVE</span>
            {currentUser && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-indigo-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  OIDC: {currentUser.fullName} ({currentUser.role})
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
            SS
          </div>
          <div>
            <span className="block text-base font-extrabold tracking-tight text-[var(--text-primary)]">
              SmartShop <span className="text-blue-500">Cloud</span>
            </span>
            <span className="block text-[11px] font-mono text-[var(--text-muted)]">
              Hexagonal • Kubernetes • FinOps
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors min-h-[40px] ${
                  isActive
                    ? 'text-blue-500'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-xl bg-blue-500/12 border border-blue-500/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" aria-hidden="true" />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions: Theme Toggle + Cart Drawer Trigger + Mobile Menu */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="min-w-[44px] min-h-[44px] rounded-xl surface-card flex items-center justify-center text-[var(--text-secondary)] hover:text-blue-500 hover:border-blue-500/40 cursor-pointer transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            aria-label={`Open shopping cart with ${totalCartUnits} items`}
            className="min-h-[44px] px-3.5 rounded-xl surface-card hover:border-blue-500/50 inline-flex items-center gap-2.5 cursor-pointer transition-colors"
          >
            <ShoppingCart className="w-4 h-4 text-blue-500" aria-hidden="true" />
            <span className="text-xs font-semibold hidden sm:inline">Cart</span>
            <span
              aria-live="polite"
              className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-600 text-white"
            >
              {totalCartUnits}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden min-w-[44px] min-h-[44px] rounded-xl surface-card flex items-center justify-center text-[var(--text-primary)] cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 overflow-hidden"
          >
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-[var(--text-secondary)] hover:bg-slate-500/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
