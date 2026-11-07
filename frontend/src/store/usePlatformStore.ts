import { create } from 'zustand';
import type {
  CartItem,
  Category,
  DeploymentSlot,
  FeatureFlag,
  NamespaceCostAllocation,
  NavigationTab,
  Order,
  OrderStatus,
  Product,
  RolloutStrategy,
  ThemeMode,
  User,
  UserRole,
} from '../types/ecommerce';

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    name: 'Cloud Edge Hardware',
    slug: 'cloud-edge-hardware',
    description: 'High-density compute nodes and edge appliances for Kubernetes clusters',
    active: true,
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    name: 'Developer Workstations',
    slug: 'developer-workstations',
    description: 'Ultra-fast engineering laptops, mechanical keyboards, and 5K displays',
    active: true,
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    name: 'Zero-Trust Security',
    slug: 'zero-trust-security',
    description: 'FIDO2 hardware tokens and biometric authentication modules',
    active: true,
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
    name: 'Telemetry & Networking',
    slug: 'telemetry-networking',
    description: '10GbE managed switches and hardware telemetry sensors',
    active: true,
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    sku: 'SKU-K8S-BLADE-01',
    name: 'SmartShop KubeBlade X1 Edge Server',
    description:
      'Compact 16-core ARM64/x86 hybrid bare-metal node pre-tuned for Kubernetes 1.34, Cilium eBPF & NVMe PVC workloads.',
    price: 1499.0,
    stockQuantity: 45,
    categoryId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    categoryName: 'Cloud Edge Hardware',
    imageUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
    featured: true,
    active: true,
    createdAt: '2026-11-07T12:00:00Z',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    sku: 'SKU-DEV-PRO-16',
    name: 'LinearBook Pro 16 M-Ultra Workstation',
    description:
      '64GB unified memory, 2TB NVMe Gen5 SSD, nano-texture 120Hz OLED display built for cloud-native architects.',
    price: 2899.0,
    stockQuantity: 20,
    categoryId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    categoryName: 'Developer Workstations',
    imageUrl:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    featured: true,
    active: true,
    createdAt: '2026-11-07T12:05:00Z',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
    sku: 'SKU-SEC-OIDC-99',
    name: 'Aegis FIDO2 OIDC Hardware Security Key',
    description:
      'FIPS 140-3 Level 3 certified USB-C & NFC cryptographic key with native Keycloak 26 OAuth2/PKCE passkey support.',
    price: 89.0,
    stockQuantity: 150,
    categoryId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    categoryName: 'Zero-Trust Security',
    imageUrl:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    featured: false,
    active: true,
    createdAt: '2026-11-07T12:10:00Z',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4',
    sku: 'SKU-NET-10G-08',
    name: 'PulseCore 10GbE L3 Managed Telemetry Switch',
    description:
      '8-port 10G SFP+ switch with native Prometheus OpenMetrics exporter, OpenTelemetry spans, and sFlow streaming.',
    price: 649.0,
    stockQuantity: 32,
    categoryId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
    categoryName: 'Telemetry & Networking',
    imageUrl:
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80',
    featured: true,
    active: true,
    createdAt: '2026-11-07T12:15:00Z',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5',
    sku: 'SKU-STO-NVME-04',
    name: 'HyperVault Gen5 NVMe Kubernetes Storage Array',
    description:
      'Enterprise 16TB all-flash storage appliance with CSI driver support for sub-millisecond PostgreSQL 17 PVCs.',
    price: 2150.0,
    stockQuantity: 14,
    categoryId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    categoryName: 'Cloud Edge Hardware',
    imageUrl:
      'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=900&q=80',
    featured: true,
    active: true,
    createdAt: '2026-11-07T12:20:00Z',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6',
    sku: 'SKU-DEV-MON-5K',
    name: 'VercelStudio 32" 6K Reference Display',
    description:
      '2000-nit mini-LED reference monitor with dual Thunderbolt 5 hub for multi-cluster Grafana & Kibana walls.',
    price: 1799.0,
    stockQuantity: 18,
    categoryId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    categoryName: 'Developer Workstations',
    imageUrl:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
    featured: false,
    active: true,
    createdAt: '2026-11-07T12:25:00Z',
  },
];

export const PLATFORM_PERSONAS: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    username: 'admin.smartshop',
    email: 'admin@smartshop.io',
    fullName: 'Elena Vance',
    role: 'ADMIN',
    active: true,
    createdAt: '2026-11-01T09:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    username: 'manager.smartshop',
    email: 'manager@smartshop.io',
    fullName: 'Marcus Sterling',
    role: 'MANAGER',
    active: true,
    createdAt: '2026-11-02T10:30:00Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    username: 'customer.smartshop',
    email: 'customer@smartshop.io',
    fullName: 'Sofia Chen',
    role: 'CUSTOMER',
    active: true,
    createdAt: '2026-11-03T14:15:00Z',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    orderNumber: 'ORD-K8S00001',
    userId: '33333333-3333-3333-3333-333333333333',
    items: [
      {
        productId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
        productName: 'SmartShop KubeBlade X1 Edge Server',
        sku: 'SKU-K8S-BLADE-01',
        unitPrice: 1499.0,
        quantity: 1,
        subtotal: 1499.0,
      },
    ],
    totalAmount: 1499.0,
    status: 'DELIVERED',
    shippingAddress: '742 Cloud Native Blvd, Suite 400, San Francisco, CA',
    createdAt: '2026-11-06T16:40:00Z',
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-ddddddddddd2',
    orderNumber: 'ORD-K8S00002',
    userId: '33333333-3333-3333-3333-333333333333',
    items: [
      {
        productId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4',
        productName: 'PulseCore 10GbE L3 Managed Telemetry Switch',
        sku: 'SKU-NET-10G-08',
        unitPrice: 649.0,
        quantity: 2,
        subtotal: 1298.0,
      },
    ],
    totalAmount: 1298.0,
    status: 'SHIPPED',
    shippingAddress: '100 Kubecost Way, Seattle, WA',
    createdAt: '2026-11-07T09:15:00Z',
  },
];

const INITIAL_NAMESPACE_COSTS: NamespaceCostAllocation[] = [
  {
    namespace: 'smartshop',
    cpuCostUsd: 48.2,
    ramCostUsd: 34.6,
    storageCostUsd: 18.4,
    efficiencyScore: 92,
    recommendation: 'Optimal HPA sizing (2-6 replicas). PVC utilization at 78%.',
  },
  {
    namespace: 'observability',
    cpuCostUsd: 31.5,
    ramCostUsd: 42.0,
    storageCostUsd: 14.0,
    efficiencyScore: 86,
    recommendation: 'Prometheus TSDB retention tuned to 15d; Grafana memory right-sized.',
  },
  {
    namespace: 'logging',
    cpuCostUsd: 38.0,
    ramCostUsd: 54.8,
    storageCostUsd: 22.5,
    efficiencyScore: 79,
    recommendation: 'Elasticsearch single-node JVM heap capped at 512MB for Minikube efficiency.',
  },
  {
    namespace: 'auth',
    cpuCostUsd: 19.4,
    ramCostUsd: 24.2,
    storageCostUsd: 6.0,
    efficiencyScore: 94,
    recommendation: 'Keycloak 26 token cache hit ratio 99.2%. No resize needed.',
  },
];

interface PlatformState {
  theme: ThemeMode;
  activeTab: NavigationTab;
  isCartDrawerOpen: boolean;
  isLoadingSkeleton: boolean;
  currentUser: User | null;
  categories: Category[];
  products: Product[];
  cartItems: CartItem[];
  orders: Order[];
  activeDeploymentSlot: DeploymentSlot;
  activeRolloutStrategy: RolloutStrategy;
  canaryWeight: number;
  hpaReplicaCount: number;
  productsVisitedCount: number;
  featureFlags: FeatureFlag[];
  namespaceCosts: NamespaceCostAllocation[];
  toastMessage: string | null;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: NavigationTab) => void;
  setCartDrawerOpen: (open: boolean) => void;
  triggerSkeletonPreview: () => void;
  switchUserRole: (role: UserRole) => void;
  logoutUser: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkoutOrder: (shippingAddress: string) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  createProduct: (productInput: Omit<Product, 'id' | 'createdAt' | 'categoryName'>) => void;
  recordProductVisit: () => void;
  switchDeploymentSlot: () => void;
  setRolloutStrategy: (strategy: RolloutStrategy) => void;
  setCanaryWeight: (weight: number) => void;
  simulateHpaLoadSpike: () => void;
  toggleFeatureFlag: (key: string) => void;
  clearToast: () => void;
  syncWithBackend: () => Promise<void>;
}

export const usePlatformStore = create<PlatformState>((set, get) => ({
  theme: 'dark',
  activeTab: 'landing',
  isCartDrawerOpen: false,
  isLoadingSkeleton: false,
  currentUser: PLATFORM_PERSONAS[0],
  categories: INITIAL_CATEGORIES,
  products: INITIAL_PRODUCTS,
  cartItems: [
    {
      productId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
      productName: 'Aegis FIDO2 OIDC Hardware Security Key',
      sku: 'SKU-SEC-OIDC-99',
      unitPrice: 89.0,
      quantity: 2,
      subtotal: 178.0,
    },
  ],
  orders: INITIAL_ORDERS,
  activeDeploymentSlot: 'BLUE',
  activeRolloutStrategy: 'BLUE_GREEN',
  canaryWeight: 20,
  hpaReplicaCount: 3,
  productsVisitedCount: 142,
  featureFlags: [
    {
      key: 'ff-instant-oidc-checkout',
      name: 'One-Click OIDC Express Checkout',
      description: 'Enables zero-friction checkout for authenticated Keycloak 26 sessions',
      enabled: true,
    },
    {
      key: 'ff-ai-finops-advisor',
      name: 'Kubecost AI Right-Sizing Banner',
      description: 'Displays real-time pod CPU/RAM optimization suggestions in catalog & dashboard',
      enabled: true,
    },
    {
      key: 'ff-shadow-traffic-mirror',
      name: 'Shadow v1.5 Traffic Mirroring',
      description: 'Duplicates 100% of read requests asynchronously to smartshop-backend-shadow',
      enabled: false,
    },
  ],
  namespaceCosts: INITIAL_NAMESPACE_COSTS,
  toastMessage: null,

  setTheme: (theme) => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(nextTheme);
    set({ theme: nextTheme });
  },

  setActiveTab: (activeTab) => {
    set({ activeTab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setCartDrawerOpen: (isCartDrawerOpen) => set({ isCartDrawerOpen }),

  triggerSkeletonPreview: () => {
    set({ isLoadingSkeleton: true });
    window.setTimeout(() => {
      set({ isLoadingSkeleton: false });
    }, 650);
  },

  switchUserRole: (role) => {
    const matched = PLATFORM_PERSONAS.find((user) => user.role === role) ?? PLATFORM_PERSONAS[0];
    set({
      currentUser: matched,
      toastMessage: `Switched OIDC session to ${matched.fullName} (${matched.role})`,
    });
  },

  logoutUser: () => {
    set({
      currentUser: null,
      toastMessage: 'Keycloak OIDC session terminated safely',
    });
  },

  addToCart: (product, quantity = 1) => {
    const existingItems = get().cartItems;
    const existingIndex = existingItems.findIndex((item) => item.productId === product.id);
    let nextItems: CartItem[];

    if (existingIndex >= 0) {
      nextItems = existingItems.map((item, index) => {
        if (index !== existingIndex) return item;
        const newQty = Math.min(product.stockQuantity, item.quantity + quantity);
        return {
          ...item,
          quantity: newQty,
          subtotal: Number((newQty * item.unitPrice).toFixed(2)),
        };
      });
    } else {
      nextItems = [
        ...existingItems,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          unitPrice: product.price,
          quantity,
          subtotal: Number((quantity * product.price).toFixed(2)),
        },
      ];
    }

    set({
      cartItems: nextItems,
      productsVisitedCount: get().productsVisitedCount + 1,
      toastMessage: `Added "${product.name}" to cart`,
    });
  },

  updateCartItemQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      cartItems: get().cartItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              subtotal: Number((quantity * item.unitPrice).toFixed(2)),
            }
          : item,
      ),
    });
  },

  removeFromCart: (productId) => {
    set({
      cartItems: get().cartItems.filter((item) => item.productId !== productId),
      toastMessage: 'Item removed from cart',
    });
  },

  clearCart: () => set({ cartItems: [] }),

  checkoutOrder: (shippingAddress) => {
    const { cartItems, currentUser, orders, products } = get();
    if (cartItems.length === 0) return null;

    const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const newOrder: Order = {
      id: crypto.randomUUID(),
      orderNumber: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      userId: currentUser?.id ?? PLATFORM_PERSONAS[2].id,
      items: cartItems.map((item) => ({ ...item })),
      totalAmount: Number(totalAmount.toFixed(2)),
      status: 'PAID',
      shippingAddress: shippingAddress.trim() || '742 Cloud Native Blvd, San Francisco, CA',
      createdAt: new Date().toISOString(),
    };

    const updatedProducts = products.map((product) => {
      const purchased = cartItems.find((item) => item.productId === product.id);
      if (!purchased) return product;
      return {
        ...product,
        stockQuantity: Math.max(0, product.stockQuantity - purchased.quantity),
      };
    });

    set({
      orders: [newOrder, ...orders],
      products: updatedProducts,
      cartItems: [],
      isCartDrawerOpen: false,
      toastMessage: `Order ${newOrder.orderNumber} confirmed ($${newOrder.totalAmount.toLocaleString()})`,
    });

    return newOrder;
  },

  updateOrderStatus: (orderId, status) => {
    set({
      orders: get().orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
      toastMessage: `Order status updated to ${status}`,
    });
  },

  createProduct: (productInput) => {
    const category = get().categories.find((cat) => cat.id === productInput.categoryId);
    const newProduct: Product = {
      ...productInput,
      id: crypto.randomUUID(),
      categoryName: category?.name ?? 'Cloud Edge Hardware',
      createdAt: new Date().toISOString(),
    };
    set({
      products: [newProduct, ...get().products],
      toastMessage: `Published "${newProduct.name}" (${newProduct.sku})`,
    });
  },

  recordProductVisit: () => {
    set({ productsVisitedCount: get().productsVisitedCount + 1 });
  },

  switchDeploymentSlot: () => {
    const nextSlot: DeploymentSlot = get().activeDeploymentSlot === 'BLUE' ? 'GREEN' : 'BLUE';
    set({
      activeDeploymentSlot: nextSlot,
      toastMessage: `Zero-downtime traffic switched to ${nextSlot} environment`,
    });
  },

  setRolloutStrategy: (activeRolloutStrategy) => {
    set({
      activeRolloutStrategy,
      toastMessage: `Active rollout strategy set to ${activeRolloutStrategy}`,
    });
  },

  setCanaryWeight: (canaryWeight) => set({ canaryWeight }),

  simulateHpaLoadSpike: () => {
    const current = get().hpaReplicaCount;
    const next = current < 8 ? current + 2 : 3;
    set({
      hpaReplicaCount: next,
      toastMessage:
        next > 3
          ? `HPA scaled smartshop-backend up to ${next} replicas (CPU > 72%)`
          : 'HPA cooldown complete: scaled back to 3 baseline replicas',
    });
  },

  toggleFeatureFlag: (key) => {
    set({
      featureFlags: get().featureFlags.map((flag) =>
        flag.key === key ? { ...flag, enabled: !flag.enabled } : flag,
      ),
    });
  },

  clearToast: () => set({ toastMessage: null }),

  syncWithBackend: async () => {
    try {
      const [productsResp, categoriesResp, ordersResp] = await Promise.all([
        fetch('/api/v1/products'),
        fetch('/api/v1/categories'),
        fetch('/api/v1/orders'),
      ]);
      if (productsResp.ok) {
        const productsData: Product[] = await productsResp.json();
        if (Array.isArray(productsData) && productsData.length > 0) {
          set({ products: productsData });
        }
      }
      if (categoriesResp.ok) {
        const categoriesData: Category[] = await categoriesResp.json();
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          set({ categories: categoriesData });
        }
      }
      if (ordersResp.ok) {
        const ordersData: Order[] = await ordersResp.json();
        if (Array.isArray(ordersData) && ordersData.length > 0) {
          set({ orders: ordersData });
        }
      }
    } catch {
      // Uses deterministic cloud-native seed state when backend is offline
    }
  },
}));
