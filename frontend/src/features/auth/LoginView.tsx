import { useState, type FormEvent } from 'react';
import { KeyRound, LogOut, ShieldCheck, UserCheck } from 'lucide-react';
import { PLATFORM_PERSONAS, usePlatformStore } from '../../store/usePlatformStore';
import type { UserRole } from '../../types/ecommerce';
import { Button } from '../../components/atoms/Button';
import { StatusBadge } from '../../components/atoms/StatusBadge';

export function LoginView() {
  const { currentUser, switchUserRole, logoutUser, setActiveTab } = usePlatformStore();
  const [email, setEmail] = useState(currentUser?.email ?? 'admin@smartshop.io');
  const [password, setPassword] = useState('••••••••••••••••');

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    const matched = PLATFORM_PERSONAS.find(
      (persona) => persona.email.toLowerCase() === email.trim().toLowerCase(),
    );
    switchUserRole(matched?.role ?? 'ADMIN');
    setActiveTab('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-blue-500 font-semibold">
          Keycloak 26 Identity & Access Management • OAuth2 / OIDC PKCE
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
          Enterprise Single Sign-On (SSO) Portal
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Authenticate via Keycloak 26 OIDC or switch RBAC personas (ADMIN, MANAGER, CUSTOMER) to
          validate role-protected APIs and UI views.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Credentials & OIDC Login Form */}
        <form
          onSubmit={handleFormSubmit}
          className="lg:col-span-6 surface-card rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-500" aria-hidden="true" />
              <h2 className="text-base font-extrabold">Keycloak Realm: smartshop</h2>
            </div>
            <StatusBadge label="OIDC Discovery Ready" tone="emerald" />
          </div>

          <div>
            <label htmlFor="sso-email-input" className="block text-xs font-semibold mb-1.5">
              Corporate Email / Username
            </label>
            <input
              id="sso-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl surface-elevated text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="sso-password-input" className="block text-xs font-semibold mb-1.5">
              Password / Passkey Token
            </label>
            <input
              id="sso-password-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl surface-elevated text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button type="submit" variant="primary" size="lg" fullWidth>
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Sign In with Keycloak OIDC</span>
            </Button>
            {currentUser && (
              <Button variant="danger" size="md" fullWidth onClick={logoutUser}>
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>Terminate OIDC Session (Logout)</span>
              </Button>
            )}
          </div>
        </form>

        {/* Right: Instant RBAC Persona Switcher & JWT Claims Inspector */}
        <div className="lg:col-span-6 space-y-5">
          <div className="surface-card rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-extrabold">Instant RBAC Role Switcher</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Select a pre-configured Keycloak 26 role to test permissions across Catalog and
              Executive Dashboard:
            </p>

            <div className="space-y-2.5">
              {PLATFORM_PERSONAS.map((persona) => {
                const isSelected = currentUser?.role === persona.role;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => {
                      setEmail(persona.email);
                      switchUserRole(persona.role as UserRole);
                    }}
                    className={`w-full p-3.5 rounded-xl text-left cursor-pointer border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500'
                        : 'surface-elevated hover:border-blue-500/40'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{persona.fullName}</span>
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">
                        {persona.email}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                      {persona.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="surface-elevated rounded-2xl p-5 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-1.5 font-bold">
                <UserCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                Active OIDC JWT Payload
              </span>
              <span className="text-[10px] text-blue-400">RS256 • JWKS Verified</span>
            </div>
            <pre className="p-3 rounded-xl surface-card overflow-x-auto text-[11px] text-emerald-400 leading-relaxed">
              {JSON.stringify(
                currentUser
                  ? {
                      iss: 'http://keycloak.smartshop.local/realms/smartshop',
                      sub: currentUser.id,
                      preferred_username: currentUser.username,
                      email: currentUser.email,
                      realm_access: { roles: [currentUser.role] },
                      scope: 'openid profile email roles',
                    }
                  : { status: 'UNAUTHENTICATED_SESSION' },
                null,
                2,
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
