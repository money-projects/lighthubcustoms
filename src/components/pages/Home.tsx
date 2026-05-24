import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_PRODUCTS } from '../../data/products';
import { ShoppingCart, Heart, Compass, Shield, Zap, Sparkles, Activity, Star, Eye, ArrowRight } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string, extra?: any) => void;
  onSelectProduct: (productId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onSelectProduct }) => {
  const { theme, addToCart, wishlist, toggleWishlist } = useApp();
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Filter sections
  const carouselProducts = ALL_PRODUCTS.filter(p => p.section === 'carousel' || p.section === 'best-seller').slice(0, 5);
  const bestSellers = ALL_PRODUCTS.filter(p => p.section === 'best-seller').slice(0, 4);
  const newArrivals = ALL_PRODUCTS.filter(p => p.section === 'new-arrival').slice(0, 4);
  const dealsDiscounts = ALL_PRODUCTS.filter(p => p.section === 'deal').slice(0, 4);

  const categories = [
    { name: "Headlights", count: "31 Products", desc: "Upgraded LED conversions", icon: "🚙", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=300&auto=format&fit=crop" },
    { name: "Fog Lights", count: "15 Products", desc: "Super penetrating ambers", icon: "🌫️", image: "https://images.unsplash.com/photo-1606577924046-24e3905f1f41?q=80&w=300&auto=format&fit=crop" },
    { name: "Headlight Projectors", count: "15 Products", desc: "Sharp laser cutoff beams", icon: "🔍", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=300&auto=format&fit=crop" },
    { name: "Interior Lighting", count: "23 Products", desc: "Acoustic ambient color aura", icon: "🌈", image: "https://images.unsplash.com/photo-1549244311-fffb70a72447?q=80&w=300&auto=format&fit=crop" },
  ];

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselProducts.length);
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length);
  };

  const currentHeroProduct = carouselProducts[carouselIndex] || ALL_PRODUCTS[0];

  return (
    <div id="home-landing-view-container" className="space-y-12 pb-16">
      
      {/* 1. IMMERSIVE HERO SPLASH SECTION */}
      <section 
        id="hero-banner-splash"
        className="relative min-h-[480px] flex items-center justify-center overflow-hidden rounded-b-2xl border-b border-cyan-500/10 bg-black"
      >
        {/* Background Image Parallax/Fade Overlay */}
        <div className="absolute inset-0 z-0 opacity-60 transition-all duration-700">
          <img 
            src={currentHeroProduct.imageUrl} 
            alt="Automotive Retrofitting"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12">
          
          <div className="flex flex-col gap-4 text-left">
            <span className="font-mono text-[10px] tracking-widest uppercase text-cyan-400 font-extrabold flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 animate-spin text-amber-500" /> Featured LED Innovation
            </span>
            <h2 className="font-sans font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-none">
              ULTRA OUTPUT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                ROAD SECURITY
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed">
              Explore Light Hub Customs conversion headlights, engineered to project a pristine laser-sharp pattern line with zero oncoming glare. Perfect for Nairobi nights and highway cruising.
            </p>

            <div className="flex items-center gap-3 mt-4">
              <button
                id="hero-primary-shop-now-btn"
                onClick={() => onNavigate('shop')}
                className="px-6 py-2.5 rounded-full bg-cyan-400 text-neutral-950 font-sans font-bold text-xs hover:bg-cyan-300 transition duration-200 cursor-pointer shadow shadow-cyan-500/20"
              >
                Go To Shop Catalog
              </button>
              <button
                id="hero-secondary-bulb-finder-btn"
                onClick={() => onNavigate('bulb-finder')}
                className="px-5 py-2.5 rounded-full bg-neutral-900 text-neutral-200 border border-neutral-800 font-sans font-bold text-xs hover:bg-neutral-800 transition duration-200 cursor-pointer flex items-center gap-2"
              >
                <Compass className="h-4 w-4 text-amber-500" /> Use Bulb Finder
              </button>
            </div>
          </div>

          {/* Quick Slider Box */}
          <div className="hidden md:flex flex-col items-end justify-center">
            <div className="bg-neutral-950/75 border border-cyan-500/20 rounded-xl p-5 w-full max-w-sm backdrop-blur-sm shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">Featured Product showcase</span>
                <span className="text-xs text-neutral-500 font-mono">0{carouselIndex + 1} / 0{carouselProducts.length}</span>
              </div>
              
              <img 
                src={currentHeroProduct.imageUrl} 
                alt={currentHeroProduct.name} 
                referrerPolicy="no-referrer"
                className="h-40 w-full object-cover rounded border border-neutral-800"
              />

              <div>
                <span className="font-bold text-xs text-neutral-100 block truncate">{currentHeroProduct.name}</span>
                <span className="text-[10px] text-cyan-400 block font-mono">Category: {currentHeroProduct.category}</span>
                <span className="text-xs text-neutral-400 font-bold mt-1 block">KES {currentHeroProduct.price.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  id="hero-carousel-details-btn"
                  onClick={() => onSelectProduct(currentHeroProduct.productId)}
                  className="py-1.5 rounded bg-neutral-900 border border-neutral-800 text-white font-sans text-[10px] font-bold hover:bg-neutral-800"
                >
                  View Specifics
                </button>
                <button
                  id="hero-carousel-add-btn"
                  onClick={() => addToCart(currentHeroProduct.productId)}
                  className="py-1.5 rounded bg-cyan-500 text-neutral-950 font-sans text-[10px] font-black hover:bg-cyan-400"
                >
                  Add To Basket
                </button>
              </div>

              {/* Slide Buttons */}
              <div className="flex justify-between items-center border-t border-neutral-900 pt-2.5 mt-1">
                <button 
                  id="hero-slider-prev"
                  onClick={prevCarousel} 
                  className="text-xs text-neutral-400 hover:text-cyan-400 cursor-pointer"
                >
                  &larr; Previous LED
                </button>
                <button 
                  id="hero-slider-next"
                  onClick={nextCarousel} 
                  className="text-xs text-neutral-400 hover:text-cyan-400 cursor-pointer"
                >
                  Next Product &rarr;
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SECURITY & TECHNOLOGY PILLARS */}
      <section id="trust-pillars-row" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className={`p-5 rounded-xl border transition-all duration-300 ${
            theme === 'light' 
              ? 'border-neutral-200 bg-white/70 shadow-sm hover:shadow-md' 
              : 'border-cyan-500/10 bg-neutral-900/30 hover:border-cyan-500/30'
          } flex items-start gap-4`}>
            <div className={`h-10 w-10 shrink-0 rounded flex items-center justify-center border ${
              theme === 'light' ? 'bg-cyan-100 border-cyan-200' : 'bg-cyan-950/50 border-cyan-900/30'
            }`}>
              <Shield className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <h4 className={`font-sans font-bold text-sm ${theme === 'light' ? 'text-neutral-900' : 'text-neutral-100'}`}>Anti-Glare Beam Pattern</h4>
              <p className={`text-xs mt-1 leading-relaxed ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Our projection lights are tested to guarantee razor-sharp cutoff blocks. See perfectly downfield without blinding other drivers.
              </p>
            </div>
          </div>

          <div className={`p-5 rounded-xl border transition-all duration-300 ${
            theme === 'light' 
              ? 'border-neutral-200 bg-white/70 shadow-sm hover:shadow-md' 
              : 'border-amber-500/10 bg-neutral-900/30 hover:border-amber-500/30'
          } flex items-start gap-4`}>
            <div className={`h-10 w-10 shrink-0 rounded flex items-center justify-center border ${
              theme === 'light' ? 'bg-amber-100 border-amber-200' : 'bg-amber-950/50 border-amber-900/30'
            }`}>
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h4 className={`font-sans font-bold text-sm ${theme === 'light' ? 'text-neutral-900' : 'text-neutral-100'}`}>Active Fan-Cooling Alloys</h4>
              <p className={`text-xs mt-1 leading-relaxed ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Built with forged aviation 6063 aluminum paired with 12,000 RPM double ball-bearing fans. Eliminates thermal fading.
              </p>
            </div>
          </div>

          <div className={`p-5 rounded-xl border transition-all duration-300 ${
            theme === 'light' 
              ? 'border-neutral-200 bg-white/70 shadow-sm hover:shadow-md' 
              : 'border-fuchsia-500/10 bg-neutral-900/30 hover:border-fuchsia-500/30'
          } flex items-start gap-4`}>
            <div className={`h-10 w-10 shrink-0 rounded flex items-center justify-center border ${
              theme === 'light' ? 'bg-fuchsia-100 border-fuchsia-200' : 'bg-fuchsia-950/50 border-fuchsia-900/30'
            }`}>
              <Activity className="h-5 w-5 text-fuchsia-500" />
            </div>
            <div>
              <h4 className={`font-sans font-bold text-sm ${theme === 'light' ? 'text-neutral-900' : 'text-neutral-100'}`}>CANBUS Decoder Ready</h4>
              <p className={`text-xs mt-1 leading-relaxed ${theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Smart integrated IC drivers neutralize dashboard warnings or hyper-flash flicker issues in 99% of European and Japanese vehicles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE BY LED CATEGORY */}
      <section id="categories-grid-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase block font-bold">Curated Fitments</span>
            <h3 className={`font-sans font-black text-xl uppercase tracking-tight ${theme === 'light' ? 'text-neutral-900' : 'text-neutral-100'}`}>
              SHOP BY HEAVY SPEC CATEGORY
            </h3>
          </div>
          <button
            id="home-btn-allcats"
            onClick={() => onNavigate('shop')}
            className="text-xs text-cyan-500 hover:underline font-bold flex items-center gap-1 cursor-pointer hover:text-cyan-400"
          >
            All Categories <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div
              id={`cat-card-${index}`}
              key={cat.name}
              onClick={() => onNavigate('shop', { filterCategory: cat.name })}
              className="relative group h-40 rounded-lg overflow-hidden border border-neutral-800/80 cursor-pointer shadow-lg hover:border-cyan-400/40 transition-all duration-300 transform hover:-translate-y-1 block"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 filter brightness-[0.45]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 flex flex-col">
                <span className="font-sans font-black text-md text-white uppercase tracking-tight group-hover:text-cyan-400 transition">
                  {cat.name}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono mt-0.5 font-bold">
                  {cat.count}
                </span>
                <span className="text-[10px] text-neutral-400 leading-normal mt-1 block">
                  {cat.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLER PRODUCTS CARDS LIST */}
      <section id="best-sellers-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-amber-500 uppercase block font-bold">Driver Approved</span>
            <h3 className={`font-sans font-black text-xl uppercase tracking-tight ${theme === 'light' ? 'text-neutral-900' : 'text-neutral-100'}`}>
              TOP-RATED BEST SELLERS
            </h3>
          </div>
          <button
            id="home-btn-viewallbest"
            onClick={() => onNavigate('shop')}
            className={`text-xs font-mono hover:underline cursor-pointer ${theme === 'light' ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}
          >
            Browse Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => {
            const inWish = wishlist.includes(product.productId);
            return (
              <div 
                id={`home-item-best-${product.productId}`}
                key={product.productId}
                className={`rounded-xl overflow-hidden border transition-all duration-300 flex flex-col ${
                  theme === 'light'
                    ? 'border-neutral-200 bg-white/90 shadow-sm hover:shadow-md hover:border-neutral-300'
                    : 'border-cyan-500/10 bg-neutral-900/40 hover:border-primary/20 hover:neon-glow-cyan'
                }`}
              >
                <div className="relative group/img h-48 overflow-hidden bg-neutral-950">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none transition-all duration-300 group-hover/img:scale-105"
                  />
                  {/* Category label */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-neutral-950/75 border border-neutral-800 text-neutral-300 uppercase shrink-0">
                    {product.category}
                  </span>

                  {/* Actions cover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                    <button
                      id={`inspect-best-${product.productId}`}
                      onClick={() => onSelectProduct(product.productId)}
                      className="p-2 rounded-full bg-cyan-400 text-neutral-950 hover:bg-cyan-300 transition shrink-0 cursor-pointer"
                      title="Inspect Product Specs"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      id={`fav-best-${product.productId}`}
                      onClick={() => toggleWishlist(product.productId)}
                      className={`p-2 rounded-full transition shrink-0 cursor-pointer ${
                        inWish ? 'bg-rose-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col gap-1.5 justify-between">
                  <div>
                    <span className="font-mono text-[9px] tracking-wider text-neutral-500 uppercase font-black block block-title">
                      ID: {product.productId}
                    </span>
                    <h5 
                      onClick={() => onSelectProduct(product.productId)}
                      className={`font-sans font-bold text-sm cursor-pointer hover:text-primary transition line-clamp-1 ${
                        theme === 'light' ? 'text-neutral-800 hover:text-cyan-600' : 'text-neutral-200'
                      }`}
                    >
                      {product.name}
                    </h5>
                    <p className={`text-[11px] line-clamp-2 leading-relaxed mt-0.5 ${
                      theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                    }`}>
                      {product.description}
                    </p>
                  </div>

                  <div className={`border-t pt-3 mt-1.5 flex items-center justify-between ${
                    theme === 'light' ? 'border-neutral-200' : 'border-neutral-800/80'
                  }`}>
                    <div>
                      <span className="text-[10px] text-neutral-500 block leading-none font-mono">PRICE (KES)</span>
                      <span className={`font-sans font-black text-sm block mt-0.5 ${
                        theme === 'light' ? 'text-neutral-900' : 'text-neutral-100'
                      }`}>
                        {product.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      id={`add-best-${product.productId}`}
                      onClick={() => addToCart(product.productId)}
                      className="px-3.5 py-1.5 font-sans font-bold text-[10px] rounded bg-primary text-neutral-950 hover:bg-cyan-300 hover:shadow-md transition flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="h-3 w-3" /> Add
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 5. DYNAMIC VEHICLE BULB COMPATIBILITY PREVIEW PROMO */}
      <section id="promo-bulb-finder-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl overflow-hidden border border-cyan-500/10 bg-gradient-to-r from-neutral-950 via-blue-950/20 to-neutral-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded bg-amber-950/40 text-amber-500 flex items-center justify-center border border-amber-900/30 shadow shrink-0">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-sans font-black text-md text-neutral-100 uppercase tracking-tight">NOT SURE ABOUT YOUR VEHICLE SIZES?</h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                We've mapped over 40+ Japanese and European vehicle standard fittings (Toyota, Nissan, Mercedes, Honda, VW). Access our live Fitment Matrix to get guaranteed matches.
              </p>
            </div>
          </div>
          <button
            id="promo-finder-trigger-btn"
            onClick={() => onNavigate('bulb-finder')}
            className="px-5 py-2.5 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-sans font-black text-xs shrink-0 cursor-pointer shadow flex items-center gap-2"
          >
            Launch Bulbs Fit Finder &rarr;
          </button>
        </div>
      </section>

      {/* 6. NEW LIGHT ARRIVALS ROWS */}
      <section id="new-arrivals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-[#00e5ff] uppercase block font-bold">Fresh Inventory</span>
            <h3 className={`font-sans font-black text-xl uppercase tracking-tight ${theme === 'light' ? 'text-neutral-900' : 'text-neutral-100'}`}>
              NEW ARRIVALS IN RETROFITTING
            </h3>
          </div>
          <button
            id="home-btn-viewallnew"
            onClick={() => onNavigate('shop')}
            className={`text-xs font-mono hover:underline cursor-pointer ${theme === 'light' ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}
          >
            Explore All New
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => {
            const inWish = wishlist.includes(product.productId);
            return (
              <div 
                id={`home-item-new-${product.productId}`}
                key={product.productId}
                className={`rounded-xl overflow-hidden border transition-all duration-300 flex flex-col ${
                  theme === 'light'
                    ? 'border-neutral-200 bg-white/90 shadow-sm hover:shadow-md hover:border-neutral-300'
                    : 'border-cyan-500/10 bg-neutral-900/40 hover:border-primary/20 hover:neon-glow-cyan'
                }`}
              >
                <div className="relative group/new h-48 overflow-hidden bg-neutral-950">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none transition-all duration-300 group-hover/new:scale-105"
                  />
                  {/* Category label */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-neutral-950/75 border border-neutral-800 text-neutral-300 uppercase shrink-0">
                    {product.category}
                  </span>

                  {/* Actions cover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/new:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                    <button
                      id={`inspect-new-${product.productId}`}
                      onClick={() => onSelectProduct(product.productId)}
                      className="p-2 rounded-full bg-cyan-400 text-neutral-950 hover:bg-cyan-300 transition shrink-0 cursor-pointer"
                      title="Inspect Specs"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      id={`fav-new-${product.productId}`}
                      onClick={() => toggleWishlist(product.productId)}
                      className={`p-2 rounded-full transition shrink-0 cursor-pointer ${
                        inWish ? 'bg-rose-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col gap-1.5 justify-between">
                  <div>
                    <span className="font-mono text-[9px] tracking-wider text-cyan-500 uppercase font-black block block-title">
                      NEW IN STOCK
                    </span>
                    <h5 
                      onClick={() => onSelectProduct(product.productId)}
                      className={`font-sans font-bold text-sm cursor-pointer hover:text-primary transition line-clamp-1 ${
                        theme === 'light' ? 'text-neutral-800 hover:text-cyan-600' : 'text-neutral-200'
                      }`}
                    >
                      {product.name}
                    </h5>
                    <p className={`text-[11px] line-clamp-2 leading-relaxed mt-0.5 ${
                      theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                    }`}>
                      {product.description}
                    </p>
                  </div>

                  <div className={`border-t pt-3 mt-1.5 flex items-center justify-between ${
                    theme === 'light' ? 'border-neutral-200' : 'border-neutral-800/80'
                  }`}>
                    <div>
                      <span className="text-[10px] text-neutral-500 block leading-none font-mono">PRICE (KES)</span>
                      <span className={`font-sans font-black text-sm block mt-0.5 ${
                        theme === 'light' ? 'text-neutral-900' : 'text-neutral-100'
                      }`}>
                        {product.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      id={`add-new-${product.productId}`}
                      onClick={() => addToCart(product.productId)}
                      className="px-3.5 py-1.5 font-sans font-bold text-[10px] rounded bg-primary text-neutral-950 hover:bg-cyan-300 hover:shadow-md transition flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="h-3 w-3" /> Add
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 7. SECURE DEALS & DISCOUNTS CAROUSEL */}
      <section id="deals-discounts-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-900 pt-10">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase block font-bold">Limited Cyber Deals & Tax-Free Specials</span>
            <h3 className={`font-sans font-black text-xl uppercase tracking-tight ${theme === 'light' ? 'text-neutral-900' : 'text-neutral-100'}`}>
              DEALS & DISCOUNTS (10% OFF AUTO-APPLIED)
            </h3>
          </div>
          <button
            id="home-btn-viewalldeals"
            onClick={() => onNavigate('shop', { filterCategory: '' })}
            className={`text-xs font-mono hover:underline cursor-pointer ${theme === 'light' ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}
          >
            Explore Cyber Specials
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealsDiscounts.map((product) => {
            const inWish = wishlist.includes(product.productId);
            // Simulate 10% tax-free discount strikethrough price
            const originalPrice = Math.round(product.price * 1.15);

            return (
              <div 
                id={`home-item-deal-${product.productId}`}
                key={product.productId}
                className={`rounded-xl overflow-hidden border transition-all duration-300 flex flex-col relative ${
                  theme === 'light'
                    ? 'border-neutral-200 bg-white/90 shadow-sm hover:shadow-md hover:border-neutral-300'
                    : 'border-emerald-500/10 bg-neutral-900/40 hover:border-emerald-500/30'
                }`}
              >
                {/* 10% badge */}
                <div className="absolute top-2.5 left-2.5 z-10 font-mono font-extrabold text-[8px] tracking-wide uppercase bg-emerald-500 text-neutral-950 px-2 py-0.5 rounded shadow">
                  10% OFF APPLIED
                </div>

                <div className="relative group/deal h-48 overflow-hidden bg-neutral-950">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none transition-all duration-300 group-hover/deal:scale-105"
                  />
                  
                  {/* Actions cover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/deal:opacity-100 transition-all duration-200 flex items-center justify-center gap-3">
                    <button
                      id={`inspect-deal-${product.productId}`}
                      onClick={() => onSelectProduct(product.productId)}
                      className="p-2 rounded-full bg-cyan-400 text-neutral-950 hover:bg-cyan-300 transition shrink-0 cursor-pointer"
                      title="Inspect Specs"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      id={`fav-deal-${product.productId}`}
                      onClick={() => toggleWishlist(product.productId)}
                      className={`p-2 rounded-full transition shrink-0 cursor-pointer ${
                        inWish ? 'bg-rose-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col gap-1.5 justify-between">
                  <div>
                    <span className="font-mono text-[9px] tracking-wider text-emerald-400 uppercase font-black block">
                      FLASH PROMOTIONAL SALE
                    </span>
                    <h5 
                      onClick={() => onSelectProduct(product.productId)}
                      className={`font-sans font-bold text-sm cursor-pointer hover:text-primary transition line-clamp-1 ${
                        theme === 'light' ? 'text-neutral-800 hover:text-cyan-600' : 'text-neutral-200'
                      }`}
                    >
                      {product.name}
                    </h5>
                    <p className={`text-[11px] line-clamp-2 leading-relaxed mt-0.5 ${
                      theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                    }`}>
                      {product.description}
                    </p>
                  </div>

                  <div className={`border-t pt-3 mt-1.5 flex items-center justify-between ${
                    theme === 'light' ? 'border-neutral-200' : 'border-neutral-804'
                  }`}>
                    <div>
                      <span className="text-[10px] text-neutral-500 block leading-none font-mono">DRIVERS COST</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`font-sans font-black text-sm block ${
                          theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'
                        }`}>
                          {product.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-neutral-500 line-through font-mono">
                          {originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      id={`add-deal-${product.productId}`}
                      onClick={() => addToCart(product.productId)}
                      className="px-3.5 py-1.5 font-sans font-bold text-[10px] rounded bg-emerald-500 text-neutral-950 hover:bg-emerald-400 hover:shadow-md transition flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="h-3 w-3" /> Add
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
