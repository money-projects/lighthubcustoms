import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Heart, Search, User, Compass, Server, Cog, Sun, Moon, Sparkles, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string, extra?: any) => void;
  activePage: string;
  onSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activePage, onSearchQuery }) => {
  const { cartCount, wishlist, theme, setTheme, currentUser, signOut } = useApp();
  const [searchVal, setSearchVal] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchQuery(searchVal);
    onNavigate('shop');
  };

  const currentThemeLabel = () => {
    switch (theme) {
      case 'dark': return 'Premium Dark';
      case 'light': return 'Clean Light';
      case 'hybrid': return 'Auto Switch';
    }
  };

  return (
    <header 
      id="main-app-header" 
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        theme === 'light' 
          ? 'bg-white/80 border-neutral-200 text-neutral-900 glass-panel-light' 
          : 'bg-neutral-950/80 border-cyan-500/10 text-neutral-100 glass-panel-dark neon-glow-cyan'
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div 
            id="header-brand-container"
            className="flex items-center gap-2 cursor-pointer transition transform hover:scale-105"
            onClick={() => onNavigate('home')}
          >
            <div className="relative">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-700 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="font-mono font-black text-white text-lg tracking-wider">LH</span>
              </div>
              <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-amber-500 rounded-full animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-amber-500 rounded-full" />
            </div>
            <div>
              <span className="font-sans font-black text-lg tracking-tight uppercase block leading-none">
                Light Hub
              </span>
              <span className="font-mono text-[10px] tracking-widest uppercase text-cyan-400 block font-bold leading-none mt-0.5">
                Customs
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <form 
            id="nav-search-form"
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <input
              id="header-search-input"
              type="text"
              placeholder="Search headlights, fog lights, LED projectors..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className={`w-full py-1.5 pl-10 pr-4 rounded-full text-xs transition duration-200 focus:outline-none focus:ring-1 ${
                theme === 'light'
                  ? 'bg-neutral-100 focus:bg-white text-neutral-900 focus:ring-primary border border-neutral-300'
                  : 'bg-neutral-900/60 focus:bg-neutral-950 text-neutral-100 focus:ring-primary border border-cyan-500/20'
              }`}
            />
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            <button 
              id="header-search-submit"
              type="submit" 
              className="absolute right-2.5 top-1.5 font-sans font-semibold text-[10px] px-2.5 py-0.5 rounded-full bg-primary text-neutral-950 hover:bg-cyan-300 transition-all font-bold"
            >
              Go
            </button>
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold leading-none">
            {/* Home Link */}
            <button
              id="nav-link-home"
              onClick={() => onNavigate('home')}
              className={`transition-all duration-200 hover:text-primary relative py-1 cursor-pointer ${
                activePage === 'home' 
                  ? 'text-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:shadow-[0_0_8px_#00e5ff]' 
                  : 'text-neutral-400'
              }`}
            >
              Home
            </button>

            {/* Shop Catalog Dropdown */}
            <div id="nav-shop-dropdown-container" className="relative group/shopnav py-1">
              <button
                id="nav-link-shop-dropdown-trigger"
                onClick={() => onNavigate('shop')}
                className={`transition-all duration-200 hover:text-primary flex items-center gap-1 cursor-pointer ${
                  activePage === 'shop' ? 'text-primary font-extrabold' : 'text-neutral-400'
                }`}
              >
                Shop Catalog <ChevronDown className="h-3 w-3" />
              </button>
              
              <div className="absolute left-0 top-full mt-2 w-52 rounded-md shadow-xl py-1 border text-xs bg-neutral-900 border-neutral-800 text-neutral-300 opacity-0 transform translate-y-2 pointer-events-none group-hover/shopnav:opacity-100 group-hover/shopnav:translate-y-0 group-hover/shopnav:pointer-events-auto transition-all duration-200 z-50">
                <button
                  id="shop-menu-all"
                  onClick={() => onNavigate('shop', { filterCategory: '' })}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-800 font-bold block"
                >
                  All Products
                </button>
                <div className="h-px bg-neutral-850 my-1" />
                {[
                  "Headlights",
                  "Fog Lights",
                  "Headlight Projectors",
                  "Interior Lighting",
                  "Turn Signals",
                  "Taillights",
                  "Angel Eyes & Halo Rings"
                ].map(cat => (
                  <button
                    id={`shop-menu-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                    key={cat}
                    onClick={() => onNavigate('shop', { filterCategory: cat })}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-800 transition block text-neutral-400 hover:text-cyan-400"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Tools Dropdown */}
            <div id="nav-tools-dropdown-container" className="relative group/toolsnav py-1">
              <button
                id="nav-link-tools-dropdown-trigger"
                className={`transition-all duration-200 hover:text-primary flex items-center gap-1 cursor-pointer ${
                  ['bulb-finder', 'compatibility-checker', 'compare', 'fitment-guide'].includes(activePage) 
                    ? 'text-primary font-extrabold' 
                    : 'text-neutral-400'
                }`}
              >
                <Compass className="h-3.5 w-3.5 text-accent animate-pulse" /> Retrofit Tools <ChevronDown className="h-3 w-3" />
              </button>

              <div className="absolute left-0 top-full mt-2 w-52 rounded-md shadow-xl py-1 border text-xs bg-neutral-900 border-neutral-800 text-neutral-300 opacity-0 transform translate-y-2 pointer-events-none group-hover/toolsnav:opacity-100 group-hover/toolsnav:translate-y-0 group-hover/toolsnav:pointer-events-auto transition-all duration-200 z-50">
                <button
                  id="tools-menu-finder"
                  onClick={() => onNavigate('bulb-finder')}
                  className={`w-full text-left px-4 py-2 hover:bg-neutral-850 block transition ${activePage === 'bulb-finder' ? 'text-cyan-400' : ''}`}
                >
                  Vehicle Bulb Finder
                </button>
                <button
                  id="tools-menu-compat"
                  onClick={() => onNavigate('compatibility-checker')}
                  className={`w-full text-left px-4 py-2 hover:bg-neutral-850 block transition ${activePage === 'compatibility-checker' ? 'text-cyan-400' : ''}`}
                >
                  Fitment Compatibility Check
                </button>
                <button
                  id="tools-menu-compare"
                  onClick={() => onNavigate('compare')}
                  className={`w-full text-left px-4 py-2 hover:bg-neutral-850 block transition ${activePage === 'compare' ? 'text-cyan-400' : ''}`}
                >
                  Spec-by-Spec Comparison
                </button>
                <button
                  id="tools-menu-guide"
                  onClick={() => onNavigate('fitment-guide')}
                  className={`w-full text-left px-4 py-2 hover:bg-neutral-850 block transition ${activePage === 'fitment-guide' ? 'text-cyan-400' : ''}`}
                >
                  DIY Installation Guides
                </button>
              </div>
            </div>

            {/* About Link */}
            <button
              id="nav-link-about"
              onClick={() => onNavigate('about')}
              className={`transition-all duration-200 hover:text-primary relative py-1 cursor-pointer ${
                activePage === 'about' 
                  ? 'text-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:shadow-[0_0_8px_#00e5ff]' 
                  : 'text-neutral-400'
              }`}
            >
              About
            </button>

            {/* Contact Link */}
            <button
              id="nav-link-contact"
              onClick={() => onNavigate('contact')}
              className={`transition-all duration-200 hover:text-primary relative py-1 cursor-pointer ${
                activePage === 'contact' 
                  ? 'text-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:shadow-[0_0_8px_#00e5ff]' 
                  : 'text-neutral-400'
              }`}
            >
              Contact
            </button>

            {/* Help Link */}
            <button
              id="nav-link-help"
              onClick={() => onNavigate('help')}
              className={`transition-all duration-200 hover:text-primary relative py-1 cursor-pointer ${
                activePage === 'help' 
                  ? 'text-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:shadow-[0_0_8px_#00e5ff]' 
                  : 'text-neutral-400'
              }`}
            >
              Help & FAQ
            </button>

            {/* Track Order */}
            <button
              id="nav-link-track"
              onClick={() => onNavigate('track-order')}
              className={`transition-all duration-200 hover:text-primary relative py-1 cursor-pointer ${
                activePage === 'track-order' 
                  ? 'text-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:shadow-[0_0_8px_#00e5ff]' 
                  : 'text-neutral-400'
              }`}
            >
              Track Order
            </button>

            {currentUser?.role === 'admin' && (
              <button
                id="nav-link-admin"
                onClick={() => onNavigate('admin-dashboard')}
                className={`transition-all duration-200 hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-950/20 text-red-500 border border-red-900/30 font-bold ${
                  activePage === 'admin-dashboard' ? 'ring-2 ring-red-500 border-transparent bg-red-950/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]' : ''
                }`}
              >
                <Cog className="h-3.5 w-3.5 animate-spin animate-spin-slow" /> Admin Desk
              </button>
            )}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Theme Toggle Button Dropdown */}
            <div id="theme-menu-wrapper" className="relative group/theme flex items-center">
              <button 
                id="theme-trigger-btn"
                className={`p-1.5 rounded-md hover:bg-neutral-800 transition flex items-center gap-1.5 border ${
                  theme === 'light' ? 'border-neutral-300 text-neutral-700 bg-neutral-200/50' : 'border-neutral-800 text-cyan-400 bg-neutral-900/50'
                }`}
              >
                {theme === 'dark' && <Moon className="h-3.5 w-3.5 text-cyan-400" />}
                {theme === 'light' && <Sun className="h-3.5 w-3.5 text-amber-500" />}
                {theme === 'hybrid' && <Sparkles className="h-3.5 w-3.5 text-fuchsia-400 animate-pulse" />}
                <span className="hidden xl:inline text-[10px] font-mono uppercase tracking-wider">
                  {currentThemeLabel()}
                </span>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg py-1 border text-xs leading-5 bg-neutral-900 border-neutral-800 text-neutral-300 opacity-0 transform translate-y-2 pointer-events-none group-hover/theme:opacity-100 group-hover/theme:translate-y-0 group-hover/theme:pointer-events-auto transition-all duration-200 z-50">
                <div className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800">
                  Select Visual Style
                </div>
                <button
                  id="theme-btn-dark"
                  onClick={() => setTheme('dark')}
                  className={`w-full text-left px-4 py-2 hover:bg-neutral-800 flex items-center gap-2 font-medium ${theme === 'dark' ? 'text-cyan-400 bg-neutral-950/60 font-bold' : ''}`}
                >
                  <Moon className="h-3.5 w-3.5 text-cyan-400" />
                  Dark Premium Mode
                </button>
                <button
                  id="theme-btn-light"
                  onClick={() => setTheme('light')}
                  className={`w-full text-left px-4 py-2 hover:bg-neutral-800 flex items-center gap-2 font-medium ${theme === 'light' ? 'text-amber-500 font-bold' : ''}`}
                >
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  Light Clean Mode
                </button>
                <button
                  id="theme-btn-hybrid"
                  onClick={() => setTheme('hybrid')}
                  className={`w-full text-left px-4 py-2 hover:bg-neutral-800 flex items-center gap-2 font-medium ${theme === 'hybrid' ? 'text-fuchsia-400 font-bold' : ''}`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-fuchsia-400" />
                  Hybrid Auto-Switch
                </button>
              </div>
            </div>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={() => onNavigate('wishlist')}
              className={`p-1.5 rounded-md hover:bg-neutral-800/80 transition relative ${
                activePage === 'wishlist' ? 'text-rose-500' : 'text-neutral-400 hover:text-neutral-100'
              }`}
            >
              <Heart className="h-4.5 w-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-600 text-white font-mono font-bold text-[9px] flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Real-Time Cart Float Trigger */}
            <button
              id="header-cart-btn"
              onClick={() => onNavigate('cart')}
              className={`p-1.5 rounded-md hover:bg-neutral-800/80 transition relative ${
                activePage === 'cart' ? 'text-cyan-400' : 'text-neutral-400 hover:text-neutral-100'
              }`}
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyan-500 text-neutral-950 font-mono font-black text-[9px] flex items-center justify-center shadow shadow-cyan-400/20 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile Info Dropdown */}
            <div id="user-menu-wrapper" className="relative">
              <button
                id="header-profile-menu-btn"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className={`p-1.5 rounded-md hover:bg-neutral-800/80 transition flex items-center gap-1 ${
                  currentUser ? 'text-cyan-400' : 'text-neutral-400 hover:text-neutral-100'
                }`}
              >
                <User className="h-4.5 w-4.5" />
                {currentUser && (
                  <span className="hidden sm:inline text-[10px] font-sans font-medium max-w-[80px] truncate text-neutral-400">
                    {currentUser.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {showProfileDropdown && (
                <div id="profile-dropdown-menu" className="absolute right-0 top-full mt-2 w-56 rounded-md shadow-xl py-1 border text-xs bg-neutral-900 border-neutral-800 text-neutral-300 z-50">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-neutral-800">
                        <span className="font-bold text-neutral-100 block">{currentUser.name}</span>
                        <span className="text-[10px] text-neutral-500 block truncate">{currentUser.email}</span>
                        <span className={`inline-block text-[9px] font-mono rounded px-1.5 mt-1 capitalize font-bold ${
                          currentUser.role === 'admin' ? 'bg-red-900/60 text-red-200' : 'bg-green-900/60 text-green-200'
                        }`}>
                          Role: {currentUser.role}
                        </span>
                      </div>
                      
                      <button
                        id="profile-dropdown-link-orders"
                        onClick={() => { onNavigate('profile'); setShowProfileDropdown(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-800 transition"
                      >
                        My Account & Addresses
                      </button>

                      <button
                        id="profile-dropdown-link-alltracks"
                        onClick={() => { onNavigate('track-order'); setShowProfileDropdown(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-800 transition"
                      >
                        Vehicle Fitment & Bulb Finder
                      </button>

                      <button
                        id="profile-dropdown-btn-signout"
                        onClick={() => {
                          signOut();
                          setShowProfileDropdown(false);
                          onNavigate('home');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-950/40 text-rose-400 font-semibold transition"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-neutral-800 text-neutral-400">
                        Welcome to Light Hub Customs!
                      </div>
                      <button
                        id="profile-dropdown-btn-goto-signin"
                        onClick={() => { onNavigate('login'); setShowProfileDropdown(false); }}
                        className="w-full text-left px-4 py-2.5 font-bold text-cyan-400 hover:bg-neutral-800 transition"
                      >
                        Sign In / Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
