import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderService } from '../../services/api';
import { Order } from '../../types';
import { Search, Loader2, Compass, AlertTriangle, ArrowRight, ShieldCheck, MapPin, Clock, FileText } from 'lucide-react';

interface TrackOrderProps {
  initialOrderId?: string;
}

export const TrackOrder: React.FC<TrackOrderProps> = ({ initialOrderId = '' }) => {
  const { theme, orders } = useApp();
  const [orderQuery, setOrderQuery] = useState(initialOrderId);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Auto trigger search if initial order ID is piped in.
  useEffect(() => {
    if (initialOrderId) {
      setOrderQuery(initialOrderId);
      handleTrackLookup(initialOrderId);
    }
  }, [initialOrderId]);

  const handleTrackFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrackLookup(orderQuery);
  };

  const handleTrackLookup = async (id: string | null) => {
    if (!id || id.trim() === '') return;
    setIsSearching(true);
    setSearchTriggered(true);
    setErrorText(null);
    setTrackedOrder(null);

    try {
      const res = await OrderService.trackOrder(id.trim());
      if (res.order) {
        setTrackedOrder(res.order);
      } else {
        setErrorText(`No order matched "${id.trim()}" in our secure system. Verify of any typos.`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorText('Handshake error with AWS database server pools. Fallback scanning failed.');
    } finally {
      setIsSearching(false);
    }
  };

  // Get status class for step indicators
  const getStepStatus = (step: 'pending' | 'processing' | 'shipped' | 'delivered', activeStatus: Order['status']) => {
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIdx = statusOrder.indexOf(activeStatus);
    const stepIdx = statusOrder.indexOf(step);

    if (activeStatus === 'cancelled') {
      return { active: false, complete: false, label: 'Cancelled', style: 'text-rose-500 border-rose-900/40 bg-rose-950/10' };
    }

    if (stepIdx < currentIdx) {
      return { active: false, complete: true, style: 'text-emerald-400 border-emerald-500/80 bg-emerald-950/20' };
    } else if (stepIdx === currentIdx) {
      return { active: true, complete: false, style: 'text-cyan-400 border-cyan-400 bg-cyan-950/30' };
    } else {
      return { active: false, complete: false, style: 'text-neutral-500 border-neutral-850 bg-neutral-950/40' };
    }
  };

  return (
    <div id="track-order-module-view" className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
            TRACK ORDER DISPATCH STATUS
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
            Input compile reference IDs to evaluate active fulfillment progress, courier dispatch streams, or scheduled diagnostic fittings.
          </p>
        </div>

        {/* Tracker Search input form */}
        <div className={`p-6 rounded-lg mb-8 border ${
          theme === 'light' ? 'bg-neutral-100 border-neutral-300' : 'bg-neutral-900/40 border-neutral-850'
        }`}>
          <form onSubmit={handleTrackFormSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <input
                id="tracker-lookup-id-field"
                type="text"
                value={orderQuery}
                required
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="e.g. ORD-1775757135538"
                className="w-full py-2.5 pl-10 pr-4 bg-neutral-950 text-neutral-100 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs font-mono"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
            </div>
            
            <button
              id="tracker-lookup-submit-btn"
              type="submit"
              disabled={isSearching}
              className="px-6 py-2 pb-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-sans font-black text-xs cursor-pointer shadow transition shrink-0 flex items-center gap-2"
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Track Package'}
            </button>
          </form>

          {/* Quick recommendations if they have current active profile orders */}
          {orders.length > 0 && (
            <div className="mt-4 border-t border-neutral-800/80 pt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neutral-500 font-mono text-[10px] uppercase">My Active Reference IDs:</span>
              {orders.slice(0, 3).map(o => (
                <button
                  key={o.orderId}
                  onClick={() => {
                    setOrderQuery(o.orderId);
                    handleTrackLookup(o.orderId);
                  }}
                  className="px-2 py-0.5 rounded bg-neutral-950/60 border border-neutral-850 font-mono text-[10px] text-cyan-400 hover:border-cyan-500/25 transition cursor-pointer"
                >
                  {o.orderId}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Searching Loader spinner */}
        {isSearching && (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
            <span className="text-xs font-mono text-neutral-400">Querying AWS Cognito and LH-Orders clusters...</span>
          </div>
        )}

        {/* Error message */}
        {errorText && !isSearching && (
          <div className="p-4 rounded border border-rose-950 bg-rose-950/15 text-rose-400 text-xs leading-relaxed flex items-start gap-2 max-w-lg mx-auto">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{errorText}</span>
          </div>
        )}

        {/* Tracking result page */}
        {trackedOrder && !isSearching && (
          <div className="space-y-6">
            
            {/* Summary card header banner */}
            <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/60 font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/30">
                  Live Dispatch Status Feed
                </span>
                <h3 className="font-sans font-black text-md text-white mt-1 uppercase tracking-tight">
                  Reference Record {trackedOrder.orderId}
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-neutral-500 font-mono block">FINAL INVOICE SUM</span>
                <span className="font-mono font-bold text-xs text-amber-500 block mt-0.5">KES {trackedOrder.total?.toLocaleString()}</span>
              </div>
            </div>

            {/* Glowing 4-Phase progress line map */}
            <div id="tracker-progress-bar-flow" className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/40">
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2">
                
                {/* 1. Pending */}
                {(() => {
                  const state = getStepStatus('pending', trackedOrder.status);
                  return (
                    <div className={`p-4 rounded border text-center flex flex-col gap-1 items-center transition ${state.style}`}>
                      <span className="font-mono font-bold text-[10px] uppercase">1. Logged</span>
                      <span className="text-[9px] text-neutral-400 block max-w-[120px] mx-auto mt-0.5 leading-normal">
                        Order received in LH clusters.
                      </span>
                      {state.complete && <span className="text-[10px] font-bold text-emerald-400 mt-1">✓ Complete</span>}
                      {state.active && <span className="text-[10px] font-bold text-cyan-400 mt-1 animate-pulse">● Active</span>}
                    </div>
                  );
                })()}

                {/* 2. Processing */}
                {(() => {
                  const state = getStepStatus('processing', trackedOrder.status);
                  return (
                    <div className={`p-4 rounded border text-center flex flex-col gap-1 items-center transition ${state.style}`}>
                      <span className="font-mono font-bold text-[10px] uppercase">2. Assembly</span>
                      <span className="text-[9px] text-neutral-400 block max-w-[120px] mx-auto mt-0.5 leading-normal">
                        LED wire testing & fit prep.
                      </span>
                      {state.complete && <span className="text-[10px] font-bold text-emerald-400 mt-1">✓ Complete</span>}
                      {state.active && <span className="text-[10px] font-bold text-cyan-400 mt-1 animate-pulse">● Active</span>}
                    </div>
                  );
                })()}

                {/* 3. Shipped */}
                {(() => {
                  const state = getStepStatus('shipped', trackedOrder.status);
                  return (
                    <div className={`p-4 rounded border text-center flex flex-col gap-1 items-center transition ${state.style}`}>
                      <span className="font-mono font-bold text-[10px] uppercase">3. Dispatched</span>
                      <span className="text-[9px] text-neutral-400 block max-w-[120px] mx-auto mt-0.5 leading-normal">
                        Entrusted to courier team.
                      </span>
                      {state.complete && <span className="text-[10px] font-bold text-emerald-400 mt-1">✓ Complete</span>}
                      {state.active && <span className="text-[10px] font-bold text-cyan-400 mt-1 animate-pulse">● Active</span>}
                    </div>
                  );
                })()}

                {/* 4. Delivered */}
                {(() => {
                  const state = getStepStatus('delivered', trackedOrder.status);
                  return (
                    <div className={`p-4 rounded border text-center flex flex-col gap-1 items-center transition ${state.style}`}>
                      <span className="font-mono font-bold text-[10px] uppercase">4. Delivered</span>
                      <span className="text-[9px] text-neutral-400 block max-w-[120px] mx-auto mt-0.5 leading-normal">
                        Arrived at destination base.
                      </span>
                      {state.complete && <span className="text-[10px] font-bold text-emerald-400 mt-1">✓ Complete</span>}
                      {state.active && <span className="text-[10px] font-bold text-cyan-400 mt-1 animate-pulse">● Active</span>}
                    </div>
                  );
                })()}

              </div>

            </div>

            {/* Recipients spec details & items lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-300">
              
              {/* Product items inside list */}
              <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/40 flex flex-col gap-3">
                <span className="font-mono font-bold text-[10px] uppercase text-cyan-400 border-b pb-1.5 border-neutral-900">
                  Consolidated Package Content
                </span>
                
                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                  {trackedOrder.items?.map((item, index) => (
                    <div key={index} className="flex gap-2.5 items-center justify-between py-1 border-b border-neutral-950/40">
                      <div className="flex gap-2 truncate">
                        <img 
                          src={item.image} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="h-8 w-8 object-cover rounded border border-neutral-950 shrink-0"
                        />
                        <span className="font-sans font-bold text-xs truncate max-w-[140px] text-neutral-200 block mt-0.5">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-neutral-400 shrink-0">
                        {item.quantity} Unit(s)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping target address credentials */}
              <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/40 flex flex-col gap-3 font-mono leading-relaxed text-[11px]">
                <span className="font-sans font-bold text-xs uppercase text-cyan-400 border-b pb-1.5 border-neutral-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Recipient Transit Address
                </span>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">FullName:</span>
                    <span className="text-neutral-200">{trackedOrder.shippingInfo?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Phone:</span>
                    <span className="text-neutral-200">{trackedOrder.shippingInfo?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Location:</span>
                    <span className="text-neutral-200 truncate max-w-[180px]">{trackedOrder.shippingInfo?.address}</span>
                  </div>
                  
                  {trackedOrder.orderNotes && (
                    <div className="border-t border-neutral-900 pt-1.5 mt-1.5 text-[10px] text-amber-500 leading-tight">
                       <strong>Fitting notes:</strong> {trackedOrder.orderNotes}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
