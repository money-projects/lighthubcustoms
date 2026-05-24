import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { BookOpen, AlertTriangle, ArrowRight, Video, FileText, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

interface GuideStep {
  number: number;
  title: string;
  desc: string;
  image: string;
}

interface Guide {
  id: string;
  category: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  tools: string[];
  tips: string[];
  warnings: string[];
  steps: GuideStep[];
}

const INSTALL_GUIDES: Guide[] = [
  {
    id: "guide-headlight",
    category: "Headlights",
    title: "LED Conversion Headlight Installation Guide",
    difficulty: "Medium",
    time: "25-35 Minutes",
    tools: ["Microfiber Cloth", "Nitrile Gloves Required", "Flathead Screwdriver", "Zip-Ties"],
    tips: [
      "Test both stock bulbs before unplugging to identify wire paths.",
      "Check and make sure to align the LED bulb horizontally (chips at 3 and 9 o'clock) for best beam pattern.",
      "Never turn on the headlights when bulbs are removed from housing."
    ],
    warnings: [
      "CRITICAL: Do NOT touch the LED emitter chips with bare fingers; oil can ruin lifespan.",
      "Ensure vehicle has been turned off for at least 30 minutes to permit stock halogens to cool."
    ],
    steps: [
      {
        number: 1,
        title: "Gain Engine Cabin Access",
        desc: "Pop open the hood of the vehicle and locate the rear rubber dust caps or wiring sockets of the headlight housing assembly.",
        image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=300&auto=format&fit=crop"
      },
      {
        number: 2,
        title: "Unplug Halogen Connector",
        desc: "Carefully press the tab on the wire socket fitting. Rotate the old bulb counter-clockwise to unlock and gently pull standard halogens straight out.",
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=300&auto=format&fit=crop"
      },
      {
        number: 3,
        title: "Insert New LED Bulb",
        desc: "Gently align the LED bulb collar alignment nodes. Insert and twist clockwise until firmly seated. Connect the wire pigtails securely in place.",
        image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=300&auto=format&fit=crop"
      },
      {
        number: 4,
        title: "Secure Drivers & Dust Caps",
        desc: "Wrap the smart cooling CANBUS driver block securely using zip-ties far from moving cooling fans. Replace the back dust rubber cap.",
        image: "https://images.unsplash.com/photo-111111111111-111111111111?q=80&w=300&auto=format&fit=crop" // fallback
      }
    ]
  },
  {
    id: "guide-fog",
    category: "Fog Lights",
    title: "Switchback Golden Amber Fog Light Installation Guide",
    difficulty: "Easy",
    time: "15-20 Minutes",
    tools: ["Screwdriver Set", "Jack Stands or Ramps", "Protection Eyewear"],
    tips: [
      "Flicking your normal switch twice triggers the color conversion instantly.",
      "Access from underneath the bumper mud-guard splash shield is usually fastest."
    ],
    warnings: [
      "Ensure car is resting on solid level surface with handbrakes engaged if using wheel ramps."
    ],
    steps: [
      {
        number: 1,
        title: "Access Bumper Fender Liner",
        desc: "Turn the steering wheel fully inside to create clearance. Unscrew 2-3 clips of the lower bumper wheel liner.",
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=300&auto=format&fit=crop"
      },
      {
        number: 2,
        title: "Extract Fog Bulb",
        desc: "Reach in behind the fog housing, rotate clockwise to release the old stock fog light and detach connector wire.",
        image: "https://images.unsplash.com/photo-1606577924046-24e3905f1f41?q=80&w=300&auto=format&fit=crop"
      },
      {
        number: 3,
        title: "Mount LED & Seal Guard",
        desc: "Push new golden yellow or dual-color bulb inside the socket, rotate. Test switching, then screw and lock the mud-guard liner.",
        image: "https://images.unsplash.com/photo-1617469767053-d3b508a0d825?q=80&w=300&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "guide-ambient",
    category: "Interior Lighting",
    title: "AuraFiber Interactive Ambient Acrylic Setup Guide",
    difficulty: "Hard",
    time: "60-90 Minutes",
    tools: ["Plastic Pry Tool Set", "Fuses Extractor", "Scissors", "Strong Adhesive Tape"],
    tips: [
      "Map out the optic lines layout before cutting any excess PMMA acrylic tube length.",
      "Test color sync apps through the custom BLE Light Hub application on standby first."
    ],
    warnings: [
      "Do NOT twist or fold optical cables too hard or the inside light propagation will fracture!"
    ],
    steps: [
      {
        number: 1,
        title: "Pry Trim Panel Lines",
        desc: "Using the non-marring plastic pry tool, create minor gaps between dashboard trims and passenger doors.",
        image: "https://images.unsplash.com/photo-1550479023-2a811e19dfd3?q=80&w=300&auto=format&fit=crop"
      },
      {
        number: 2,
        title: "Weave Fiber Optic Lines",
        desc: "Feed the custom side-glow fiber tightly into the prying trim gaps. Slide the tube snugly to keep flush with the line of paneling.",
        image: "https://images.unsplash.com/photo-1549244311-fffb70a72447?q=80&w=300&auto=format&fit=crop"
      },
      {
        number: 3,
        title: "Wire to 12V Fuse Box",
        desc: "Route wires behind dashboard to the passenger cabin fuse box. Plug using our included bypass adapter into accessory 'ACC' fuses.",
        image: "https://images.unsplash.com/photo-1562426509-5044a121aa49?q=80&w=300&auto=format&fit=crop"
      }
    ]
  }
];

export const FitmentGuide: React.FC = () => {
  const { theme } = useApp();
  const [selectedGuideId, setSelectedGuideId] = useState<string>("guide-headlight");
  const [downloadedMock, setDownloadedMock] = useState(false);

  const activeGuide = INSTALL_GUIDES.find(g => g.id === selectedGuideId) || INSTALL_GUIDES[0];
  const relatedProducts = ALL_PRODUCTS.filter(p => p.category === activeGuide.category).slice(0, 3);

  const handleDownload = () => {
    setDownloadedMock(true);
    setTimeout(() => setDownloadedMock(false), 2000);
    // Trigger window.print or generate simple file
    window.print();
  };

  return (
    <div id="fitment-guide-tool-view" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Headers */}
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-bold mb-1">DIY GARAGE WORKSHOP</p>
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
            DIY INSTALLATION & FITMENT GUIDES
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
            Choose a system category below to browse step-by-step master retrofitting manuals compiled by our Nairobi engineers.
          </p>
        </div>

        {/* Categories Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {INSTALL_GUIDES.map(guide => (
            <button
              id={`fitment-tab-${guide.id}`}
              key={guide.id}
              onClick={() => setSelectedGuideId(guide.id)}
              className={`px-4 py-2 font-sans font-bold text-xs uppercase tracking-tight rounded-md border transition cursor-pointer ${
                selectedGuideId === guide.id
                  ? 'bg-cyan-500 text-neutral-950 border-cyan-400 shadow-md'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {guide.category} Manual
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Manual Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Guide Info block */}
            <div className={`p-6 rounded-xl border ${
              theme === 'light' ? 'bg-white border-neutral-200 shadow-sm' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <div className="flex flex-wrap justify-between items-center gap-4 border-b border-neutral-800/80 pb-4 mb-4">
                <h2 className="font-sans font-black text-lg text-neutral-100 uppercase tracking-tight">
                  {activeGuide.title}
                </h2>
                
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    activeGuide.difficulty === 'Easy' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' :
                    activeGuide.difficulty === 'Medium' ? 'bg-amber-950/40 text-amber-400 border-amber-900/30' :
                    'bg-rose-950/40 text-rose-400 border-rose-900/30'
                  }`}>
                    {activeGuide.difficulty} Fit
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-950 text-neutral-300 font-mono font-bold uppercase border border-neutral-800">
                    Est: {activeGuide.time}
                  </span>
                </div>
              </div>

              {/* Tools row */}
              <div className="mb-6">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#00e5ff] font-bold block mb-2">
                  REQUIRED SHOP TOOLS
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {activeGuide.tools.map(tool => (
                    <span key={tool} className="py-1 px-2.5 rounded bg-neutral-950 border border-neutral-900 text-neutral-300 font-bold">
                      &bull; {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Steps Area */}
              <div className="space-y-6">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#00e5ff] font-bold block border-b border-neutral-800 pb-1.5">
                  STEP-BY-STEP RETROFITTING OPERATIONS
                </span>

                {activeGuide.steps.map(step => (
                  <div key={step.number} className="flex flex-col md:flex-row gap-5 p-4 rounded-lg bg-neutral-950/40 border border-neutral-900 relative">
                    <span className="absolute top-3 right-3 font-mono font-black text-2xl text-cyan-500/25">
                      0{step.number}
                    </span>
                    
                    <img 
                      src={step.image} 
                      alt="" 
                      referrerPolicy="no-referrer"
                      className="h-28 w-40 object-cover rounded border border-neutral-800 shrink-0" 
                      onError={(e) => {
                        // Fallback image securely
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=300&auto=format&fit=crop';
                      }}
                    />

                    <div className="flex-1">
                      <span className="font-mono text-[9px] text-[#00e5ff] uppercase font-extrabold block">
                        Phase {step.number}
                      </span>
                      <h4 className="font-sans font-bold text-sm text-neutral-100 uppercase tracking-tight mt-0.5">
                        {step.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Video mock display */}
            <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold block mb-3">
                INTEGRATED VIDEO WORKSHOP
              </span>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-950 bg-black flex flex-col justify-center items-center gap-2 group cursor-pointer sm:px-6 text-center">
                <Video className="h-10 w-10 text-cyan-400 group-hover:scale-110 transition shrink-0" />
                <span className="font-sans font-black text-xs text-neutral-200">PLAY NAIROBI LAB TUTORIAL VIDEO</span>
                <span className="text-[10px] text-neutral-500 font-mono">14 minutes detailed teardown of {activeGuide.category} setups</span>
              </div>
            </div>

          </div>

          {/* Tips / Warning / Related Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Tips & warnings */}
            <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950/40 flex flex-col gap-4">
              <div className="text-xs space-y-3">
                <span className="font-mono text-[10px] tracking-widest text-[#00e5ff] uppercase font-bold block">
                  Engineer Pro Tips:
                </span>
                <ul className="space-y-2 list-disc pl-4 text-neutral-300">
                  {activeGuide.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>

              <div className="text-xs space-y-3 border-t border-neutral-900 pt-4 text-rose-300">
                <span className="font-mono text-[10px] tracking-widest text-rose-500 uppercase font-bold block flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> High Risk Warnings:
                </span>
                <ul className="space-y-2 list-disc pl-4">
                  {activeGuide.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                </ul>
              </div>

              <div className="border-t border-neutral-900 pt-3 text-center space-y-2">
                <button
                  id="fitment-download-pdf-btn"
                  onClick={handleDownload}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded font-sans text-[10px] text-neutral-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-cyan-400" /> {downloadedMock ? 'Generating PDF Fit Guide...' : 'Download PDF Guide'}
                </button>
              </div>
            </div>

            {/* Related products recommendation */}
            <div className={`p-5 rounded-xl border ${
              theme === 'light' ? 'bg-white border-neutral-200 shadow-sm' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <h3 className="font-sans font-bold text-xs uppercase text-neutral-100 border-b pb-3 border-neutral-800 mb-4 tracking-wider">
                Compatible {activeGuide.category} Products
              </h3>

              <div className="space-y-3">
                {relatedProducts.map(prod => (
                  <div 
                    id={`fitment-related-item-${prod.productId}`}
                    key={prod.productId}
                    className="p-3 rounded bg-neutral-950/40 border border-neutral-900 flex gap-2 hover:border-cyan-500/20 transition group"
                  >
                    <img src={prod.imageUrl} alt="" referrerPolicy="no-referrer" className="h-10 w-10 object-cover rounded border border-neutral-850 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-[11px] text-neutral-200 block truncate group-hover:text-cyan-400 transition">{prod.name}</span>
                      <span className="font-mono text-[9px] text-[#006090] block mt-0.5">KES {prod.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
