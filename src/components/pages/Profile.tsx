import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MapPin, Plus, Trash2, CheckCircle2, ShoppingBag, Eye } from 'lucide-react';

interface ProfileProps {
  onNavigate: (page: string, extra?: any) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    orders, 
    addresses, 
    addAddress, 
    removeAddress, 
    setDefaultAddress, 
    theme 
  } = useApp();

  // Address entry form toggle
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [county, setCounty] = useState('Nairobi');
  const [postalCode, setPostalCode] = useState('00100');
  const [isDefault, setIsDefault] = useState(false);

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine) return;

    addAddress({
      fullName,
      phone,
      address: addressLine,
      apartment: apartment || undefined,
      city,
      county,
      postalCode,
      isDefault
    });

    // Reset fields
    setFullName('');
    setPhone('');
    setAddressLine('');
    setApartment('');
    setIsDefault(false);
    setShowForm(false);
  };

  if (!currentUser) {
    return (
      <div className="py-20 text-center max-w-sm mx-auto space-y-4">
        <h3 className="font-bold text-neutral-200">No active profile session</h3>
        <p className="text-xs text-neutral-500">Sign Up or enter your credentials to manage previous catalog purchases and saved address logs.</p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2 bg-cyan-500 text-neutral-950 rounded font-sans font-black text-xs"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div id="profile-panel-view" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Badge Display */}
        <div className="mb-10 p-6 rounded-lg border border-neutral-800 bg-neutral-900/40 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex gap-4 items-center">
            <div className="h-16 w-16 bg-gradient-to-tr from-blue-700 to-cyan-400 rounded-full flex items-center justify-center font-sans font-black text-white text-xl">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="bg-cyan-950/40 text-cyan-400 font-mono text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded">Verified Driver Badge</span>
              <h2 className="font-sans font-black text-lg text-neutral-100 uppercase tracking-tight mt-1">{currentUser.name}</h2>
              <span className="text-[11px] text-neutral-400 block font-mono">{currentUser.email}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <span className="text-neutral-500 font-mono text-[9px] uppercase">Registered contacts:</span>
            <span className="text-neutral-200 flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-cyan-400" /> {currentUser.email}</span>
            <span className="text-neutral-200 flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-cyan-400" /> {currentUser.phone || '+254 712 345 678'}</span>
          </div>

          <div className="text-left md:text-right text-xs">
            <span className="text-neutral-500 font-mono text-[9px] uppercase block">Assigned Clearance Roll:</span>
            <span className="font-sans font-black text-neutral-100 uppercase block">{currentUser.role === 'admin' ? '🔒 System Administrator' : '👤 Standard Customer'}</span>
            <span className="text-[10px] text-neutral-400 block mt-1">Cognito verified registration</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Previous Orders column */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-sans font-black text-sm text-neutral-100 uppercase tracking-tight border-b pb-3.5 border-neutral-850 flex items-center justify-between">
              <span>My Historical Transactions</span>
              <span className="bg-neutral-950 text-neutral-400 font-mono text-[10px] px-2 py-0.5 rounded font-extrabold">
                {orders.length} Invoices
              </span>
            </h3>

            {orders.length === 0 ? (
              <div className="p-10 text-center border border-neutral-900 rounded-lg bg-neutral-900/15 text-xs text-neutral-500 flex flex-col items-center justify-center gap-2">
                <ShoppingBag className="h-6 w-6 text-neutral-600" />
                <span>No historical purchases logged in your Cognito database profile.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div 
                    id={`profile-order-row-${order.orderId}`}
                    key={order.orderId}
                    className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs ${
                      theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900/30 border-neutral-850'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-cyan-400">{order.orderId}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold capitalize ${
                          order.status === 'delivered' ? 'bg-emerald-950/60 text-emerald-300' :
                          order.status === 'shipped' ? 'bg-cyan-950/60 text-cyan-300' : 'bg-neutral-950 text-neutral-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500 block">
                        Logged Date: {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[11px] text-neutral-300 block font-normal">
                        Package: {order.items?.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                      </span>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span className="font-black text-neutral-100">KES {order.total?.toLocaleString()}</span>
                      <button
                        id={`track-btn-profile-${order.orderId}`}
                        onClick={() => onNavigate('track-order', { orderId: order.orderId })}
                        className="p-1 px-3 bg-neutral-950 hover:bg-neutral-800 rounded border border-neutral-850 text-cyan-400 text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="h-3 w-3" /> Track Status
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Saved Addresses column */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-sans font-black text-sm text-neutral-100 uppercase tracking-tight border-b pb-3.5 border-neutral-850 flex items-center justify-between">
              <span>Saved Shipping Registers</span>
              <button
                id="profile-toggle-create-addr-btn"
                onClick={() => setShowForm(!showForm)}
                className="text-cyan-400 font-sans text-xs font-bold hover:underline flex items-center gap-1 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" /> Add New
              </button>
            </h3>

            {/* Alternative Address Creator Form */}
            {showForm && (
              <form onSubmit={handleCreateAddress} className="p-4 rounded border bg-neutral-950/80 border-cyan-900/30 text-xs font-mono space-y-3.5">
                <span className="font-sans font-bold text-neutral-200 block text-xs border-b pb-1.5 border-neutral-900">
                  Record Alternative Address
                </span>

                <div>
                  <label className="block text-[8px] uppercase text-neutral-500 mb-1">Full Name</label>
                  <input
                    id="profile-form-fullname"
                    type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="Recipient name"
                    className="w-full py-1.5 px-3 bg-neutral-900 border border-neutral-800 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[8px] uppercase text-neutral-500 mb-1">Phone</label>
                  <input
                    id="profile-form-phone"
                    type="text" required value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+254..."
                    className="w-full py-1.5 px-3 bg-neutral-900 border border-neutral-800 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[8px] uppercase text-neutral-500 mb-1">Street Address</label>
                  <input
                    id="profile-form-addressline"
                    type="text" required value={addressLine} onChange={e => setAddressLine(e.target.value)}
                    className="w-full py-1.5 px-3 bg-neutral-900 border border-neutral-800 rounded focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] uppercase text-neutral-500 mb-1">Apartment</label>
                    <input
                      id="profile-form-apartment"
                      type="text" value={apartment} onChange={e => setApartment(e.target.value)}
                      className="w-full py-1.5 px-3 bg-neutral-900 border border-neutral-800 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase text-neutral-500 mb-1">City</label>
                    <input
                      id="profile-form-city"
                      type="text" value={city} onChange={e => setCity(e.target.value)}
                      className="w-full py-1.5 px-3 bg-neutral-900 border border-neutral-800 rounded focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    id="profile-form-default-chk"
                    type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)}
                    className="h-3.5 w-3.5 text-cyan-400 bg-neutral-900 border-neutral-800 rounded"
                  />
                  <span className="text-[10px] text-neutral-400 select-none">Set as default transport base</span>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-neutral-900">
                  <button
                    id="profile-form-cancel"
                    type="button" onClick={() => setShowForm(false)}
                    className="px-3 py-1 text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    id="profile-form-submit"
                    type="submit"
                    className="px-4 py-1 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 rounded font-sans font-bold"
                  >
                    Register Address
                  </button>
                </div>
              </form>
            )}

            {/* Address Records list */}
            {addresses.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-500">
                No address books recorded. Add above.
              </div>
            ) : (
              <div className="space-y-3.5 text-xs font-mono">
                {addresses.map(addr => (
                  <div 
                    id={`profile-addr-row-${addr.addressId}`}
                    key={addr.addressId}
                    className="p-3.5 rounded border border-neutral-850 bg-neutral-900/20 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-100">{addr.fullName}</span>
                      {addr.isDefault ? (
                        <span className="text-[8px] uppercase font-bold text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/30 shrink-0">
                          Primary Target
                        </span>
                      ) : (
                        <button
                          id={`set-prime-addr-${addr.addressId}`}
                          onClick={() => setDefaultAddress(addr.addressId)}
                          className="text-[8px] text-neutral-500 hover:text-cyan-400 font-bold uppercase"
                        >
                          Make Primary
                        </button>
                      )}
                    </div>

                    <p className="text-neutral-300 leading-normal">
                      {addr.address}, {addr.apartment && `${addr.apartment},`} <br />
                      {addr.city}, Ken &bull; {addr.phone}
                    </p>

                    <button
                      id={`delete-addr-${addr.addressId}`}
                      onClick={() => removeAddress(addr.addressId)}
                      className="absolute bottom-3 right-3 text-neutral-550 hover:text-rose-400 transition"
                      title="Delete profile address"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
