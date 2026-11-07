import { useMemo, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Plus, RefreshCw, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import type { Product } from '../../types/ecommerce';
import { Button } from '../../components/atoms/Button';
import { ProductCardSkeleton } from '../../components/atoms/Skeleton';
import { ProductCard } from '../../components/molecules/ProductCard';

export function CatalogView() {
  const {
    products,
    categories,
    addToCart,
    isLoadingSkeleton,
    triggerSkeletonPreview,
    currentUser,
    createProduct,
    recordProductVisit,
  } = usePlatformStore();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'stock'>(
    'featured',
  );
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // New Product Form State
  const [newSku, setNewSku] = useState('SKU-K8S-NODE-09');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('1299');
  const [newStock, setNewStock] = useState('25');
  const [newCategoryId, setNewCategoryId] = useState(categories[0]?.id ?? '');

  const canManageCatalog = currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER';

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategoryId === 'ALL' || product.categoryId === selectedCategoryId;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'stock') return b.stockQuantity - a.stockQuantity;
        return Number(b.featured) - Number(a.featured);
      });
  }, [products, selectedCategoryId, searchQuery, sortBy]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    triggerSkeletonPreview();
  };

  const handleInspect = (product: Product) => {
    recordProductVisit();
    setInspectedProduct(product);
  };

  const handleCreateProduct = (event: FormEvent) => {
    event.preventDefault();
    if (!newName.trim() || !newSku.trim()) return;
    createProduct({
      sku: newSku.trim().toUpperCase(),
      name: newName.trim(),
      description:
        newDescription.trim() ||
        'Cloud-native hardware appliance validated for Kubernetes 1.34 production clusters.',
      price: Math.max(1, Number(newPrice) || 999),
      stockQuantity: Math.max(1, Number(newStock) || 10),
      categoryId: newCategoryId || categories[0].id,
      imageUrl:
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
      featured: true,
      active: true,
    });
    setNewName('');
    setNewDescription('');
    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header & Admin Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-blue-500 font-semibold">
            Hexagonal Catalog Adapter • /api/v1/products
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
            Enterprise Cloud & Edge Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Browse hardware nodes, developer workstations, FIDO2 OIDC tokens, and telemetry
            switches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={triggerSkeletonPreview}>
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Preview Skeleton Loader</span>
          </Button>
          {canManageCatalog && (
            <Button variant="primary" size="md" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Catalog Product ({currentUser?.role})</span>
            </Button>
          )}
        </div>
      </div>

      {/* Search, Sort & Category Filter Bar */}
      <div className="surface-card rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <label htmlFor="catalog-search-input" className="sr-only">
              Search products by name, SKU, or specification
            </label>
            <Search
              className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              id="catalog-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU (e.g. SKU-K8S-BLADE-01), product name, or workload..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl surface-elevated text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <SlidersHorizontal
              className="w-4 h-4 text-[var(--text-muted)] shrink-0"
              aria-hidden="true"
            />
            <label htmlFor="catalog-sort-select" className="text-xs font-semibold shrink-0">
              Sort by:
            </label>
            <select
              id="catalog-sort-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'stock')
              }
              className="w-full min-h-[44px] px-3 py-2 rounded-xl surface-elevated text-xs font-semibold text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="featured">Featured & Priority</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock">Available Inventory</option>
            </select>
          </div>
        </div>

        {/* Category Pills with Framer Motion layoutId */}
        <div
          role="tablist"
          aria-label="Product categories"
          className="flex items-center gap-2 overflow-x-auto pb-1"
        >
          <Filter className="w-4 h-4 text-blue-500 shrink-0 mr-1" aria-hidden="true" />
          {[
            { id: 'ALL', name: 'All Categories' },
            ...categories.map((cat) => ({ id: cat.id, name: cat.name })),
          ].map((tab) => {
            const active = selectedCategoryId === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => handleCategoryChange(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors min-h-[38px] ${
                  active
                    ? 'text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 rounded-xl bg-blue-600"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid or Skeleton Shimmer State */}
      {isLoadingSkeleton ? (
        <div
          aria-label="Loading products"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="surface-card rounded-2xl p-12 text-center space-y-3">
          <p className="text-base font-bold">No products matched your filter criteria</p>
          <p className="text-xs text-[var(--text-muted)]">
            Try clearing your search query or switching to All Categories.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategoryId('ALL');
              setSearchQuery('');
            }}
          >
            Reset Catalog Filters
          </Button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(selected) => addToCart(selected, 1)}
                onInspect={handleInspect}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Product Technical Specification Modal */}
      <AnimatePresence>
        {inspectedProduct && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inspect-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="surface-elevated rounded-2xl max-w-lg w-full p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-blue-400 font-semibold">
                    {inspectedProduct.sku} • {inspectedProduct.categoryName}
                  </span>
                  <h2 id="inspect-modal-title" className="text-xl font-extrabold mt-1">
                    {inspectedProduct.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedProduct(null)}
                  aria-label="Close specification modal"
                  className="w-9 h-9 rounded-lg surface-card flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <img
                src={inspectedProduct.imageUrl}
                alt={inspectedProduct.name}
                className="w-full h-52 object-cover rounded-xl"
              />

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {inspectedProduct.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl surface-card">
                  <span className="text-[var(--text-muted)] block">Unit Price</span>
                  <span className="text-base font-bold">
                    ${inspectedProduct.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="p-3 rounded-xl surface-card">
                  <span className="text-[var(--text-muted)] block">Warehouse Stock</span>
                  <span className="text-base font-bold text-emerald-500">
                    {inspectedProduct.stockQuantity} units ready
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="md" onClick={() => setInspectedProduct(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    addToCart(inspectedProduct, 1);
                    setInspectedProduct(null);
                  }}
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Add to Cart</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin / Manager Create Product Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-product-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.form
              onSubmit={handleCreateProduct}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="surface-elevated rounded-2xl max-w-lg w-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 id="create-product-modal-title" className="text-lg font-extrabold">
                  Publish New Catalog Product
                </h2>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  aria-label="Close modal"
                  className="w-9 h-9 rounded-lg surface-card flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-product-sku" className="block text-xs font-semibold mb-1">
                    SKU Code
                  </label>
                  <input
                    id="new-product-sku"
                    type="text"
                    required
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full min-h-[42px] px-3 rounded-xl surface-card text-xs font-mono"
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-product-category"
                    className="block text-xs font-semibold mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="new-product-category"
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full min-h-[42px] px-3 rounded-xl surface-card text-xs"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="new-product-name" className="block text-xs font-semibold mb-1">
                  Product Name
                </label>
                <input
                  id="new-product-name"
                  type="text"
                  required
                  placeholder="e.g. RackScale EPYC Kubernetes Node"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl surface-card text-sm"
                />
              </div>

              <div>
                <label htmlFor="new-product-desc" className="block text-xs font-semibold mb-1">
                  Technical Specification
                </label>
                <textarea
                  id="new-product-desc"
                  rows={3}
                  placeholder="Describe compute, storage, or telemetry capabilities..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 rounded-xl surface-card text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-product-price" className="block text-xs font-semibold mb-1">
                    Unit Price (USD)
                  </label>
                  <input
                    id="new-product-price"
                    type="number"
                    min="1"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full min-h-[42px] px-3 rounded-xl surface-card text-sm font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="new-product-stock" className="block text-xs font-semibold mb-1">
                    Initial Stock
                  </label>
                  <input
                    id="new-product-stock"
                    type="number"
                    min="1"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full min-h-[42px] px-3 rounded-xl surface-card text-sm font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button variant="outline" size="md" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Publish Product
                </Button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
