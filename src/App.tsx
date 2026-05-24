/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ALL_PRODUCTS } from './data/products';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './components/pages/Home';
import { Shop } from './components/pages/Shop';
import { ProductDetails } from './components/pages/ProductDetails';
import { Cart } from './components/pages/Cart';
import { Checkout } from './components/pages/Checkout';
import { TrackOrder } from './components/pages/TrackOrder';
import { Wishlist } from './components/pages/Wishlist';
import { Profile } from './components/pages/Profile';
import { Login } from './components/pages/Login';
import { BulbFinder } from './components/tools/BulbFinder';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { CompatibilityChecker } from './components/tools/CompatibilityChecker';
import { CompareProducts } from './components/tools/CompareProducts';
import { FitmentGuide } from './components/tools/FitmentGuide';
import { AboutUs, ContactUs, HelpFAQ, TermsAndConditions, PrivacyPolicy } from './components/pages/StaticPages';

function MainAppShell() {
  const { theme, currentUser } = useApp();
  
  // Single-Page View Controller State
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Navigation parameter pipes
  const [categoryFilterPipe, setCategoryFilterPipe] = useState<string>('');
  const [searchQueryPipe, setSearchQueryPipe] = useState<string>('');
  const [trackOrderIdPipe, setTrackOrderIdPipe] = useState<string>('');

  // Universal Navigation Handler
  const handleNavigate = (page: string, extra?: any) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle incoming parameters
    if (page === 'shop') {
      if (extra?.filterCategory) {
        setCategoryFilterPipe(extra.filterCategory);
      } else if (!extra?.preserveFilter) {
        setCategoryFilterPipe('');
      }
    } else if (page === 'track-order' && extra?.orderId) {
      setTrackOrderIdPipe(extra.orderId);
    }
  };

  // Inspect and review product details
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActivePage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find inspected product dataset
  const inspectedProduct = ALL_PRODUCTS.find(p => p.productId === selectedProductId);

  // Dynamic Theme Class mapping
  const getThemeClass = () => {
    if (theme === 'light') {
      return 'bg-neutral-100 text-neutral-900 font-sans';
    } else if (theme === 'dark') {
      return 'bg-neutral-950 text-neutral-100 font-sans';
    } else {
      // Hybrid auto switch (cosmic custom balanced dark slate layout)
      return 'bg-neutral-900 text-neutral-200 font-sans';
    }
  };

  return (
    <div id="app-root-shell" className={`min-h-screen flex flex-col justify-between relative z-0 overflow-x-hidden transition-colors duration-300 ${getThemeClass()}`}>
      
      {/* Immersive LED Back-glow Beam */}
      {theme !== 'light' && (
        <div id="immersive-top-neon-flare" className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-[110px] rounded-full pointer-events-none -z-10" />
      )}
      
      {/* 1. Header Navigation block */}
      <Header 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onSearchQuery={(q) => {
          setSearchQueryPipe(q);
          handleNavigate('shop', { preserveFilter: true });
        }}
      />

      {/* 2. Main interactive layout wrapper */}
      <main id="main-view-portal" className="flex-1 pb-10">
        {activePage === 'home' && (
          <Home onNavigate={handleNavigate} onSelectProduct={handleSelectProduct} />
        )}

        {activePage === 'shop' && (
          <Shop 
            onSelectProduct={handleSelectProduct} 
            initialFilterCategory={categoryFilterPipe}
            initialSearchQuery={searchQueryPipe}
          />
        )}

        {activePage === 'details' && inspectedProduct && (
          <ProductDetails 
            product={inspectedProduct} 
            onBack={handleBackToCatalog} 
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'cart' && (
          <Cart onNavigate={handleNavigate} />
        )}

        {activePage === 'checkout' && (
          <Checkout onNavigate={handleNavigate} />
        )}

        {activePage === 'track-order' && (
          <TrackOrder initialOrderId={trackOrderIdPipe} />
        )}

        {activePage === 'wishlist' && (
          <Wishlist onSelectProduct={handleSelectProduct} onNavigate={handleNavigate} />
        )}

        {activePage === 'profile' && (
          <Profile onNavigate={handleNavigate} />
        )}

        {activePage === 'login' && (
          <Login onNavigate={handleNavigate} />
        )}

        {activePage === 'bulb-finder' && (
          <BulbFinder />
        )}

        {activePage === 'admin-dashboard' && currentUser?.role === 'admin' && (
          <AdminDashboard />
        )}

        {/* Extended Tools Controllers */}
        {activePage === 'compatibility-checker' && (
          <CompatibilityChecker />
        )}

        {activePage === 'compare' && (
          <CompareProducts />
        )}

        {activePage === 'fitment-guide' && (
          <FitmentGuide />
        )}

        {/* Informational Static Pages */}
        {activePage === 'about' && (
          <AboutUs />
        )}

        {activePage === 'contact' && (
          <ContactUs />
        )}

        {activePage === 'help' && (
          <HelpFAQ />
        )}

        {activePage === 'terms' && (
          <TermsAndConditions />
        )}

        {activePage === 'privacy' && (
          <PrivacyPolicy />
        )}
      </main>

      {/* 3. Footer branding logs */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppShell />
    </AppProvider>
  );
}
