import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VEHICLE_DATABASE } from '../../data/vehicles';
import { ALL_PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { CheckCircle2, XCircle, Search, HelpCircle, ShoppingCart, RefreshCw, Car } from 'lucide-react';

export const CompatibilityChecker: React.FC = () => {
  const { theme, addToCart } = useApp();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(ALL_PRODUCTS[0]);
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Corolla');
  const [year, setYear] = useState('2018');
  
  const [checked, setChecked] = useState(false);
  const [isCompatible, setIsCompatible] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [alternativeProducts, setAlternativeProducts] = useState<Product[]>([]);

  const uniqueMakes = Array.from(new Set(VEHICLE_DATABASE.map(v => v.make))).sort();
  const modelOptions = VEHICLE_DATABASE.filter(v => v.make === make).map(v => v.model).sort();

  useEffect(() => {
    if (modelOptions.length > 0 && !modelOptions.includes(model)) {
      setModel(modelOptions[0]);
    }
  }, [make]);

  const filteredDropdownProducts = ALL_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchProductQuery.toLowerCase())
  ).slice(0, 5);

  const handleRunCheck = () => {
    if (!selectedProduct) return;
    
    const vehicle = VEHICLE_DATABASE.find(v => v.make === make && v.model === model);
    if (!vehicle) {
      setIsCompatible(false);
      setExplanation(`We couldn't verify fitment because the ${make} ${model} setup is not fully cataloged. Please contact support!`);
      setAlternativeProducts([]);
      setChecked(true);
      return;
    }

    const cat = selectedProduct.category.toLowerCase();
    const specs = selectedProduct.specifications.toLowerCase();
    const prodName = selectedProduct.name.toLowerCase();

    let fits = false;
    let reason = '';

    if (cat.includes('headlight')) {
      const lowMatches = specs.includes(vehicle.headlightLow.toLowerCase().split(' ')[0]) || prodName.includes(vehicle.headlightLow.toLowerCase().split(' ')[0]);
      const highMatches = specs.includes(vehicle.headlightHigh.toLowerCase().split(' ')[0]) || prodName.includes(vehicle.headlightHigh.toLowerCase().split(' ')[0]);
      
      if (lowMatches || highMatches) {
        fits = true;
        reason = `Verified Match! This headlight kit fits your ${make} ${model}'s headlight sockets (Low: ${vehicle.headlightLow} / High: ${vehicle.headlightHigh}).`;
      } else {
        fits = false;
        reason = `Not a direct fit. Your ${make} ${model} utilizes ${vehicle.headlightLow} for Low Beams and ${vehicle.headlightHigh} for High Beams. This item code has different adapters.`;
      }
    } else if (cat.includes('fog')) {
      const fogMatches = specs.includes(vehicle.fogLight.toLowerCase().split(' ')[0]) || prodName.includes(vehicle.fogLight.toLowerCase().split(' ')[0]);
      
      if (fogMatches) {
        fits = true;
        reason = `Verified Match! This fog light bulb aligns perfectly with your vehicle's ${vehicle.fogLight} fog light housing.`;
      } else {
        fits = false;
        reason = `Not a direct fit. Your ${make} ${model} takes ${vehicle.fogLight} fog light bulbs.`;
      }
    } else if (cat.includes('signal') || cat.includes('turn')) {
      const signalMatches = specs.includes(vehicle.turnSignalFront.toLowerCase().split(' ')[0]) || prodName.includes(vehicle.turnSignalFront.toLowerCase().split(' ')[0]);
      
      if (signalMatches) {
        fits = true;
        reason = `Verified Match! Operates perfectly as a ${vehicle.turnSignalFront} turn signal or indicator upgrade.`;
      } else {
        fits = false;
        reason = `Incorrect bulb size. Your turn signal bulbs conform to the ${vehicle.turnSignalFront} spec.`;
      }
    } else {
      // Universal accessories
      fits = true;
      reason = `Universal Fitting. This interior lighting kit or accessory is fully compatible with any standard ${year} ${make} ${model} 12V electrical infrastructure.`;
    }

    setIsCompatible(fits);
    setExplanation(reason);
    
    // Generate alternatives if not matching
    if (!fits) {
      const alt = ALL_PRODUCTS.filter(p => 
        p.category === selectedProduct.category && 
        p.productId !== selectedProduct.productId
      ).slice(0, 3);
      setAlternativeProducts(alt);
    } else {
      setAlternativeProducts([]);
    }

    setChecked(true);
  };

  return (
    <div id="compatibility-checker-tool-view" className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Banner Headers */}
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-bold mb-1">AUTOMOTIVE FITMENT LAB</p>
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
            COMPATIBILITY CHECKER
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
            Choose any product from our inventory and pair it with your vehicle to check for standard socket, wiring, and heat-sink compatibility.
          </p>
        </div>

        <div className={`p-6 rounded-xl border ${
          theme === 'light' ? 'bg-white border-neutral-200 shadow' : 'bg-neutral-900 border-neutral-800'
        }`}>
          
          <div className="space-y-6">
            
            {/* Step 1: Select Product */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                1. Select Bulb or Laser Product
              </label>
              
              <div className="relative">
                <div 
                  id="compat-product-input-wrapper"
                  onClick={() => setShowProductDropdown(!showProductDropdown)}
                  className={`p-3 rounded border text-xs cursor-pointer flex items-center justify-between transition ${
                    theme === 'light' ? 'bg-neutral-50 border-neutral-300 text-neutral-900' : 'bg-neutral-950 border-neutral-800 text-neutral-200 hover:border-neutral-700'
                  }`}
                >
                  {selectedProduct ? (
                    <div className="flex items-center gap-3">
                      <img src={selectedProduct.imageUrl} alt="" referrerPolicy="referrer" className="h-8 w-8 object-cover rounded" />
                      <div>
                        <span className="font-bold block">{selectedProduct.name}</span>
                        <span className="text-[10px] text-cyan-400 font-mono tracking-tight">{selectedProduct.category} &bull; KES {selectedProduct.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-neutral-500">Click to select an automotive bulb</span>
                  )}
                  <RefreshCw className="h-4 w-4 text-cyan-500 shrink-0" />
                </div>

                {showProductDropdown && (
                  <div className="absolute left-0 right-0 mt-2 p-2 rounded-lg border bg-neutral-950 border-neutral-850 shadow-xl z-50">
                    <input
                      id="compat-product-search-input"
                      type="text"
                      placeholder="Type component name to filter..."
                      value={searchProductQuery}
                      onChange={(e) => setSearchProductQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-1.5 px-3 rounded text-xs bg-neutral-900 text-neutral-100 border border-neutral-800 focus:outline-none mb-2"
                    />
                    <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                      {filteredDropdownProducts.map(p => (
                        <div
                          id={`compat-dropdown-item-${p.productId}`}
                          key={p.productId}
                          onClick={() => {
                            setSelectedProduct(p);
                            setShowProductDropdown(false);
                            setChecked(false);
                          }}
                          className="p-2 rounded hover:bg-neutral-900 text-xs text-neutral-300 cursor-pointer flex items-center gap-3"
                        >
                          <img src={p.imageUrl} alt="" referrerPolicy="referrer" className="h-7 w-7 object-cover rounded" />
                          <div className="min-w-0">
                            <span className="font-semibold block truncate text-neutral-200">{p.name}</span>
                            <span className="text-[10px] text-neutral-500 font-mono block uppercase">{p.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Select Vehicle */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                2. Enter Target Vehicle Details
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="block text-[10px] uppercase font-mono text-neutral-500 mb-1.5">Manufacturer</span>
                  <select
                    id="compat-make-select"
                    value={make}
                    onChange={(e) => { setMake(e.target.value); setChecked(false); }}
                    className={`w-full py-2 px-3 rounded text-xs font-semibold focus:outline-none cursor-pointer ${
                      theme === 'light' ? 'bg-neutral-50 text-neutral-900 border border-neutral-200' : 'bg-neutral-950 text-neutral-200 border border-neutral-800'
                    }`}
                  >
                    {uniqueMakes.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-mono text-neutral-500 mb-1.5">Model</span>
                  <select
                    id="compat-model-select"
                    value={model}
                    onChange={(e) => { setModel(e.target.value); setChecked(false); }}
                    className={`w-full py-2 px-3 rounded text-xs font-semibold focus:outline-none cursor-pointer ${
                      theme === 'light' ? 'bg-neutral-50 text-neutral-900 border border-neutral-200' : 'bg-neutral-950 text-neutral-200 border border-neutral-800'
                    }`}
                  >
                    {modelOptions.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-mono text-neutral-500 mb-1.5">Fitting Year</span>
                  <select
                    id="compat-year-select"
                    value={year}
                    onChange={(e) => { setYear(e.target.value); setChecked(false); }}
                    className={`w-full py-2 px-3 rounded text-xs font-semibold focus:outline-none cursor-pointer ${
                      theme === 'light' ? 'bg-neutral-50 text-neutral-900 border border-neutral-200' : 'bg-neutral-950 text-neutral-200 border border-neutral-800'
                    }`}
                  >
                    {['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-2">
              <button
                id="compat-run-checker-btn"
                onClick={handleRunCheck}
                disabled={!selectedProduct}
                className="w-full py-3 rounded-lg bg-cyan-500 text-neutral-950 hover:bg-cyan-400 font-sans font-black text-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
              >
                <Car className="h-4 w-4" /> Check Vehicle Compatibility
              </button>
            </div>

            {/* Results display */}
            {checked && (
              <div className={`mt-6 p-5 rounded-lg border transition-all duration-300 ${
                isCompatible 
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100' 
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-100'
              }`}>
                <div className="flex items-start gap-3">
                  {isCompatible ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-sans font-black text-sm uppercase tracking-tight">
                      {isCompatible ? '✓ FITS YOUR VEHICLE' : '✗ NOT COMPATIBLE'}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1 max-w-xl leading-relaxed">
                      {explanation}
                    </p>

                    {isCompatible && selectedProduct && (
                      <button
                        id="compat-add-to-cart-success"
                        onClick={() => addToCart(selectedProduct.productId)}
                        className="mt-4 px-4 py-2 bg-emerald-500 text-neutral-950 hover:bg-emerald-400 rounded text-[11px] font-bold font-sans flex items-center gap-1.5 transition"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" /> Buy Compatible Product (KES {selectedProduct.price.toLocaleString()})
                      </button>
                    )}
                  </div>
                </div>

                {/* Showing suggestions if not compatible */}
                {!isCompatible && alternativeProducts.length > 0 && (
                  <div className="mt-6 border-t border-rose-950/60 pt-4">
                    <span className="block text-xs font-mono uppercase text-neutral-300 mb-3 font-bold">
                      Recommended Alternative Fitments:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {alternativeProducts.map(alt => (
                        <div 
                          id={`compat-alt-card-${alt.productId}`}
                          key={alt.productId}
                          className="bg-neutral-950/60 p-3 rounded border border-neutral-900 flex flex-col gap-2 hover:border-cyan-500/20 transition"
                        >
                          <img src={alt.imageUrl} alt="" referrerPolicy="referrer" className="h-24 w-full object-cover rounded border border-neutral-800" />
                          <span className="font-bold text-xs text-neutral-200 truncate block">{alt.name}</span>
                          <span className="text-[10px] text-cyan-400 font-mono">KES {alt.price.toLocaleString()}</span>
                          <button
                            id={`compat-add-alt-btn-${alt.productId}`}
                            onClick={() => addToCart(alt.productId)}
                            className="w-full py-1 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-[9px] font-sans font-black rounded-sm transition"
                          >
                            Quick Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
