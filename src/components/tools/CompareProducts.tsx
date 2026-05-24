import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { Sparkles, Trash2, ShoppingCart, Plus, Minimize2, Check, Star, AlertCircle, Share2 } from 'lucide-react';

export const CompareProducts: React.FC = () => {
  const { theme, addToCart } = useApp();
  const [comparedProducts, setComparedProducts] = useState<Product[]>(() => {
    // Start with 2 preselected popular items for premium UI experience
    return ALL_PRODUCTS.slice(0, 2);
  });
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const availableProducts = ALL_PRODUCTS.filter(p => !comparedProducts.some(cp => cp.productId === p.productId));

  const filteredDropdownProducts = availableProducts.filter(p => 
    p.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(filterSearch.toLowerCase())
  ).slice(0, 5);

  const handleAddProduct = (product: Product) => {
    if (comparedProducts.length >= 3) return;
    setComparedProducts([...comparedProducts, product]);
    setShowProductDropdown(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setComparedProducts(comparedProducts.filter(p => p.productId !== productId));
  };

  const handleShareComparison = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Get parsed spec keys
  const getCommonSpecKeys = () => {
    return ["Bulb Type", "Power", "Lumens", "Color", "Lifespan"];
  };

  const getSpecValue = (specsStr: string, key: string) => {
    const parts = specsStr.split('|');
    const match = parts.find(p => p.toLowerCase().includes(key.toLowerCase()));
    if (!match) return 'Standard Spec';
    const splitMatch = match.split(':');
    return splitMatch[1] ? splitMatch[1].trim() : match.trim();
  };

  return (
    <div id="compare-products-tool-view" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Headers */}
        <div className="mb-8 text-center flex flex-col items-center">
          <p className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-bold mb-1">AUTOMOTIVE FITMENT LAB</p>
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
            COMPARE PRODUCTS SPEC-BY-SPEC
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl">
            Compare side-by-side luminosity lumens, power draw, lifespan guarantees, and prices of up to 3 premium LED kits.
          </p>

          <div className="flex items-center gap-3 mt-4">
            {comparedProducts.length > 0 && (
              <button
                id="compare-btn-clearall"
                onClick={() => setComparedProducts([])}
                className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-mono text-[10px] uppercase rounded border border-neutral-800 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-500" /> Clear All Items
              </button>
            )}

            <button
              id="compare-btn-share"
              onClick={handleShareComparison}
              className="px-3.5 py-1.5 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-400 font-mono text-[10px] uppercase rounded border border-cyan-800/40 flex items-center gap-1 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" /> {copiedLink ? 'Link Copied To Clipboard!' : 'Share Comparison Matrix'}
            </button>
          </div>
        </div>

        {/* Matrix Box */}
        <div className={`rounded-xl border ${
          theme === 'light' ? 'bg-white border-neutral-200 shadow' : 'bg-neutral-900 border-neutral-805'
        } overflow-x-auto`}>
          
          <table className="w-full border-collapse text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="p-4 w-1/4 font-sans font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                  LED Spec Matrix
                </th>
                
                {/* 3 columns */}
                {[0, 1, 2].map(index => {
                  const product = comparedProducts[index];
                  return (
                    <th key={index} className="p-4 w-1/4 border-l border-neutral-800/40 relative">
                      {product ? (
                        <div className="flex flex-col gap-2">
                          <button
                            id={`remove-compare-item-${product.productId}`}
                            onClick={() => handleRemoveProduct(product.productId)}
                            className="absolute top-2 right-2 p-1 rounded-full text-neutral-500 hover:text-rose-500 hover:bg-neutral-950 transition cursor-pointer"
                            title="Remove item"
                          >
                            <Minimize2 className="h-3.5 w-3.5" />
                          </button>
                          
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            referrerPolicy="no-referrer"
                            className="h-28 w-full object-cover rounded border border-neutral-800 select-none"
                          />
                          <div>
                            <span className="font-mono text-[8px] bg-cyan-950/50 text-cyan-400 font-bold px-1 py-0.5 rounded uppercase">
                              {product.category}
                            </span>
                            <span className="font-sans font-black text-xs text-neutral-100 block truncate mt-1.5" title={product.name}>
                              {product.name}
                            </span>
                            <span className="font-bold text-xs text-amber-500 mt-1 block">
                              KES {product.price.toLocaleString()}
                            </span>
                          </div>
                          
                          <button
                            id={`compare-add-cart-${product.productId}`}
                            onClick={() => addToCart(product.productId)}
                            className="w-full py-1.5 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-[10px] font-sans font-black rounded flex items-center justify-center gap-1 cursor-pointer transition shadow"
                          >
                            <ShoppingCart className="h-3 w-3" /> Add To Basket
                          </button>
                        </div>
                      ) : (
                        <div className="h-44 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-800 rounded">
                          <Plus className="h-6 w-6 text-neutral-600 animate-pulse" />
                          <button
                            id={`trigger-add-column-${index}`}
                            onClick={() => setShowProductDropdown(true)}
                            className="text-[10px] font-mono hover:underline uppercase text-cyan-400 font-bold"
                          >
                            Add Spec Column
                          </button>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            
            <tbody>
              {/* Product ID Row */}
              <tr className="border-b border-neutral-800/40 text-xs">
                <td className="p-4 font-mono text-[10px] text-neutral-500 uppercase">Product ID</td>
                {[0, 1, 2].map(index => {
                  const product = comparedProducts[index];
                  return (
                    <td key={index} className="p-4 border-l border-neutral-800/40 font-mono text-[10px] text-neutral-300">
                      {product ? product.productId : '--'}
                    </td>
                  );
                })}
              </tr>

              {/* Pricing Row */}
              <tr className="border-b border-neutral-800/40 text-xs">
                <td className="p-4 font-mono text-[10px] text-neutral-500 uppercase">Cost (KES)</td>
                {[0, 1, 2].map(index => {
                  const product = comparedProducts[index];
                  return (
                    <td key={index} className="p-4 border-l border-neutral-800/40 font-bold text-neutral-100">
                      {product ? `KES ${product.price.toLocaleString()}` : '--'}
                    </td>
                  );
                })}
              </tr>

              {/* Ratings Row */}
              <tr className="border-b border-neutral-800/40 text-xs">
                <td className="p-4 font-mono text-[10px] text-neutral-500 uppercase">Driver Ratings</td>
                {[0, 1, 2].map(index => {
                  const product = comparedProducts[index];
                  return (
                    <td key={index} className="p-4 border-l border-neutral-800/40">
                      {product ? (
                        <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span>4.9 / 5 (Verified)</span>
                        </div>
                      ) : '--'}
                    </td>
                  );
                })}
              </tr>

              {/* Specs Rows dynamically mapped */}
              {getCommonSpecKeys().map(key => (
                <tr key={key} className="border-b border-neutral-800/40 text-xs text-neutral-300">
                  <td className="p-4 font-mono text-[10px] text-neutral-500 uppercase">{key}</td>
                  {[0, 1, 2].map(index => {
                    const product = comparedProducts[index];
                    return (
                      <td key={index} className="p-4 border-l border-neutral-800/40 font-sans font-medium text-neutral-100">
                        {product ? getSpecValue(product.specifications, key) : '--'}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* CANBUS Warn-Safe Row */}
              <tr className="border-b border-neutral-805 text-xs text-neutral-300">
                <td className="p-4 font-mono text-[10px] text-neutral-500 uppercase">anti-warn decoder</td>
                {[0, 1, 2].map(index => {
                  const product = comparedProducts[index];
                  return (
                    <td key={index} className="p-4 border-l border-neutral-800/40">
                      {product ? (
                        <span className="bg-emerald-950 text-emerald-400 font-bold text-[9px] font-mono px-2 py-0.5 rounded border border-emerald-900/30">
                          ✓ CANBUS Decoder Integrated
                        </span>
                      ) : '--'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>

          {showProductDropdown && (
            <div className="p-4 bg-neutral-950 border-t border-neutral-800">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">
                  Select Product to Add to Matrix (Max 3):
                </span>
                <button
                  id="compare-close-dropdown"
                  onClick={() => setShowProductDropdown(false)}
                  className="text-neutral-500 hover:text-neutral-300 text-xs font-semibold cursor-pointer"
                >
                  Close filter
                </button>
              </div>

              <input
                id="compare-search-product-input"
                type="text"
                placeholder="Filter search catalog..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="w-full max-w-sm py-1.5 px-3 rounded text-xs bg-neutral-900 text-neutral-100 border border-neutral-800 focus:outline-none mb-3"
              />

              {filteredDropdownProducts.length === 0 ? (
                <span className="text-xs text-neutral-500 block pb-2">No remaining products filter matching.</span>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {filteredDropdownProducts.map(p => (
                    <div 
                      id={`compare-option-item-${p.productId}`}
                      key={p.productId}
                      onClick={() => handleAddProduct(p)}
                      className="p-2.5 rounded bg-neutral-900 hover:bg-neutral-850 cursor-pointer text-xs border border-neutral-800 hover:border-cyan-500/30 flex items-center gap-3 transition"
                    >
                      <img src={p.imageUrl} alt="" referrerPolicy="referrer" className="h-8 w-8 object-cover rounded" />
                      <div className="min-w-0">
                        <span className="font-bold block truncate text-neutral-200">{p.name}</span>
                        <span className="text-[9px] text-cyan-400 font-mono tracking-wide">KES {p.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
