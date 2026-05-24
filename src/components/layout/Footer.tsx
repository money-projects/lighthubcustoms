import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Shield, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { theme } = useApp();

  return (
    <footer 
      id="main-app-footer"
      className={`border-t py-12 transition-all duration-300 ${
        theme === 'light' 
          ? 'bg-neutral-100/80 text-neutral-600 border-neutral-300' 
          : 'bg-neutral-950 text-neutral-400 border-cyan-950/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div id="footer-logo-col" className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-blue-700 to-cyan-400 flex items-center justify-center">
                <span className="font-mono font-black text-white text-sm">LH</span>
              </div>
              <span className="font-sans font-black text-base text-neutral-100 uppercase tracking-tight">
                Light Hub Customs
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs">
              Kenya's premium automotive LED lighting & projector retrofitting specialists. Delivering road-certified extreme output headlights, fog lights, and accessories.
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                <Activity className="h-3 w-3 inline" /> Cognito Pool & API Linked
              </span>
            </div>
          </div>

          {/* Quick Fitment Tools */}
          <div id="footer-tools-col" className="flex flex-col gap-3">
            <span className="font-mono font-bold text-[10px] tracking-widest uppercase text-cyan-400">
              Fitting & Compatibility
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button 
                  id="foot-fit-finder"
                  onClick={() => onNavigate('bulb-finder')} 
                  className="hover:text-neutral-100 hover:underline transition text-left cursor-pointer"
                >
                  Vehicle Bulb Finder
                </button>
              </li>
              <li>
                <button 
                  id="foot-fit-checker"
                  onClick={() => onNavigate('compatibility-checker')} 
                  className="hover:text-neutral-100 hover:underline transition text-left cursor-pointer"
                >
                  Direct Fitment Check
                </button>
              </li>
              <li>
                <button 
                  id="foot-fit-compare"
                  onClick={() => onNavigate('compare')} 
                  className="hover:text-neutral-100 hover:underline transition text-left cursor-pointer"
                >
                  Spec-by-Spec Compare
                </button>
              </li>
              <li>
                <button 
                  id="foot-fit-guides"
                  onClick={() => onNavigate('fitment-guide')} 
                  className="hover:text-neutral-100 hover:underline transition text-left cursor-pointer"
                >
                  DIY Installation Guides
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div id="footer-categories-col" className="flex flex-col gap-3">
            <span className="font-mono font-bold text-[10px] tracking-widest uppercase text-cyan-400">
              LED Categories
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button 
                  id="foot-cat-headlights"
                  onClick={() => onNavigate('shop', { filterCategory: 'Headlights' })} 
                  className="hover:text-neutral-100 hover:underline transition text-left cursor-pointer"
                >
                  Conversion Headlights
                </button>
              </li>
              <li>
                <button 
                  id="foot-cat-projectors"
                  onClick={() => onNavigate('shop', { filterCategory: 'Headlight Projectors' })} 
                  className="hover:text-neutral-100 hover:underline transition text-left cursor-pointer"
                >
                  Bi-LED Projectors
                </button>
              </li>
              <li>
                <button 
                  id="foot-cat-ambient"
                  onClick={() => onNavigate('shop', { filterCategory: 'Interior Lighting' })} 
                  className="hover:text-neutral-100 hover:underline transition text-left cursor-pointer"
                >
                  Aura Fiber Ambient
                </button>
              </li>
              <li>
                <button 
                  id="foot-cat-fogs"
                  onClick={() => onNavigate('shop', { filterCategory: 'Fog Lights' })} 
                  className="hover:text-neutral-100 hover:underline transition text-left cursor-pointer"
                >
                  Switchback Fog Lights
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div id="footer-resources-col" className="flex flex-col gap-3">
            <span className="font-mono font-bold text-[10px] tracking-widest uppercase text-cyan-400">
              Company & Help
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button 
                  id="foot-res-about"
                  onClick={() => onNavigate('about')} 
                  className="hover:text-neutral-100 hover:underline transition text-left cursor-pointer"
                >
                  About Our Crew
                </button>
              </li>
              <li>
                <button 
                  id="foot-res-contact"
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-neutral-100 hover:underline transition text-left cursor-pointer"
                >
                  Contact Workshops
                </button>
              </li>
              <li>
                <button 
                  id="foot-res-help"
                  onClick={() => onNavigate('help')} 
                  className="hover:text-neutral-100 hover:underline transition text-left cursor-pointer"
                >
                  FAQs & Resource Center
                </button>
              </li>
              <li>
                <button 
                  id="foot-res-terms"
                  onClick={() => onNavigate('terms')} 
                  className="hover:text-secondary-light hover:underline transition text-left cursor-pointer"
                >
                  Terms & Warranty
                </button>
              </li>
              <li>
                <button 
                  id="foot-res-privacy"
                  onClick={() => onNavigate('privacy')} 
                  className="hover:text-secondary-light hover:underline transition text-left cursor-pointer"
                >
                  Data Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div id="footer-contact-col" className="flex flex-col gap-3 text-xs">
            <span className="font-mono font-bold text-[10px] tracking-widest uppercase text-cyan-400">
              Nairobi Hub
            </span>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
              <span>Ngong Road, Greenhouse Mall, Suite 10, Nairobi, Kenya</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-cyan-500 shrink-0" />
              <span>+254 712 345 678</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-cyan-500 shrink-0" />
              <span>support@lighthubcustoms.co.ke</span>
            </div>
          </div>

        </div>

        {/* Security / System Footer Credits */}
        <div className="border-t border-neutral-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
          <div className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            <span>&copy; {new Date().getFullYear()} Light Hub Customs. Powered by standard secure AWS client libraries.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hover:underline cursor-pointer">AWS Region: us-east-1</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer">Security: Cognito Encrypted</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer font-bold text-cyan-400 bg-cyan-950/40 px-1 rounded">KES Currency</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
