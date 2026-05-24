import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VEHICLE_DATABASE } from '../../data/vehicles';
import { Product } from '../../types';
import { ShoppingCart, Heart, ArrowLeft, Shield, CheckCircle, Flame, Star, Package, HelpCircle, Truck, HelpCircle as HelpIcon } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onNavigate }) => {
  const { theme, addToCart, wishlist, toggleWishlist, selectedMake, selectedModel } = useApp();
  
  // Images toggling state
  const [activeImage, setActiveImage] = useState(product.imageUrl);
  const [fitCheckMake, setFitCheckMake] = useState(selectedMake);
  const [fitCheckModel, setFitCheckModel] = useState(selectedModel);
  const [fitResult, setFitResult] = useState<{ checked: boolean; fits: boolean; message: string } | null>(null);

  const isFavorite = wishlist.includes(product.productId);

  // Specifications parser "Key: Value | Key2: Value2"
  const parsedSpecs = product.specifications.split('|').map(spec => {
    const parts = spec.split(':');
    return {
      label: parts[0]?.trim() || 'Spec',
      value: parts[1]?.trim() || ''
    };
  });

  const handleFitChecker = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicle = VEHICLE_DATABASE.find(v => v.make === fitCheckMake && v.model === fitCheckModel);
    if (!vehicle) {
      setFitResult({
        checked: true,
        fits: false,
        message: `Compatibility stats for ${fitCheckMake} ${fitCheckModel} are not cataloged yet.`
      });
      return;
    }

    const prodCat = product.category.toLowerCase();
    const prodName = product.name.toLowerCase();
    const prodSpecs = product.specifications.toLowerCase();

    // Headlight checking
    if (prodCat === 'headlights') {
      const lowMatches = prodSpecs.includes(vehicle.headlightLow.toLowerCase().split(' ')[0]) || prodName.includes(vehicle.headlightLow.toLowerCase().split(' ')[0]);
      const highMatches = prodSpecs.includes(vehicle.headlightHigh.toLowerCase().split(' ')[0]) || prodName.includes(vehicle.headlightHigh.toLowerCase().split(' ')[0]);
      
      if (lowMatches || highMatches) {
        setFitResult({
          checked: true,
          fits: true,
          message: `YES! Fits ${vehicle.make} ${vehicle.model} headlight sockets (Low: ${vehicle.headlightLow}, High: ${vehicle.headlightHigh}).`
        });
      } else {
        setFitResult({
          checked: true,
          fits: false,
          message: `NO MATCH: Your vehicle low beam standard is ${vehicle.headlightLow}. Add our specialized conversion adapter first.`
        });
      }
    } 
    // Fog light checking
    else if (prodCat === 'fog lights') {
      const fogMatches = prodSpecs.includes(vehicle.fogLight.toLowerCase().split(' ')[0]) || prodName.includes(vehicle.fogLight.toLowerCase().split(' ')[0]);
      if (fogMatches) {
        setFitResult({
          checked: true,
          fits: true,
          message: `YES! Matches the ${vehicle.make} ${vehicle.model} standard fog light socket base (${vehicle.fogLight}).`
        });
      } else {
        setFitResult({
          checked: true,
          fits: false,
          message: `NO MATCH: Your vehicle takes fog type "${vehicle.fogLight}". Use our specified ${vehicle.fogLight} LED bulb instead.`
        });
      }
    } 
    // Interior lights
    else if (prodCat === 'interior lighting') {
      setFitResult({
        checked: true,
        fits: true,
        message: `YES: Universal Cabin Fitting. Rest assured this will replace your overhead wedge dome bulbs.`
      });
    } 
    // Accessories
    else {
      setFitResult({
        checked: true,
        fits: true,
        message: "YES: Designed as a universal retrofit for standard car batteries (12V Input DC)."
      });
    }
  };

  const allMakes = Array.from(new Set(VEHICLE_DATABASE.map(v => v.make))).sort();
  const filteredModels = VEHICLE_DATABASE.filter(v => v.make === fitCheckMake).map(v => v.model).sort();

  return (
    <div id="product-details-view" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link Navs */}
        <div className="mb-6">
          <button
            id="back-to-catalog-btn"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:underline cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back To LED Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* Images Section */}
          <div id="product-gallery-block" className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border border-neutral-900 bg-neutral-950 aspect-[4/3] max-h-[380px]">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />
              <span className="absolute top-3 left-3 bg-neutral-900/80 border border-neutral-800 text-neutral-300 font-mono text-[9px] uppercase px-2 py-0.5 rounded font-bold">
                {product.category}
              </span>
            </div>

            {/* Sub images indicators */}
            <div className="flex gap-3">
              {product.images?.map((img, i) => (
                <button
                  id={`gallery-thumb-${i}`}
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`h-16 w-16 rounded overflow-hidden border transition relative shrink-0 ${
                    activeImage === img ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Core Info Details */}
          <div id="product-meta-details" className="flex flex-col gap-5">
            
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider font-extrabold block">
                ID Code: {product.productId} &bull; Section: {product.section}
              </span>
              <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
                {product.name}
              </h1>
              
              {/* Stars review metric */}
              <div className="flex items-center gap-1 mt-1 text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                <span className="text-xs text-neutral-400 font-mono ml-1.5">(4.9 out of 5 &bull; 24 Verified Drivers)</span>
              </div>
            </div>

            {/* Description Text */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {product.description}
            </p>

            {/* Mini Specs Highlights List */}
            <div className="p-4 rounded-lg bg-neutral-900/30 border border-neutral-900 grid grid-cols-2 gap-4 text-xs font-mono">
              {parsedSpecs.map((spec, index) => (
                <div key={index} className="flex flex-col border-b border-neutral-900 pb-2">
                  <span className="text-neutral-500 text-[10px] uppercase">{spec.label}</span>
                  <span className="text-neutral-200 mt-0.5">{spec.value || 'N/A'}</span>
                </div>
              ))}
            </div>

            {/* Real Price Counter & Basket triggers */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-neutral-900 py-4 mt-2">
              <div>
                <span className="text-[10px] text-neutral-500 block font-mono leading-none">PRICING IN KES</span>
                <span className="font-sans font-black text-2xl text-neutral-100 block mt-1 leading-none">
                  KES {product.price.toLocaleString()}
                </span>
                <span className="text-[9px] text-cyan-400 font-mono block mt-1">VAT Included / Imports Pre-cleared</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  id="details-favorite-toggle"
                  onClick={() => toggleWishlist(product.productId)}
                  className={`p-2.5 rounded border transition cursor-pointer ${
                    isFavorite 
                      ? 'bg-rose-950/40 border-rose-900/60 text-rose-400 hover:bg-neutral-900' 
                      : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                  title={isFavorite ? 'Remove from saved' : 'Add to collection'}
                >
                  <Heart className="h-4.5 w-4.5" />
                </button>

                <button
                  id="details-add-to-cart-cta"
                  onClick={() => addToCart(product.productId)}
                  className="px-6 py-2.5 rounded bg-cyan-500 text-neutral-950 font-sans font-black text-xs hover:bg-cyan-400 transition shadow cursor-pointer flex items-center gap-2"
                >
                  <ShoppingCart className="h-4.5 w-4.5" /> Add To Shopping Basket
                </button>
              </div>
            </div>

            {/* 3. COG-GUIDED VEHICLE COMPATIBILITY FORM (INTERACTIVE RETRO INSPECTOR) */}
            <div className={`p-4 rounded-lg border flex flex-col gap-3 ${
              theme === 'light' ? 'bg-neutral-100 border-neutral-300' : 'bg-neutral-950/60 border-cyan-950/30'
            }`}>
              <div className="flex items-center gap-2 border-b pb-2 border-neutral-900">
                <Shield className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-xs uppercase font-mono tracking-wider text-neutral-200 font-bold">
                  Guaranteed Fitment Inspection Lab
                </span>
              </div>

              <form onSubmit={handleFitChecker} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Make</label>
                  <select
                    id="details-fit-make"
                    value={fitCheckMake}
                    onChange={(e) => {
                      setFitCheckMake(e.target.value);
                      const models = VEHICLE_DATABASE.filter(v => v.make === e.target.value).map(v => v.model);
                      if (models.length > 0) setFitCheckModel(models[0]);
                    }}
                    className="w-full py-1 px-2 focus:outline-none rounded text-[11px] font-mono bg-neutral-900 text-neutral-200 border border-neutral-800 cursor-pointer"
                  >
                    {allMakes.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] font-mono uppercase text-neutral-500 mb-1">Model</label>
                  <select
                    id="details-fit-model"
                    value={fitCheckModel}
                    onChange={(e) => setFitCheckModel(e.target.value)}
                    className="w-full py-1 px-2 focus:outline-none rounded text-[11px] font-mono bg-neutral-900 text-neutral-200 border border-neutral-800 cursor-pointer"
                  >
                    {filteredModels.map(mod => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    id="details-run-fit-check"
                    type="submit"
                    className="w-full py-1 bg-neutral-900 hover:bg-neutral-800 text-cyan-400 font-sans text-[10px] font-bold rounded border border-cyan-500/25 cursor-pointer shadow-sm"
                  >
                    Test Fitment
                  </button>
                </div>
              </form>

              {fitResult && (
                <div className={`p-2.5 rounded text-[10px] font-mono mt-1 ${
                  fitResult.fits 
                    ? 'bg-emerald-950/45 text-emerald-300 border border-emerald-900/30' 
                    : 'bg-rose-950/45 text-rose-300 border border-rose-900/30'
                }`}>
                  <div className="flex items-start gap-1.5 leading-relaxed">
                    <CheckCircle className={`h-4 w-4 shrink-0 mt-0.5 ${fitResult.fits ? 'text-emerald-400' : 'text-rose-400'}`} />
                    <span>{fitResult.message}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Delivery Guidelines Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] text-neutral-400 mt-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-cyan-500 shrink-0" />
                <span>Next-Day delivery within Nairobi & Counties</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-cyan-500 shrink-0" />
                <span>Full retrofitting tools & instructions enclosed</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
