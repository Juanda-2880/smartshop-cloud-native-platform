import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Cpu, Eye, ShoppingCart, Sparkles } from 'lucide-react';
import type { Product } from '../../types/ecommerce';
import { Button } from '../atoms/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onInspect?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onInspect }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1100);
  };

  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 20;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="surface-card rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-blue-500/40 transition-colors"
    >
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-slate-950/80 text-slate-200 border border-white/10 backdrop-blur-md">
              {product.sku}
            </span>
            {product.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-600/90 text-white backdrop-blur-md">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                Featured
              </span>
            )}
          </div>

          {onInspect && (
            <button
              type="button"
              onClick={() => onInspect(product)}
              aria-label={`Inspect technical specifications for ${product.name}`}
              className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-slate-950/75 text-slate-200 hover:text-white hover:bg-blue-600 border border-white/15 flex items-center justify-center cursor-pointer transition-colors"
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Cpu className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
              {product.categoryName}
            </span>
            <span
              className={
                isLowStock
                  ? 'px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 font-medium'
                  : 'px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-medium'
              }
            >
              {product.stockQuantity} in stock
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-base font-bold tracking-tight text-[var(--text-primary)] group-hover:text-blue-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-2 text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
            Enterprise Price
          </span>
          <span className="text-lg font-extrabold font-mono text-[var(--text-primary)]">
            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <Button
          variant={justAdded ? 'secondary' : 'primary'}
          size="md"
          onClick={handleAdd}
          disabled={product.stockQuantity <= 0}
          aria-label={`Add ${product.name} to cart`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" aria-hidden="true" />
              <span>Add to Cart</span>
            </>
          )}
        </Button>
      </div>
    </motion.article>
  );
}
