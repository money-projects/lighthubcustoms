import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VEHICLE_DATABASE } from '../../data/vehicles';
import { ALL_PRODUCTS } from '../../data/products';
import { Product, VehicleBulbData } from '../../types';
import { Search, HelpCircle, AlertTriangle, CheckCircle, ArrowRight, Lightbulb, ShoppingCart } from 'lucide-react';

export const BulbFinder: React.FC = () => {
  const { 
    theme, 
    addToCart, 
    selectedMake, setSelectedMake,
    selectedModel, setSelectedModel 
  } = useApp();

  const [uniqueMakes, setUniqueMakes] = useState<string[]>([]);
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [selectedBulbs, setSelectedBulbs] = useState<VehicleBulbData | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<{ slot: string; bulbNeeded: string; product: Product }[]>([]);

  // Unique list of car manufacturers
  useEffect(() => {
    const makes = Array.from(new Set(VEHICLE_DATABASE.map(v => v.make)));
    makes.sort();
    setUniqueMakes(makes);
  }, []);

  // Update models list when manufacturer changes
  useEffect(() => {
    const models = VEHICLE_DATABASE.filter(v => v.make === selectedMake).map(v => v.model);
    models.sort();
    setModelOptions(models);
    
    // Auto preset first model if current isn't in lists
    if (models.length > 0 && !models.includes(selectedModel)) {
      setSelectedModel(models[0]);
    }
  }, [selectedMake]);

  // Update bulb data when make + model are fully selected
  useEffect(() => {
    const found = VEHICLE_DATABASE.find(v => v.make === selectedMake && v.model === selectedModel);
    if (found) {
      setSelectedBulbs(found);
      generateRecommendations(found);
    } else {
      setSelectedBulbs(null);
      setRecommendedProducts([]);
    }
  }, [selectedMake, selectedModel]);

  // Look for match of bulb standards in our product names/specs
  const generateRecommendations = (vehicleData: VehicleBulbData) => {
    const recs: { slot: string; bulbNeeded: string; product: Product }[] = [];
    
    const slots = [
      { name: 'Headlight Low Beam', code: vehicleData.headlightLow },
      { name: 'Headlight High Beam', code: vehicleData.headlightHigh },
      { name: 'Fog Lights', code: vehicleData.fogLight },
      { name: 'Front Turn Signals', code: vehicleData.turnSignalFront },
      { name: 'Rear Turn Signals', code: vehicleData.turnSignalRear },
      { name: 'Interior / Dome map', code: vehicleData.parkingLight }
    ];

    slots.forEach(slot => {
      // Find a product that lists this code in its specification line or description
      const codeCleaned = slot.code.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/gi, '');
      const match = ALL_PRODUCTS.find(p => {
        const specLower = p.specifications.toLowerCase();
        const nameLower = p.name.toLowerCase();
        return specLower.includes(codeCleaned) || nameLower.includes(codeCleaned) ||
               (slot.name.includes('Interior') && p.category === 'Interior Lighting') ||
               (slot.name.includes('Turn') && p.category === 'Turn Signals');
      });

      if (match) {
        recs.push({
          slot: slot.name,
          bulbNeeded: slot.code,
          product: match
        });
      }
    });

    setRecommendedProducts(recs);
  };

  return (
    <div id="bulb-finder-module-view" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Headers */}
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-bold mb-1">AUTOMOTIVE FITMENT LAB</p>
          <h1 className="font-sans font-black text-3xl sm:text-4xl text-neutral-100 uppercase tracking-tight">
            VEHICLE BULB FINDER
          </h1>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl mx-auto">
            Find the exact replacement LED bulb types for your car. Enter your vehicle manufacturer & model below to retrieve guaranteed plug-and-play matches.
          </p>
        </div>

        {/* Inputs row */}
        <div className={`p-6 rounded-lg mb-8 border ${
          theme === 'light' 
            ? 'bg-neutral-100 border-neutral-300' 
            : 'bg-neutral-900/40 border-cyan-900/40'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Make Selector */}
            <div id="make-select-field">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                1. Select Vehicle Manufacturer
              </label>
              <select
                id="finder-make-select"
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className={`w-full py-2 px-3 focus:outline-none rounded text-sm font-semibold cursor-pointer ${
                  theme === 'light' 
                    ? 'bg-white text-neutral-900 border border-neutral-300' 
                    : 'bg-neutral-950 text-neutral-100 border border-neutral-800'
                }`}
              >
                {uniqueMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            {/* Model Selector */}
            <div id="model-select-field">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                2. Select Vehicle Model
              </label>
              <select
                id="finder-model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={modelOptions.length === 0}
                className={`w-full py-2 px-3 focus:outline-none rounded text-sm font-semibold cursor-pointer ${
                  theme === 'light' 
                    ? 'bg-white text-neutral-900 border border-neutral-300' 
                    : 'bg-neutral-950 text-neutral-100 border border-neutral-800'
                }`}
              >
                {modelOptions.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {selectedBulbs && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Bulbs spec table card */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              <div className={`p-6 rounded-lg border flex flex-col gap-4 ${
                theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'
              }`}>
                <div className="flex items-center justify-between border-b pb-3 border-neutral-800">
                  <h3 className="font-sans font-bold text-lg text-neutral-100 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    {selectedMake} {selectedModel} Specs
                  </h3>
                  <span className="font-mono text-[9px] bg-cyan-950/50 text-cyan-400 font-bold px-2 py-0.5 rounded border border-cyan-900/30">
                    ID: {selectedBulbs.vehicleKey}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  
                  {/* Headlights Group */}
                  <div className="space-y-2.5 p-3 rounded bg-neutral-950/40 border border-neutral-900">
                    <span className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase block border-b border-neutral-900 pb-1">
                      Main Front Lighting
                    </span>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Low Beam:</span>
                      <span className="text-neutral-100 font-bold">{selectedBulbs.headlightLow}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">High Beam:</span>
                      <span className="text-neutral-100 font-bold">{selectedBulbs.headlightHigh}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Fog light:</span>
                      <span className="text-cyan-400 font-bold">{selectedBulbs.fogLight}</span>
                    </div>
                  </div>

                  {/* Signals group */}
                  <div className="space-y-2.5 p-3 rounded bg-neutral-950/40 border border-neutral-900">
                    <span className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase block border-b border-neutral-900 pb-1">
                      Signal Bulbs
                    </span>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Front Turn:</span>
                      <span className="text-neutral-100 font-bold">{selectedBulbs.turnSignalFront}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Rear Turn:</span>
                      <span className="text-neutral-100 font-bold">{selectedBulbs.turnSignalRear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Parking Light:</span>
                      <span className="text-neutral-100 font-bold">{selectedBulbs.parkingLight}</span>
                    </div>
                  </div>

                  {/* Rear safety group */}
                  <div className="space-y-2.5 p-3 rounded bg-neutral-950/40 border border-neutral-900">
                    <span className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase block border-b border-neutral-900 pb-1">
                      Rear Safety & ID
                    </span>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Tail Light:</span>
                      <span className="text-neutral-100 font-bold">{selectedBulbs.tailLight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Brake Light:</span>
                      <span className="text-neutral-100 font-bold">{selectedBulbs.brakeLight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Reverse Light:</span>
                      <span className="text-neutral-100 font-bold">{selectedBulbs.reverseLight}</span>
                    </div>
                  </div>

                  {/* Cabin Indicators */}
                  <div className="space-y-2.5 p-3 rounded bg-neutral-950/40 border border-neutral-900">
                    <span className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase block border-b border-neutral-900 pb-1">
                      Cabin / License
                    </span>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">license Plate:</span>
                      <span className="text-neutral-100 font-bold">{selectedBulbs.licensePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Map / Dome:</span>
                      <span className="text-neutral-100 font-bold">Festoon 31mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Door puddle:</span>
                      <span className="text-neutral-100 font-bold">W5W (T10)</span>
                    </div>
                  </div>

                </div>

                <div className="p-3 bg-cyan-950/30 rounded border border-cyan-900/30 flex items-start gap-2.5 text-xs">
                  <CheckCircle className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-neutral-300 leading-relaxed">
                    <strong>FITMENT GUARANTEED:</strong> All listings above are curated from verified manufacturer databases. Retrofitting with Light Hub LED kits requires zero wire cuttings or custom relays because they are exactly structured to match these bulb bases!
                  </p>
                </div>
              </div>

            </div>

            {/* Recommendations sidebar */}
            <div className="lg:col-span-1">
              <div className={`p-6 rounded-lg border ${
                theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'
              }`}>
                <h3 className="font-sans font-bold text-md text-neutral-100 border-b pb-3 border-neutral-800 mb-4 flex items-center justify-between">
                  <span>Guaranteed LED Upgrades</span>
                  <span className="bg-amber-950 rounded text-amber-500 text-[10px] font-mono font-bold px-2 py-0.5">
                    {recommendedProducts.length} Items Found
                  </span>
                </h3>

                {recommendedProducts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-500 flex flex-col items-center justify-center gap-2">
                    <AlertTriangle className="h-8 w-8 text-amber-500" />
                    <span>No specific model kits pre-cataloged. Search our main catalog directly.</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendedProducts.map((rec, index) => (
                      <div 
                        id={`rec-item-${index}`}
                        key={rec.product.productId} 
                        className="p-3 rounded bg-neutral-950/50 border border-neutral-800 flex flex-col gap-2.5 hover:border-cyan-500/20 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] text-cyan-400 uppercase font-extrabold tracking-wider bg-cyan-950/50 px-1.5 py-0.5 rounded">
                            {rec.slot} ({rec.bulbNeeded})
                          </span>
                          <span className="font-mono font-black text-xs text-amber-500">
                            KES {rec.product.price.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <img 
                            src={rec.product.imageUrl} 
                            alt={rec.product.name} 
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 object-cover rounded shrink-0 border border-neutral-800"
                          />
                          <div className="min-w-0">
                            <span className="font-sans font-bold text-xs text-neutral-200 block truncate group-hover:text-cyan-400 transition">
                              {rec.product.name}
                            </span>
                            <span className="text-[10px] text-neutral-400 block truncate">
                              Fitment standard: {rec.product.category}
                            </span>
                          </div>
                        </div>

                        <button
                          id={`finder-add-to-cart-btn-${rec.product.productId}`}
                          onClick={() => addToCart(rec.product.productId)}
                          className="w-full py-1 rounded bg-cyan-500 hover:bg-cyan-400 font-sans font-bold text-[10px] text-neutral-950 flex items-center justify-center gap-1.5 cursor-pointer shadow transition"
                        >
                          <ShoppingCart className="h-3 w-3" /> Quick Add To Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
