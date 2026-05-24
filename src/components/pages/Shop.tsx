import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_PRODUCTS } from '../../data/products';
import { VEHICLE_DATABASE } from '../../data/vehicles';
import { Product } from '../../types';
import { Search, ShoppingCart, Heart, Eye, Filter, Sparkles, Check, CheckCircle2, ChevronRight } from 'lucide-react';

interface ShopProps {
  onSelectProduct: (productId: string) => void;
  initialFilterCategory?: string;
  initialSearchQuery?: string;
}

export const Shop: React.FC<ShopProps> = ({ 
  onSelectProduct, 
  initialFilterCategory = '', 
  initialSearchQuery = '' 
}) => {
  const { theme, addToCart, wishlist, toggleWishlist, selectedMake, selectedModel } = useApp();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialFilterCategory);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(35000);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [compatibilityVehicle, setCompatibilityVehicle] = useState<string>(`${selectedMake}#${selectedModel}`);

  // Quick View and Scroll to Top State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewQty, setQuickViewQty] = useState<number>(1);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const categories = [
    "All Categories",
    "Headlights",
    "Interior Lighting",
    "Headlight Projectors",
    "Fog Lights",
    "Accessories",
    "Taillights",
    "Angel Eyes & Halo Rings",
    "Turn Signals",
    "Exterior Accessories"
  ];

  // Sync initial values
  useEffect(() => {
    setSelectedCategory(initialFilterCategory);
  }, [initialFilterCategory]);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  // Apply filters and search queries
  useEffect(() => {
    let result = [...ALL_PRODUCTS];

    // 1. Search Query Match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.productId.toLowerCase().includes(q)
      );
    }

    // 2. Category Match
    if (selectedCategory && selectedCategory !== 'All Categories') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 3. Section Match
    if (selectedSection !== 'all') {
      result = result.filter(p => p.section === selectedSection);
    }

    // 3.5 Price match
    result = result.filter(p => p.price <= maxPrice);

    // 4. Sorting logic
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, selectedSection, sortBy, maxPrice]);

  // Check if a product fits the selected vehicle
  const getSimulatedFitmentText = (product: Product): { fits: boolean; reason: string } => {
    const selectedRecord = VEHICLE_DATABASE.find(v => `${v.make}#${v.model}` === compatibilityVehicle);
    if (!selectedRecord) {
      return { fits: true, reason: "Select compatibility model to test fit" };
    }
    
    const cat = product.category.toLowerCase();
    
    if (cat === 'headlights') {
      // Find low or high specs
      const lowFits = product.specifications.toLowerCase().includes(selectedRecord.headlightLow.toLowerCase().split(' ')[0]);
      const highFits = product.specifications.toLowerCase().includes(selectedRecord.headlightHigh.toLowerCase().split(' ')[0]);
      if (lowFits || highFits) {
        return { fits: true, reason: `Fits ${selectedRecord.make} ${selectedRecord.model} headlight low/high beam slots!` };
      }
      return { fits: false, reason: `Requires ${selectedRecord.headlightLow} low beam base adapter` };
    }

    if (cat === 'fog lights') {
      const fogFits = product.specifications.toLowerCase().includes(selectedRecord.fogLight.toLowerCase().split(' ')[0]);
      if (fogFits) {
        return { fits: true, reason: `Guaranteed matching plug-and-play fog light slot!` };
      }
      return { fits: false, reason: `Vehicle fog slot takes standard ${selectedRecord.fogLight}` };
    }

    if (cat === 'turn signals') {
      const matchFront = product.specifications.toLowerCase().includes(selectedRecord.turnSignalFront.toLowerCase());
      const matchRear = product.specifications.toLowerCase().includes(selectedRecord.turnSignalRear.toLowerCase());
      if (matchFront || matchRear) {
        return { fits: true, reason: "Matches turn flasher resistance loads exactly!" };
      }
      return { fits: true, reason: `Standard application fitment for indicators` };
    }

    // Universal categories
    if (cat === 'interior lighting' || cat === 'accessories' || cat === 'exterior accessories') {
      return { fits: true, reason: "Universal fitment. Designed for standard cabin 12V voltage." };
    }

    return { fits: true, reason: "Compatible retrofit with standard housing tools" };
  };

  const handleQuickViewAdd = () => {
    if (!quickViewProduct) return;
    for (let i = 0; i < quickViewQty; i++) {
      addToCart(quickViewProduct.productId);
    }
    setQuickViewProduct(null);
    setQuickViewQty(1);
  };

  return (
    <div id="shop-catalog-view-root" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title and Compatibility header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-neutral-900 pb-6">
          <div>
            <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
              Premium LED Catalog
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Showing {filteredProducts.length} expert-grade lighting configurations
            </p>
          </div>

          {/* Quick Fitment Active Selector */}
          <div className="bg-neutral-900/60 border border-cyan-500/15 rounded-lg p-3 text-xs flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] text-cyan-400 font-extrabold uppercase shrink-0">
               Testing Compatibility:
            </span>
            <select
              id="shop-fitment-tester-select"
              value={compatibilityVehicle}
              onChange={(e) => setCompatibilityVehicle(e.target.value)}
              className="bg-neutral-950 text-neutral-200 border border-neutral-800 rounded px-2.5 py-1 focus:outline-none text-xs font-semibold cursor-pointer"
            >
              <option value="">-- No Active Model --</option>
              {VEHICLE_DATABASE.map(v => (
                <option key={v.vehicleKey} value={v.vehicleKey}>
                  {v.make} {v.model}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Side filter panel */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-lg border sticky top-24 ${
              theme === 'light' ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-neutral-900/40 border-neutral-800/80 text-neutral-200'
            }`}>
              <div className="flex items-center gap-2 mb-6 text-sm font-bold uppercase font-sans border-b pb-3 border-neutral-900">
                <Filter className="h-4 w-4 text-cyan-500" /> Catalog Filters
              </div>

              {/* Live search input */}
              <div className="mb-6">
                <label className="block text-[10px] font-mono tracking-wider uppercase text-neutral-400 mb-2 font-bold">
                  Search Catalog
                </label>
                <input
                  id="shop-search-query-field"
                  type="text"
                  placeholder="Type product name, code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-1.5 px-3 rounded text-xs bg-neutral-950 text-neutral-100 border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Price Range Slider */}
              <div className="mb-6 border-t border-neutral-800/80 pt-4">
                <label className="block text-[10px] font-mono tracking-wider uppercase text-neutral-450 mb-2 font-black flex justify-between">
                  <span>Price Limit (KES)</span>
                  <span className="text-cyan-400 font-bold">KES {maxPrice.toLocaleString()}</span>
                </label>
                <input
                  id="shop-price-range-slider"
                  type="range"
                  min="1000"
                  max="35000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-950 accent-cyan-500 rounded-lg appearance-none cursor-pointer border border-neutral-800"
                />
                <div className="flex justify-between text-[9px] text-neutral-500 font-mono mt-1">
                  <span>KES 1,000</span>
                  <span>KES 35,000</span>
                </div>
              </div>

              {/* Interactive Categories list */}
              <div className="mb-6">
                <label className="block text-[10px] font-mono tracking-wider uppercase text-neutral-400 mb-2 font-bold">
                  Category
                </label>
                <div className="flex flex-col gap-1 text-xs">
                  {categories.map(cat => (
                    <button
                      id={`shop-cat-btn-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                      key={cat}
                      onClick={() => setSelectedCategory(cat === 'All Categories' ? '' : cat)}
                      className={`w-full text-left py-1.5 px-2 rounded hover:bg-neutral-800/40 transition flex items-center justify-between font-medium ${
                        (cat === 'All Categories' && !selectedCategory) || (cat === selectedCategory)
                          ? 'text-cyan-400 bg-cyan-950/20 font-bold border-l-2 border-cyan-400'
                          : 'text-neutral-400'
                      }`}
                    >
                      <span>{cat}</span>
                      {((cat === 'All Categories' && !selectedCategory) || (cat === selectedCategory)) && (
                        <Check className="h-3.5 w-3.5 text-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display section filter cards */}
              <div className="mb-6">
                <label className="block text-[10px] font-mono tracking-wider uppercase text-neutral-400 mb-2 font-bold">
                  Stock Section
                </label>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {[
                    { id: 'all', label: 'All Stock' },
                    { id: 'best-seller', label: 'Best Sellers' },
                    { id: 'new-arrival', label: 'New Arrivals' },
                    { id: 'deal', label: 'Cyber Deals' },
                    { id: 'accessory', label: 'Accessories' }
                  ].map(sec => (
                    <button
                      id={`shop-sec-btn-${sec.id}`}
                      key={sec.id}
                      onClick={() => setSelectedSection(sec.id)}
                      className={`py-1.5 px-2 rounded text-center border font-mono uppercase transition ${
                        selectedSection === sec.id
                          ? 'bg-cyan-500 text-neutral-950 border-cyan-400 font-bold'
                          : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting triggers */}
              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-neutral-400 mb-2 font-bold">
                  Order By:
                </label>
                <select
                  id="shop-sort-by-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full py-1.5 px-3 bg-neutral-950 text-neutral-100 border border-neutral-800 rounded text-xs focus:outline-none"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Alphabetical: A-Z</option>
                </select>
              </div>

            </div>
          </div>

          {/* Product grid container */}
          <div className="lg:col-span-3">
            {/* Breadcrumb row */}
            <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-neutral-500 uppercase">
              <span className="hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategory('')}>Home</span>
              <ChevronRight className="h-3 w-3" />
              <span className="hover:text-cyan-400 cursor-pointer" onClick={() => setSelectedCategory('')}>Catalog</span>
              {selectedCategory && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-cyan-400 font-bold">{selectedCategory}</span>
                </>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center rounded-lg border border-neutral-800 bg-neutral-900/10 flex flex-col items-center justify-center gap-4">
                <Sparkles className="h-10 w-10 text-neutral-600 animate-pulse" />
                <div>
                  <h4 className="font-bold text-neutral-200">No matching lights listed</h4>
                  <p className="text-xs text-neutral-500 mt-1">Try resetting your search query or choosing another category block</p>
                </div>
                <button
                  id="shop-reset-filters-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setSelectedSection('all');
                    setSortBy('featured');
                    setMaxPrice(35000);
                  }}
                  className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const inWish = wishlist.includes(product.productId);
                  const fitment = getSimulatedFitmentText(product);

                  return (
                    <div 
                      id={`shop-item-${product.productId}`}
                      key={product.productId}
                      className="rounded-lg overflow-hidden border border-neutral-900 bg-neutral-900/10 hover:border-cyan-500/25 hover:bg-neutral-900/40 transition duration-300 flex flex-col"
                    >
                      <div className="relative group/shop h-44 overflow-hidden bg-neutral-950">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none transition-all duration-300 group-hover/shop:scale-105"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-neutral-950/75 border border-neutral-800 text-neutral-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                          {product.category}
                        </span>

                        {/* Top-right section ribbon */}
                        {product.section !== 'accessory' && (
                          <span className="absolute top-2.5 right-2.5 bg-cyan-950/80 border border-cyan-800/40 text-cyan-400 text-[8px] font-mono uppercase font-black px-1.5 py-0.5 rounded">
                            {product.section}
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/shop:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                          <button
                            id={`quick-view-btn-${product.productId}`}
                            onClick={() => { setQuickViewProduct(product); setQuickViewQty(1); }}
                            className="px-3 py-1.5 rounded bg-neutral-900 text-neutral-200 border border-neutral-800 text-[8px] font-mono uppercase font-extrabold hover:text-white transition cursor-pointer"
                            title="Quick Specs Inspect"
                          >
                            Quick View
                          </button>
                          <button
                            id={`inspect-shop-${product.productId}`}
                            onClick={() => onSelectProduct(product.productId)}
                            className="p-2 rounded-full bg-cyan-400 text-neutral-950 hover:bg-cyan-300 transition shrink-0 cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            id={`fav-shop-${product.productId}`}
                            onClick={() => toggleWishlist(product.productId)}
                            className={`p-2 rounded-full transition shrink-0 cursor-pointer relative ${
                              inWish ? 'bg-rose-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
                            }`}
                            title="Add to Wishlist"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                        <div className="space-y-1">
                          <span className="font-mono text-[9px] text-neutral-500 font-bold block">
                            CODE: {product.productId}
                          </span>
                          <h6 
                            onClick={() => onSelectProduct(product.productId)}
                            className="font-sans font-bold text-xs text-neutral-200 hover:text-cyan-400 transition line-clamp-1 cursor-pointer"
                          >
                            {product.name}
                          </h6>
                          
                          {/* Rating stars layout */}
                          <div className="flex items-center gap-1 text-amber-500 mt-1">
                            <span className="text-xs leading-none">★★★★★</span>
                            <span className="text-[9px] text-neutral-500 font-mono leading-none">(4.9)</span>
                          </div>

                          <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* Fitment Indicator bar if vehicle selected */}
                        {compatibilityVehicle && (
                          <div className={`p-1.5 rounded text-[9px] font-mono mt-1 ${
                            fitment.fits 
                              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/30' 
                              : 'bg-amber-950/40 text-amber-300 border border-amber-900/30'
                          }`}>
                            <div className="flex items-start gap-1 max-w-full">
                              <CheckCircle2 className={`h-3 w-3 shrink-0 mt-0.5 ${fitment.fits ? 'text-emerald-400' : 'text-amber-400'}`} />
                              <span className="truncate">{fitment.reason}</span>
                            </div>
                          </div>
                        )}

                        <div className="border-t border-neutral-900/80 pt-3 flex items-center justify-between">
                          <div>
                            <span className="text-[8px] text-neutral-400 block font-mono leading-none">KES COST</span>
                            <span className="font-sans font-black text-sm text-neutral-200 block mt-0.5">
                              {product.price.toLocaleString()}
                            </span>
                          </div>

                          <button
                            id={`add-shop-${product.productId}`}
                            onClick={() => addToCart(product.productId)}
                            className="px-3.5 py-1.5 font-sans font-bold text-[10px] rounded bg-cyan-500 text-neutral-950 hover:bg-cyan-400 transition flex items-center gap-1 cursor-pointer"
                          >
                            <ShoppingCart className="h-3 w-3" /> Add
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 8. ELITE QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div id="shop-quickview-modal-backdrop" className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all">
          <div 
            id="shop-quickview-modal-content"
            className={`w-full max-w-lg rounded-xl overflow-hidden border shadow-2xl transition-all duration-300 flex flex-col bg-neutral-950 border-cyan-500/10 text-neutral-200`}
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-800/60 flex justify-between items-center bg-neutral-950">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest leading-none">Catalog Quick Inspect</span>
                <h4 className="font-sans font-black text-sm text-white uppercase tracking-tight truncate max-w-sm mt-1">{quickViewProduct.name}</h4>
              </div>
              <button
                id="shop-quick-close-btn"
                onClick={() => { setQuickViewProduct(null); setQuickViewQty(1); }}
                className="p-1 px-2.5 rounded text-neutral-400 bg-neutral-900/80 hover:bg-neutral-800 text-[11px] font-mono hover:text-white transition cursor-pointer"
              >
                ESC CLOSE
              </button>
            </div>

            {/* Modal Body scroll */}
            <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-44 rounded-lg overflow-hidden bg-black border border-neutral-800">
                  <img 
                    src={quickViewProduct.imageUrl} 
                    alt={quickViewProduct.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-pink-500 font-bold">In Stock & Road Safe</span>
                    <h5 className="font-sans font-extrabold text-sm mt-1">{quickViewProduct.name}</h5>
                    <div className="flex items-center gap-1 text-amber-400 my-1">
                      <span className="text-xs">★★★★★</span>
                      <span className="text-[9px] text-neutral-500 font-mono">(4.9/5)</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">{quickViewProduct.description}</p>
                  </div>

                  <div className="border-t border-neutral-905 pt-3 mt-2">
                    <span className="text-[8px] text-neutral-500 font-mono block">MAPPED UNIT COST</span>
                    <span className="font-sans font-black text-md text-cyan-400 block mt-0.5">KES {quickViewProduct.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Specifications block */}
              <div className="border border-neutral-800 bg-neutral-900/10 rounded-lg p-3.5 space-y-2">
                <span className="font-mono text-[9px] uppercase text-cyan-400 font-bold block">Retrofitting Specifications</span>
                <table className="w-full text-[10px] text-neutral-400">
                  <tbody>
                    <tr>
                      <td className="py-1 font-mono text-[9px] text-neutral-500 uppercase text-left">Category:</td>
                      <td className="py-1 text-right text-neutral-200">{quickViewProduct.category}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-[9px] text-neutral-500 uppercase text-left">Stock Section:</td>
                      <td className="py-1 text-right text-neutral-200 uppercase">{quickViewProduct.section}</td>
                    </tr>
                    {quickViewProduct.specifications && Object.entries(quickViewProduct.specifications).map(([key, val]) => (
                      <tr key={key}>
                        <td className="py-1 font-mono text-[9px] text-neutral-500 uppercase text-left">{key}:</td>
                        <td className="py-1 text-right text-neutral-200 truncate max-w-[200px]" title={String(val)}>{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Controls */}
              <div className="border-t border-neutral-900 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-500 font-mono">QUANTITY:</span>
                  <div className="flex items-center border border-neutral-800 rounded overflow-hidden">
                    <button
                      id="shop-modal-qty-dec"
                      onClick={() => setQuickViewQty(q => Math.max(1, q - 1))}
                      className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 transition text-[11px] font-mono cursor-pointer"
                    >
                      -
                    </button>
                    <span id="shop-modal-qty-val" className="px-3.5 py-1 text-xs font-mono font-bold bg-neutral-950">{quickViewQty}</span>
                    <button
                      id="shop-modal-qty-inc"
                      onClick={() => setQuickViewQty(q => q + 1)}
                      className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 transition text-[11px] font-mono cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  id="shop-modal-add-btn"
                  onClick={handleQuickViewAdd}
                  className="w-full sm:w-auto px-5 py-2 rounded bg-cyan-400 text-neutral-950 hover:bg-cyan-300 font-sans font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <ShoppingCart className="h-4 w-4" /> Add {quickViewQty > 1 ? `${quickViewQty}x` : ''} to Basket ({ (quickViewProduct.price * quickViewQty).toLocaleString() } KES)
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 9. BACK TO TOP SMOOTH FLOATER BUTTON */}
      {showBackToTop && (
        <button
          id="shop-back-to-top-floater"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-cyan-400 text-neutral-950 font-black shadow-cyan-500/20 hover:bg-cyan-300 transform scale-100 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg animate-bounce"
          title="Smooth Scroll to Top"
        >
          ▲
        </button>
      )}

    </div>
  );
};
