import React from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_PRODUCTS } from '../../data/products';
import { ShoppingCart, Trash2, Heart, ArrowRight } from 'lucide-react';

interface WishlistProps {
  onSelectProduct: (productId: string) => void;
  onNavigate: (page: string) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ onSelectProduct, onNavigate }) => {
  const { wishlist, toggleWishlist, addToCart, theme } = useApp();

  // Find full product details loaded in wishlist
  const wishfilled = ALL_PRODUCTS.filter(p => wishlist.includes(p.productId));

  return (
    <div id="wishlist-page-view" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8 font-sans">
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
            MY LED SAVED COLLECTIONS
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Build and compare your custom lighting retrofit bundles
          </p>
        </div>

        {wishfilled.length === 0 ? (
          <div className="py-16 text-center border border-neutral-900 rounded-lg bg-neutral-900/10 flex flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 rounded bg-neutral-900 text-neutral-400 flex items-center justify-center border border-neutral-800 shadow">
              <Heart className="h-6 w-6 text-rose-500 fill-rose-950" />
            </div>
            <div>
              <h4 className="font-bold text-neutral-200">No saved illumination packages</h4>
              <p className="text-xs text-neutral-500 mt-1">Save custom projector lenses and conversion items directly from our catalog menu.</p>
            </div>
            <button
              id="wishlist-empty-go-shop"
              onClick={() => onNavigate('shop')}
              className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-sans font-bold text-xs transition cursor-pointer"
            >
              Browse Shop Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishfilled.map(product => (
              <div
                id={`wish-item-${product.productId}`}
                key={product.productId}
                className="rounded-lg overflow-hidden border border-neutral-900 bg-neutral-900/10 hover:border-cyan-500/20 hover:bg-neutral-900/35 transition duration-200 flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-neutral-950 group">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-neutral-950/75 border border-neutral-800 text-neutral-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                    {product.category}
                  </span>
                  
                  {/* Delete button top right */}
                  <button
                    id={`wish-delete-${product.productId}`}
                    onClick={() => toggleWishlist(product.productId)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-red-950/80 hover:bg-red-900 border border-red-900/40 rounded text-red-400 hover:text-white transition cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-neutral-550 block font-bold">
                      ID: {product.productId}
                    </span>
                    <h5
                      onClick={() => onSelectProduct(product.productId)}
                      className="font-sans font-bold text-xs text-neutral-250 cursor-pointer hover:text-cyan-400 transition truncate"
                    >
                      {product.name}
                    </h5>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="border-t border-neutral-900 pt-3 flex items-center justify-between">
                    <span className="font-sans font-bold text-xs text-neutral-200">
                      KES {product.price.toLocaleString()}
                    </span>

                    <button
                      id={`wish-add-cart-${product.productId}`}
                      onClick={() => {
                        addToCart(product.productId);
                        // Optional removal on add
                      }}
                      className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-[10px] font-sans font-bold rounded flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="h-3 w-3" /> Add Cart
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
