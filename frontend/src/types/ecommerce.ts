export type UserRole = 'ADMIN' | 'MANAGER' | 'CUSTOMER';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type NavigationTab = 'landing' | 'products' | 'cart' | 'dashboard' | 'login';

export type ThemeMode = 'dark' | 'light';

export type DeploymentSlot = 'BLUE' | 'GREEN';

export type RolloutStrategy =
  'BLUE_GREEN' | 'CANARY' | 'ROLLING' | 'RECREATE' | 'SHADOW' | 'FEATURE_FLAGS';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface NamespaceCostAllocation {
  namespace: string;
  cpuCostUsd: number;
  ramCostUsd: number;
  storageCostUsd: number;
  efficiencyScore: number;
  recommendation: string;
}
