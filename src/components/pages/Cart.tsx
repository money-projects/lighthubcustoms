import React from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_PRODUCTS } from '../../data/products';
import { Trash2, ShoppingBag, ArrowRight, HelpCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface CartProps {
  onNavigate: (page: string) => void;
}

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, theme } = useApp();

  // Combine cart references with full product model datasets
  const cartItemsDetailed = cart.map(item => {
    const matchedProduct = ALL_PRODUCTS.find(p => p.productId === item.productId);
    return {
      ...item,
      product: matchedProduct
    };
  }).filter(item => item.product !== undefined) as {
    productId: string;
    quantity: number;
    addedAt: string;
    product: typeof ALL_PRODUCTS[0];
  }[];

  // Calculations
  const subtotal = cartItemsDetailed.reduce((acc, curr) => {
    return acc + (curr.product.price * curr.quantity);
  }, 0);

  // Kenya Flat Delivery Standard
  const shippingFlat = subtotal > 15000 ? 0 : 250;
  const totalCost = subtotal + shippingFlat;

  return (
    <div id="shopping-cart-container" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="mb-8 font-sans">
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
            Shopping Cart Bag
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your automotive conversion selections
          </p>
        </div>

        {cartItemsDetailed.length === 0 ? (
          <div className="py-16 text-center border border-neutral-900 rounded-lg bg-neutral-900/10 flex flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 rounded bg-neutral-900 text-neutral-400 flex items-center justify-center border border-neutral-800 shadow">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-neutral-200">Your basket bag is empty</h4>
              <p className="text-xs text-neutral-500 mt-1">Navigate back to the catalog to choose your conversion lights kit.</p>
            </div>
            <button
              id="cart-empty-go-shop"
              onClick={() => onNavigate('shop')}
              className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-sans font-bold text-xs transition cursor-pointer"
            >
              Go To Shop Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* List column */}
            <div className="lg:col-span-2 space-y-4">
              
              <div className="flex items-center justify-between border-b pb-2.5 border-neutral-800">
                <span className="text-xs font-mono uppercase text-neutral-500 font-bold">Product Item Specifications</span>
                <button
                  id="cart-clear-all-trigger"
                  onClick={clearCart}
                  className="text-xs text-rose-400 hover:underline hover:text-rose-300 font-bold"
                >
                  Clear All Selection
                </button>
              </div>

              {cartItemsDetailed.map((item, index) => (
                <div 
                  id={`cart-row-${index}`}
                  key={item.productId}
                  className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900/40 border-neutral-800/80 hover:border-cyan-500/10'
                  }`}
                >
                  {/* Photo and brand name */}
                  <div className="flex gap-4">
                    <img 
                      src={item.product?.imageUrl} 
                      alt={item.product?.name} 
                      referrerPolicy="no-referrer"
                      className="h-16 w-16 object-cover rounded border border-neutral-800 bg-neutral-950 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-wider block">
                        Category: {item.product?.category}
                      </span>
                      <h5 className="font-sans font-bold text-xs text-neutral-200 block truncate">
                        {item.product?.name}
                      </h5>
                      <span className="font-mono text-[10px] text-neutral-400 font-bold block mt-1">
                        KES {item.product?.price.toLocaleString()} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity adjusting blocks and total */}
                  <div className="flex items-center justify-between sm:justify-start gap-8">
                    
                    {/* Stepper buttons */}
                    <div className="flex items-center border border-neutral-800 bg-neutral-950 rounded overflow-hidden">
                      <button
                        id={`cart-decrease-${item.productId}`}
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs font-mono font-bold hover:bg-neutral-900 text-neutral-400 transition"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-mono text-xs font-bold text-neutral-200 border-l border-r border-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        id={`cart-increase-${item.productId}`}
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs font-mono font-bold hover:bg-neutral-900 text-neutral-400 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Cost counter */}
                    <div className="text-right min-w-[90px]">
                      <span className="text-[10px] text-neutral-500 font-mono block leading-none">SUBTOTAL</span>
                      <span className="font-mono font-bold text-xs text-neutral-200 block mt-1">
                        KES {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    {/* Trash removal */}
                    <button
                      id={`cart-delete-${item.productId}`}
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1.5 rounded hover:bg-rose-950/20 text-neutral-500 hover:text-rose-400 transition"
                      title="Remove product"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>

                  </div>

                </div>
              ))}
            </div>

            {/* Calculations Summary right sidebar */}
            <div className="lg:col-span-1">
              <div className={`p-6 rounded-lg border ${
                theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'
              }`}>
                <h3 className="font-sans font-bold text-md text-neutral-100 border-b pb-3.5 border-neutral-800 mb-4">
                  Basket Billing Summary
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Products Subtotal:</span>
                    <span className="text-neutral-200">KES {subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-neutral-400">
                    <span>Delivery Target Tax:</span>
                    <span className="text-neutral-200">
                      {shippingFlat === 0 ? 'FREE Over KES 15k' : `KES ${shippingFlat.toLocaleString()}`}
                    </span>
                  </div>

                  {shippingFlat > 0 && (
                    <p className="text-[10px] text-amber-500 leading-normal mt-0.5">
                      💡 Tip: Add KES {(15000 - subtotal).toLocaleString()} more to instantly qualify for Free Express Shipping county-wide!
                    </p>
                  )}

                  <div className="border-t border-neutral-800/80 pt-3.5 flex justify-between font-bold text-sm">
                    <span className="text-neutral-300">ESTIMATED TOTAL:</span>
                    <span className="text-cyan-400">KES {totalCost.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  id="checkout-funnel-trigger-cta"
                  onClick={() => onNavigate('checkout')}
                  className="w-full py-2.5 rounded bg-cyan-500 text-neutral-950 font-sans font-black text-xs hover:bg-cyan-400 transition shadow mt-6 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Proceed to Secure Checkout <ArrowRight className="h-4 w-4" />
                </button>

                {/* System integrity note */}
                <div className="p-3 bg-neutral-950/40 rounded border border-neutral-900 flex gap-2 text-[10px] text-neutral-500 mt-4 leading-relaxed">
                  <ShieldAlert className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Your secure connection will submit this checkout payload through standard protected AWS servers. MPesa prompt pins are never cached.
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
