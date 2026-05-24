import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Mail, MapPin, Search, ChevronDown, ChevronUp, Clock, CheckCircle, Shield, Globe } from 'lucide-react';

// ==========================================
// 1. ABOUT US PAGE
// ==========================================
export const AboutUs: React.FC = () => {
  const { theme } = useApp();
  return (
    <div id="about-us-view" className="py-8 font-sans max-w-4xl mx-auto px-4 z-10 relative">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-bold mb-1">OUR NAIROBI STORY</p>
        <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
          ABOUT LIGHT HUB CUSTOMS
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
          We operate as Kenya's premier advanced automotive retrofitting engineering workshop, pioneering extreme-brightness laser projector headlights and premium styling elements.
        </p>
      </div>

      <div className="space-y-8">
        <div className={`p-6 rounded-xl border ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-805'}`}>
          <h2 className="font-sans font-black text-lg text-neutral-100 uppercase tracking-tight mb-3">Our Core Philosophy</h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Light Hub Customs was established in Nairobi following a simple realization: standard halogen bulbs are inadequate for African roadways, dense mountain fog, and security needs. We bring highest-quality CSP and Cree LED chip upgrades, engineered alongside advanced active cooling alloys and error-cancelling CANBUS decoders, to vehicles across East Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className={`p-5 rounded-xl border ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-805'}`}>
            <h3 className="font-sans font-bold text-sm text-cyan-400 uppercase mb-2">100% Fitment Guard</h3>
            <p className="text-xs text-neutral-400 leading-normal">
              We leverage an extensively mapped physical parameters fitment database of Toyota, Nissan, Honda, Mercedes, and European luxury builds to assure plug-and-play matches before you purchase.
            </p>
          </div>
          <div className={`p-5 rounded-xl border ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-805'}`}>
            <h3 className="font-sans font-bold text-sm text-cyan-400 uppercase mb-2">Road Safety Engineering</h3>
            <p className="text-xs text-neutral-400 leading-normal">
              We focus on absolute pattern alignment, ensuring a razor-sharp cutoff beam limit that delivers double downfield throw safety without causing oncoming driver blind glares.
            </p>
          </div>
        </div>

        <div className={`p-6 rounded-xl border text-center ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-805'}`}>
          <h3 className="font-sans font-bold text-sm text-neutral-200 uppercase mb-3">VISIT OUR RETROFIT DEPOT</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-4">
            The Greenhouse Mall, Suite 10, Ngong Road, Nairobi, Kenya. Our certified technicians execute full bumper removals, bulb conversions, and internal headlight restoration daily.
          </p>
          <span className="text-xs font-mono text-cyan-400 font-black">Open: Mon - Sat (8:00 AM - 6:00 PM)</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. CONTACT US PAGE
// ==========================================
export const ContactUs: React.FC = () => {
  const { theme } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4050);
  };

  return (
    <div id="contact-us-view" className="py-8 font-sans max-w-5xl mx-auto px-4 z-10 relative">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-bold mb-1">GET IN TOUCH</p>
        <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
          TALK TO OUR EXPERT BULB ENGINEERS
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
          Need custom projector pricing or bulk fleet LED replacements? Send us your requirements and we will reply within 2 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Contact info cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`p-5 rounded-xl border flex flex-col gap-3 ${theme === 'light' ? 'bg-white' : 'bg-neutral-900 border-neutral-805'}`}>
            <span className="font-mono text-[9px] text-cyan-400 font-extrabold uppercase tracking-wider block">CONTACT DEPOT</span>
            
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
              <span className="text-neutral-300 font-medium">Ngong Road, Greenhouse Mall, Suite 10, Nairobi, Kenya</span>
            </div>

            <div className="flex items-start gap-2 text-xs">
              <Phone className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
              <span className="text-neutral-300 font-medium">+254 712 345 678</span>
            </div>

            <div className="flex items-start gap-2 text-xs">
              <Mail className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
              <span className="text-neutral-300 font-medium">support@lighthubcustoms.co.ke</span>
            </div>
          </div>

          <div className={`p-5 rounded-xl border flex flex-col gap-2 ${theme === 'light' ? 'bg-white' : 'bg-neutral-900 border-neutral-805'}`}>
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-500 font-bold uppercase mb-1">
              <Clock className="h-4 w-4" /> Nairobi Depot Hours
            </div>
            <div className="grid grid-cols-2 text-xs text-neutral-400">
              <span>Weekdays:</span> <span className="font-sans font-bold text-neutral-200">8:00 AM - 6:00 PM</span>
              <span>Saturdays:</span> <span className="font-sans font-bold text-neutral-200">9:00 AM - 4:00 PM</span>
              <span>Sundays:</span> <span className="text-rose-500 font-mono font-bold uppercase text-[10px]">Closed (Rest)</span>
            </div>
          </div>

          {/* Mock Map Element */}
          <div className="h-44 rounded-xl overflow-hidden border border-neutral-850 bg-neutral-950 flex flex-col justify-center items-center text-center p-4 relative">
            <Globe className="h-8 w-8 text-cyan-400 animate-spin opacity-55 shrink-0" />
            <h4 className="font-bold text-xs text-neutral-200 mt-2 uppercase tracking-tight">ACTIVE GPS RADAR MATRIX</h4>
            <span className="text-[10px] text-neutral-500 font-mono">Latitude: -1.3005° S, Longitude: 36.7825° E</span>
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-900/40 text-emerald-400 font-mono text-[8px] font-extrabold uppercase">
              Secure HQ Link
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className={`p-6 rounded-xl border ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-805'}`}>
            <h3 className="font-sans font-black text-sm text-neutral-100 uppercase tracking-tight border-b border-neutral-800 pb-3 mb-4">
              Send Secure Message
            </h3>

            {submitted ? (
              <div className="p-8 text-center text-xs text-emerald-400 border border-emerald-900/30 bg-emerald-950/20 rounded flex flex-col items-center justify-center gap-2">
                <CheckCircle className="h-8 w-8 text-emerald-400 animate-bounce" />
                <span className="font-bold uppercase tracking-wide">✓ MESSAGE TRANSMITTED SECURELY</span>
                <p className="text-neutral-300 max-w-sm mt-1">Thank you. Your inquiry has been matched with our customer support queue. An expert engineer will contextually respond within 2 hours!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Full Name</span>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full py-1.5 px-3 rounded text-xs bg-neutral-950 text-neutral-200 border border-neutral-850 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Email Address</span>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full py-1.5 px-3 rounded text-xs bg-neutral-950 text-neutral-200 border border-neutral-850 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Inquiry Subject</span>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full py-1.5 px-3 rounded text-xs bg-neutral-950 text-neutral-200 border border-neutral-850 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Describe Requirements (e.g. car model, bulb position, error codes)</span>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full py-1.5 px-3 rounded text-xs bg-neutral-950 text-neutral-200 border border-neutral-850 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="Enter your query details..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    id="contact-form-submit-btn"
                    type="submit"
                    className="px-6 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-sans font-black text-xs transition duration-200"
                  >
                    Transmit Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. HELP & FAQ ACCORDION PAGE
// ==========================================
interface FAQItem {
  q: string;
  a: string;
  cat: string;
}

const FAQS: FAQItem[] = [
  {
    q: "Will these LED retrofits cause dashboard CANBUS error warnings on my dash?",
    a: "No. Light Hub conversion kits are embedded with intelligent CANBUS resistance decoders that balance voltage pulses in 99% of vehicle boards, preventing hyper-flashing, flickering, or warnings.",
    cat: "CANBUS & Warnings"
  },
  {
    q: "Do I have to chop or splice my factory wires to fit Bi-LED projection lenses?",
    a: "Absolutely not. Our kits are built exactly to match existing standard sizes (H11, HB3, H4, D2S). They slot in place and attach seamlessly to factory harness plugs.",
    cat: "Installations"
  },
  {
    q: "How does the Switchback Dual-Color fog bulb operate?",
    a: "It operates simply using your existing factory fog toggle switch. Turn it on for white (6000K). Flicking it off and then on again within 1.5 seconds instantly transitions the CSP chip to 3000K Amber Yellow.",
    cat: "Products Operation"
  },
  {
    q: "What is the difference between KES 6,500 conversion kits and generic KES 1,500 alternatives?",
    a: "Unlike generic lights that split the focal stack (resulting in terrible beam scatter and blinding other drivers), our premium bulbs align on the focal axis, paired with dual-stage copper liquid heating dissipation and high-speed silent motors.",
    cat: "Products Operation"
  },
  {
    q: "How long does shipping standard delivery take within Kenya?",
    a: "Standard delivery to Nairobi is completed within 24 hours (KES 200). Out-of-county deliveries via secure G4S courier takes 3-5 business days. Express Delivery takes 1-2 days (KES 500).",
    cat: "Delivery & Shipments"
  }
];

export const HelpFAQ: React.FC = () => {
  const { theme } = useApp();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filteredFAQs = FAQS.filter(faq => 
    faq.q.toLowerCase().includes(search.toLowerCase()) || 
    faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="help-faq-view" className="py-8 font-sans max-w-3xl mx-auto px-4 z-10 relative">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-bold mb-1">CUSTOMER ASSISTANCE GUIDE</p>
        <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
          FAQ & RESOURCE HUB
        </h1>
        
        {/* Seek Box */}
        <div className="mt-4 max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Search help topics, error codes, adapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-10 pr-4 rounded-full text-xs bg-neutral-905 text-neutral-200 border border-neutral-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
        </div>
      </div>

      <div className="space-y-3">
        {filteredFAQs.map((faq, index) => {
          const expanded = activeIdx === index;
          return (
            <div 
              id={`faq-item-card-${index}`}
              key={index}
              className={`rounded-lg border overflow-hidden transition-all duration-350 ${
                theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-850'
              }`}
            >
              <button
                id={`faq-trigger-${index}`}
                onClick={() => setActiveIdx(expanded ? null : index)}
                className="w-full p-4 text-left font-sans font-bold text-xs sm:text-sm text-neutral-100 uppercase tracking-tight flex justify-between items-center bg-neutral-950/20 hover:bg-neutral-950/40"
              >
                <div className="flex gap-2">
                  <span className="text-[10px] text-cyan-400 font-mono tracking-wider font-extrabold bg-cyan-950 px-1.5 rounded h-5 flex items-center">
                    {faq.cat}
                  </span>
                  <span>{faq.q}</span>
                </div>
                {expanded ? <ChevronUp className="h-4 w-4 text-cyan-400" /> : <ChevronDown className="h-4 w-4 text-neutral-500" />}
              </button>

              {expanded && (
                <div className="p-4 bg-neutral-950/50 border-t border-neutral-900 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 4. TERMS & CONDITIONS
// ==========================================
export const TermsAndConditions: React.FC = () => {
  const { theme } = useApp();
  return (
    <div id="terms-view" className="py-8 font-sans max-w-3xl mx-auto px-4 z-10 relative">
      <div className="mb-6">
        <h1 className="font-sans font-black text-2xl text-neutral-100 uppercase">Terms & Conditions</h1>
        <span className="text-[10px] text-neutral-500 font-mono">Last updated: May 23, 2026</span>
      </div>

      <div className={`p-6 rounded-lg border text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-4 ${theme === 'light' ? 'bg-white' : 'bg-neutral-900 border-neutral-805'}`}>
        <h4 className="font-bold text-neutral-100 uppercase tracking-tight">1. Retrogitting fitment liability</h4>
        <p>
          While Light Hub Customs provides contextually detailed Vehicle Fitment Databases and Bulb Finders to assist buyers, final verification of vehicle dimensions, adaptor collars, and electrical loading parameters remains the buyer's responsibility.
        </p>
        <h4 className="font-bold text-neutral-100 uppercase tracking-tight">2. Product Warranties</h4>
        <p>
          All Premium series conversion kits come with an automatic 1-Year limited replacement guarantee against thermal chip failure, driver warnings, or internal hardware faults.
        </p>
        <h4 className="font-bold text-neutral-100 uppercase tracking-tight">3. Legal Road Use standards</h4>
        <p>
          Our cutoff shielding mechanism guarantees road safety. Please align the height adjustment screw according to local regulations to prevent blinding oncoming drivers.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 5. PRIVACY POLICY
// ==========================================
export const PrivacyPolicy: React.FC = () => {
  const { theme } = useApp();
  return (
    <div id="privacy-view" className="py-8 font-sans max-w-3xl mx-auto px-4 z-10 relative">
      <div className="mb-6">
        <h1 className="font-sans font-black text-2xl text-neutral-100 uppercase">Privacy Policy</h1>
        <span className="text-[10px] text-neutral-500 font-mono">Last updated: May 23, 2026</span>
      </div>

      <div className={`p-6 rounded-lg border text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-4 ${theme === 'light' ? 'bg-white' : 'bg-neutral-900 border-neutral-805'}`}>
        <div className="flex items-start gap-2 text-xs font-mono text-cyan-400">
          <Shield className="h-4.5 w-4.5" /> <span>AWS-INTEGRATED SECURE TRANSACTION LAYER</span>
        </div>
        <p>
          At Light Hub Customs, we prioritize secure storage and encrypted transportation metrics. Any order credentials, address books, registration profiles, or delivery records are processed contextually and are never leased or distributed to secondary third parties.
        </p>
        <h4 className="font-bold text-neutral-100 uppercase tracking-tight">Cookies Utilization</h4>
        <p>
          We rely strictly on secure local storage matrices to sync your dark theme preferences, cart status products, preselected vehicles, and auth session tokens.
        </p>
      </div>
    </div>
  );
};
