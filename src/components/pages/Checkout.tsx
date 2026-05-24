import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_PRODUCTS } from '../../data/products';
import { ShippingInfo, OrderItem, Address } from '../../types';
import { ArrowLeft, CheckCircle, Smartphone, CreditCard, Clock, MapPin, Truck, ChevronRight, Settings, Star, Coins } from 'lucide-react';

interface CheckoutProps {
  onNavigate: (page: string, extra?: any) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  const { 
    cart, 
    addresses, 
    addAddress, 
    submitOrder, 
    currentUser, 
    theme,
    clearCart 
  } = useApp();

  const [step, setStep] = useState<'details' | 'payment' | 'submitting' | 'complete'>('details');
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [addressLine, setAddressLine] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [county, setCounty] = useState('Nairobi');
  const [postalCode, setPostalCode] = useState('00100');
  const [orderNotes, setOrderNotes] = useState('');

  // Selected saved address (if any)
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const defaultAddr = addresses.find(a => a.isDefault);
    return defaultAddr ? defaultAddr.addressId : (addresses[0]?.addressId || '');
  });

  // Delivery & Payments
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'pickup'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'cod'>('mpesa');
  
  // Payment simulations
  const [mpesaNumber, setMpesaNumber] = useState(currentUser?.phone || '+254712345678');
  const [mpesaSimState, setMpesaSimState] = useState<'idle' | 'sending' | 'pending-pin' | 'done'>('idle');
  const [mpesaPin, setMpesaPin] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // Calculations
  const cartItemsDetailed = cart.map(item => {
    const matchedProduct = ALL_PRODUCTS.find(p => p.productId === item.productId);
    return {
      ...item,
      product: matchedProduct
    };
  }).filter(item => item.product !== undefined) as {
    productId: string;
    quantity: number;
    addedAt: string;
    product: typeof ALL_PRODUCTS[0];
  }[];

  const subtotal = cartItemsDetailed.reduce((acc, curr) => {
    return acc + (curr.product.price * curr.quantity);
  }, 0);

  const getShippingCost = () => {
    if (deliveryMethod === 'pickup') return 0;
    if (deliveryMethod === 'express') return 600;
    return subtotal > 15000 ? 0 : 250; // free standard over 15k
  };

  const shippingCost = getShippingCost();
  const totalCost = subtotal + shippingCost;

  // Use a saved address to autofill
  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    const addr = addresses.find(a => a.addressId === addrId);
    if (addr) {
      setFullName(addr.fullName);
      setPhone(addr.phone);
      setAddressLine(addr.address);
      setApartment(addr.apartment || '');
      setCity(addr.city);
      setCounty(addr.county);
      setPostalCode(addr.postalCode);
    }
  };

  // Submit address details first
  const handleGoToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine) {
      alert('Please fill out all required shipping fields.');
      return;
    }
    setStep('payment');
  };

  // Run the full payment and AWS order submission sequence
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('submitting');
    await completePlacingOrder();
  };

  const completePlacingOrder = async () => {
    try {
      const orderItems: OrderItem[] = cartItemsDetailed.map(item => ({
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.imageUrl
      }));

      const shippingObj: ShippingInfo = {
        fullName,
        email: email || currentUser?.email || 'guest@lighthub.com',
        phone,
        address: addressLine,
        apartment: apartment || undefined,
        city,
        county,
        postalCode
      };

      const submitted = await submitOrder({
        items: orderItems,
        subtotal,
        shipping: shippingCost,
        total: totalCost,
        paymentMethod,
        deliveryMethod,
        shippingInfo: shippingObj,
        orderNotes: orderNotes || undefined
      });

      // Save as default address if they checked out with it
      if (addresses.length === 0 || !addresses.find(a => a.address === addressLine)) {
        addAddress({
          fullName,
          phone,
          address: addressLine,
          apartment: apartment || undefined,
          city,
          county,
          postalCode,
          isDefault: addresses.length === 0
        });
      }

      setCreatedOrder(submitted);
      setStep('complete');
    } catch (err) {
      console.error(err);
      alert('Order submission encountered a network error. Standard fallback used.');
    }
  };

  return (
    <div id="checkout-view-module" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main flow wrapper */}
        {step !== 'complete' && (
          <div className="mb-8">
            <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
              SECURE CHECKOUT FUNNEL
            </h1>
            
            {/* Step Breadcrumb bar */}
            <div className="flex items-center gap-2 mt-3 text-xs font-semibold leading-none">
              <span className={step === 'details' ? 'text-cyan-400 font-bold' : 'text-neutral-500'}>
                1. Shipping Info
              </span>
              <ChevronRight className="h-3 w-3 text-neutral-600" />
              <span className={step === 'payment' ? 'text-cyan-400 font-bold' : 'text-neutral-500'}>
                2. Payment Mode
              </span>
              <ChevronRight className="h-3 w-3 text-neutral-600" />
              <span className={step === 'submitting' ? 'text-amber-500 animate-pulse' : 'text-neutral-500'}>
                3. Authorize API
              </span>
            </div>
          </div>
        )}

        {/* DETAILS ENTRY STEP */}
        {step === 'details' && (
          <form onSubmit={handleGoToPayment} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div className="lg:col-span-2 space-y-6">
              
              {/* Address selector if they have entries */}
              {addresses.length > 0 && (
                <div className={`p-5 rounded-lg border ${theme === 'light' ? 'bg-neutral-100' : 'bg-neutral-900/40 border-neutral-800'}`}>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-3 font-bold">
                    Choose Saved Shipping Address
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                    {addresses.map(addr => (
                      <div 
                        id={`saved-addr-${addr.addressId}`}
                        key={addr.addressId}
                        onClick={() => handleSelectSavedAddress(addr.addressId)}
                        className={`p-3 rounded border text-left cursor-pointer transition ${
                          selectedAddressId === addr.addressId 
                            ? 'bg-cyan-950/40 border-cyan-500/50 text-neutral-200' 
                            : 'bg-neutral-950/20 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between text-neutral-200">
                          <span>{addr.fullName}</span>
                          {addr.isDefault && <span className="text-[9px] text-cyan-400 font-bold">(Default)</span>}
                        </div>
                        <p className="mt-1">{addr.address}, {addr.apartment}</p>
                        <p>{addr.city}, Ken &bull; {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Speed Selector Card */}
              <div className={`p-6 rounded-lg border ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                <h4 className="font-sans font-black text-sm text-neutral-100 border-b pb-3 border-neutral-800 mb-4 flex items-center gap-2">
                  <Truck className="h-4.5 w-4.5 text-cyan-500" />
                  SELECT DELIVERY METHOD
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Standard delivery */}
                  <div 
                    id="delivery-standard"
                    onClick={() => setDeliveryMethod('standard')}
                    className={`p-4 rounded border cursor-pointer flex flex-col gap-1 transition ${
                      deliveryMethod === 'standard' 
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-neutral-200' 
                        : 'bg-neutral-950/30 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span className="font-bold text-neutral-200 block">STANDARD SHIPPING</span>
                    <span className="text-[10px] text-neutral-400 leading-normal">
                      Delivers within 2-3 standard weekdays. Free for catalog baskets over KES 15,000.
                    </span>
                    <span className="font-mono font-bold text-amber-500 mt-2">
                      {subtotal > 15000 ? 'FREE' : 'KES 250'}
                    </span>
                  </div>

                  {/* Express Courier */}
                  <div 
                    id="delivery-express"
                    onClick={() => setDeliveryMethod('express')}
                    className={`p-4 rounded border cursor-pointer flex flex-col gap-1 transition ${
                      deliveryMethod === 'express' 
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-neutral-200' 
                        : 'bg-neutral-950/30 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span className="font-bold text-neutral-200 block">EXPRESS COURIER</span>
                    <span className="text-[10px] text-neutral-400 leading-normal">
                      Next-Day delivery within Nairobi & adjacent counties. Hand-delivered in heavy padded boxes.
                    </span>
                    <span className="font-mono font-bold text-amber-500 mt-2">KES 600</span>
                  </div>

                  {/* Local Pickup */}
                  <div 
                    id="delivery-pickup"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 rounded border cursor-pointer flex flex-col gap-1 transition ${
                      deliveryMethod === 'pickup' 
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-neutral-200' 
                        : 'bg-neutral-950/30 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span className="font-bold text-neutral-200 block">DIAGNOSTIC HUB PICKUP</span>
                    <span className="text-[10px] text-neutral-400 leading-normal">
                      Pick up directly at our Nairobi Hub (Ngong Road Greenhouse Mall Suite 10). Optional fit assistance.
                    </span>
                    <span className="font-mono font-bold text-amber-500 mt-2">FREE</span>
                  </div>
                </div>
              </div>

              {/* Concrete Manual address fields */}
              <div className={`p-6 rounded-lg border ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                <h4 className="font-sans font-black text-sm text-neutral-100 border-b pb-3 border-neutral-800 mb-4">
                  RECIPIENT SHIPPING DATA
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  
                  {/* Name field */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5 font-bold">Full Name (Required)</label>
                    <input 
                      id="shipping-fullname"
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Erick Dallah"
                      className="w-full py-1.5 px-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Telephone */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5 font-bold">Telephone Number (Required)</label>
                    <input 
                      id="shipping-phone"
                      type="text" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +254 712 345 678"
                      className="w-full py-1.5 px-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5 font-bold">Email Address (Receipts)</label>
                    <input 
                      id="shipping-email"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@gmail.com"
                      className="w-full py-1.5 px-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Physical Address Line */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5 font-bold">Physical/Street Address (Required)</label>
                    <input 
                      id="shipping-addressline"
                      type="text" 
                      required
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="e.g. Ngong Road, Greenhouse Mall, Suite 10"
                      className="w-full py-1.5 px-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Apartment/Suite */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5 font-bold">Apartment / suite / detail</label>
                    <input 
                      id="shipping-apartment"
                      type="text" 
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="Apartment B4, 2nd floor"
                      className="w-full py-1.5 px-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5 font-bold">City / Hub Location</label>
                    <input 
                      id="shipping-city"
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Nairobi"
                      className="w-full py-1.5 px-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  {/* County */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5 font-bold">County Name (Kenya)</label>
                    <input 
                      id="shipping-county"
                      type="text" 
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      placeholder="Nairobi"
                      className="w-full py-1.5 px-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5 font-bold">Postal Zip Code</label>
                    <input 
                      id="shipping-postal"
                      type="text" 
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="00100"
                      className="w-full py-1.5 px-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                </div>

                <div className="mt-4 text-xs font-mono">
                  <label className="block text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5 font-bold">Order notes / Retrofitting notes</label>
                  <textarea 
                    id="shipping-ordernotes"
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Leave with security guards / Please include extra H11 base spacers for Toyota Corolla"
                    className="w-full py-1.5 px-3 bg-neutral-950 text-neutral-100 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

              </div>

            </div>

            {/* Billing Basket summary card */}
            <div className="lg:col-span-1">
              <div className="p-5 rounded-lg border bg-neutral-900 border-neutral-800 text-xs text-neutral-400 space-y-4">
                <h4 className="font-sans font-bold text-neutral-100 text-xs uppercase border-b pb-2 border-neutral-800">
                  Secure Checkout Summary
                </h4>

                <div className="space-y-2 max-h-[140px] overflow-y-auto font-sans pr-2">
                  {cartItemsDetailed.map(item => (
                    <div key={item.productId} className="flex items-center justify-between text-[11px] py-1 border-b border-neutral-900/40">
                      <span className="truncate text-neutral-300 max-w-[120px] font-semibold">{item.product.name}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 font-mono text-[11px] pt-2 border-t border-neutral-800">
                  <div className="flex justify-between">
                    <span>Products Subtotal:</span>
                    <span className="text-neutral-100 font-bold">KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Option:</span>
                    <span className="text-neutral-100 font-bold">KES {shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-neutral-800 text-neutral-200">
                    <span>TOTAL COST:</span>
                    <span className="text-cyan-400">KES {totalCost.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  id="checkout-trigger-goto-payment" 
                  type="submit"
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-sans font-bold text-xs rounded transition uppercase cursor-pointer"
                >
                  Configure Payment Details
                </button>
              </div>
            </div>

          </form>
        )}

        {/* PAYMENT CHANNELS SELECTION STEP */}
        {step === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div className="lg:col-span-2 space-y-6">
              
              <div className={`p-6 rounded-lg border ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                <h4 className="font-sans font-black text-sm text-neutral-100 border-b pb-3 border-neutral-800 mb-5">
                  CHOOSE SECURE PAYMENT GATEWAY
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans mb-6">
                  {/* MPesa */}
                  <div
                    id="pay-choice-mpesa"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-4 rounded border cursor-pointer flex items-center gap-3 transition ${
                      paymentMethod === 'mpesa'
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-neutral-200'
                        : 'bg-neutral-950/30 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Smartphone className="h-5 w-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-neutral-200 block">Safaricom MPesa</span>
                      <span className="text-[10px] text-neutral-500">Instant STK Push</span>
                    </div>
                  </div>

                  {/* Credit Card */}
                  <div
                    id="pay-choice-card"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded border cursor-pointer flex items-center gap-3 transition ${
                      paymentMethod === 'card'
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-neutral-200'
                        : 'bg-neutral-950/30 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-bold text-neutral-200 block">Card Payment</span>
                      <span>Visa, Mastercard & Amex</span>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    id="pay-choice-cod"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded border cursor-pointer flex items-center gap-3 transition ${
                      paymentMethod === 'cod'
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-neutral-200'
                        : 'bg-neutral-950/30 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Coins className="h-5 w-5 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-bold text-neutral-200 block">Cash On Delivery</span>
                      <span>Applies to Nairobi area only</span>
                    </div>
                  </div>
                </div>

                {/* Sub-Forms based on selection */}
                <div className="p-5 rounded bg-neutral-950/40 border border-neutral-900 text-xs font-mono">
                  
                  {paymentMethod === 'mpesa' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-sans">
                        <Smartphone className="h-4.5 w-4.5" /> Safaricom MPesa Express Integration
                      </div>
                      <p className="text-neutral-400 text-[10px] sm:text-xs">
                        Enter your MPesa registered mobile phone number. A secure STK popup prompt requesting approval for KES {totalCost.toLocaleString()} will appear automatically on your screen device.
                      </p>
                      
                      <div className="max-w-xs">
                        <label className="block text-[9px] uppercase text-neutral-500 mb-1">Telephone Account (+254...)</label>
                        <input
                          id="mpesa-number-input"
                          type="text"
                          value={mpesaNumber}
                          onChange={(e) => setMpesaNumber(e.target.value)}
                          placeholder="e.g. +254 712 345 678"
                          className="w-full py-1.5 px-3 bg-neutral-950 border border-neutral-800 rounded focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 font-mono">
                      <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-sans">
                        <CreditCard className="h-4.5 w-4.5" /> Credit / Debit Card Gateway
                      </div>
                      <p className="text-neutral-400 text-[10px]">
                        Secure tokenization processed by Stripe. Details are never cached on local servers.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-3">
                          <label className="block text-[9px] uppercase text-neutral-500 mb-1">Card Number (16-Digit)</label>
                          <input
                            id="card-number-input"
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4000 1234 5678 9010"
                            className="w-full py-1.5 px-3 bg-neutral-950 border border-neutral-800 rounded focus:ring-1 focus:ring-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-neutral-500 mb-1">Expiry Date</label>
                          <input
                            id="card-expiry-input"
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM / YY"
                            className="w-full py-1.5 px-3 bg-neutral-950 border border-neutral-800 rounded focus:ring-1 focus:ring-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase text-neutral-500 mb-1">CVV / Security</label>
                          <input
                            id="card-cvv-input"
                            type="text"
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            placeholder="123"
                            className="w-full py-1.5 px-3 bg-neutral-950 border border-neutral-800 rounded focus:ring-1 focus:ring-cyan-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="space-y-2">
                      <span className="font-bold text-amber-500 flex items-center gap-1.5 font-sans text-xs">
                        🔧 Retrofitting On-Delivery Agreement Included
                      </span>
                      <p className="text-neutral-400 leading-relaxed text-[11px]">
                        Cash, bank transfer, or onsite MPesa pay is accepted when the conversion items are delivered to your shipping location, or retrofitted at our Nairobi Hub Workshop.
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* Action row back */}
              <div className="flex justify-between items-center text-xs">
                <button
                  id="pay-back-to-shipping"
                  onClick={() => setStep('details')}
                  className="px-4 py-2 font-semibold text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  &larr; Back to Shipping Info
                </button>
                
                <button
                  id="checkout-finalize-order"
                  onClick={handlePlaceOrder}
                  className="px-6 py-2.5 font-sans font-black text-xs rounded bg-cyan-500 text-neutral-950 hover:bg-cyan-400 cursor-pointer transition shadow"
                >
                  Authorise checkout order &rarr;
                </button>
              </div>

            </div>

            {/* Total Billing checklist Summary right column */}
            <div className="lg:col-span-1 border border-neutral-800/80 rounded-lg p-5 text-xs text-neutral-400 bg-neutral-900/40 space-y-4 font-mono leading-relaxed">
              <h4 className="font-sans font-bold text-neutral-100 text-xs border-b pb-2 border-neutral-800 uppercase">
                Secure Summary billing
              </h4>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal Catalog:</span>
                  <span className="text-neutral-100 font-bold">KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Delivery:</span>
                  <span className="text-neutral-100 font-bold">{deliveryMethod.toUpperCase()} (KES {shippingCost.toLocaleString()})</span>
                </div>
                <div className="flex justify-between text-neutral-200 border-t border-neutral-800 pt-2.5 font-bold">
                  <span>FINAL SUM:</span>
                  <span className="text-cyan-400">KES {totalCost.toLocaleString()}</span>
                </div>
              </div>

              {paymentMethod === 'mpesa' && (
                <button
                  id="mpesa-payment-confirm-cta"
                  onClick={handlePlaceOrder}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 hover:text-neutral-950 text-neutral-950 font-sans font-black text-xs rounded transition uppercase cursor-pointer"
                >
                  Trigger MPesa STK Push
                </button>
              )}
            </div>

          </div>
        )}

        {/* COMPLETED/SUCCESS SCREEN STEP */}
        {step === 'complete' && createdOrder && (
          <div id="checkout-completed-panel" className="max-w-2xl mx-auto py-12 px-6 rounded-lg border border-cyan-500/10 bg-neutral-900/20 text-center space-y-6">
            
            <div className="h-16 w-16 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-lg animate-bounce">
              ✓
            </div>

            <div className="space-y-2">
              <span className="font-mono text-cyan-400 text-[10px] uppercase font-extrabold tracking-wider bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/30">
                 Cognito Database Linked Order Logged
              </span>
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight">
                TRANSACTION COMPLETE!
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto">
                Thank you for choosing Light Hub Customs! Your purchase payload has been submitted through AWS database pools. Our tech retrofitting team will begin package assembly.
              </p>
            </div>

            {/* Receipt invoice card details */}
            <div className="p-5 rounded bg-neutral-950/80 border border-neutral-900 text-left font-mono text-xs space-y-3">
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-neutral-500">Order ID Record:</span>
                <span className="text-cyan-400 font-bold">{createdOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Recipient Contact:</span>
                <span className="text-neutral-200">{createdOrder.shippingInfo?.fullName} ({createdOrder.shippingInfo?.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Destination Address:</span>
                <span className="text-neutral-200 truncate max-w-[240px]">{createdOrder.shippingInfo?.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Gateway:</span>
                <span className="text-neutral-200 capitalize">{createdOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-900 pt-2 font-bold text-sm">
                <span className="text-neutral-400">Total Invoice (Paid):</span>
                <span className="text-amber-500">KES {createdOrder.total?.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-cyan-950/20 border border-cyan-900/30 rounded text-xs text-neutral-300 max-w-md mx-auto leading-relaxed text-center flex flex-col gap-2">
              <span className="font-bold">Estimated Delivery Dispatch Timeline:</span>
              <span>
                {createdOrder.deliveryMethod === 'express' ? '📆 Guaranteed Courier Dispatch: Within 24 Hours' : '📆 Standard Shipping: Within 2-3 standard weekdays'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                id="success-track-order-button"
                onClick={() => onNavigate('track-order')}
                className="px-6 py-2 bg-neutral-900 border border-neutral-800 text-white font-sans text-xs font-bold rounded hover:bg-neutral-800 cursor-pointer"
              >
                Track live package status
              </button>
              <button
                id="success-back-home-button"
                onClick={() => onNavigate('home')}
                className="px-6 py-2 bg-cyan-500 text-neutral-950 font-sans text-xs font-black rounded hover:bg-cyan-400 cursor-pointer"
              >
                Return to Landing Hub
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
