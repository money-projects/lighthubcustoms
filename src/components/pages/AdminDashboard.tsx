import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderService } from '../../services/api';
import { Order } from '../../types';
import { ALL_PRODUCTS } from '../../data/products';
import { ShieldCheck, Activity, Package, DollarSign, Clock, ShieldAlert, CheckCircle, RefreshCw, Trash2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { theme } = useApp();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [stats, setStats] = useState({
    sales: 0,
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getAllOrders();
      setAllOrders(res.orders);
      calculateStats(res.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateStats = (list: Order[]) => {
    let sales = 0;
    let pending = 0;
    let processing = 0;
    let shipped = 0;
    let delivered = 0;

    list.forEach(o => {
      sales += o.total;
      if (o.status === 'pending') pending++;
      else if (o.status === 'processing') processing++;
      else if (o.status === 'shipped') shipped++;
      else if (o.status === 'delivered') delivered++;
    });

    setStats({
      sales,
      total: list.length,
      pending,
      processing,
      shipped,
      delivered
    });
  };

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await OrderService.updateOrder(orderId, status);
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Fail to sync status update with remote database.');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete order ${orderId}?`)) {
      return;
    }
    try {
      await OrderService.deleteOrder(orderId);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter list by Order ID or email
  const filteredOrders = allOrders.filter(o => 
    o.orderId.toLowerCase().includes(searchVal.toLowerCase()) ||
    o.userId.toLowerCase().includes(searchVal.toLowerCase()) ||
    o.shippingInfo?.fullName.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div id="admin-dashboard-view-wrapper" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner with secure indicators */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-red-500 font-bold bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30">
              🔒 ADMIN CONTROL DESK
            </span>
            <h1 className="font-sans font-black text-2xl sm:text-3xl text-neutral-100 uppercase tracking-tight mt-1">
              LIGHT HUB ORDERS CONTROL
            </h1>
          </div>

          <button
            id="admin-refresh-data-btn"
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-cyan-400 text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Sync Database Pools
          </button>
        </div>

        {/* 1. AGGREGATES STAT CARDS */}
        <div id="admin-aggregates-row" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-neutral-200">
          
          {/* Sales Volume */}
          <div className="p-5 rounded-lg border border-neutral-850 bg-neutral-900/40 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 font-mono block">TOTAL SALES INCOME</span>
              <span className="font-sans font-black text-lg text-emerald-400 leading-none">
                KES {stats.sales.toLocaleString()}
              </span>
            </div>
            <div className="h-10 w-10 bg-emerald-950 rounded flex items-center justify-center border border-emerald-900/30">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
          </div>

          {/* Active orders */}
          <div className="p-5 rounded-lg border border-neutral-850 bg-neutral-900/40 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 font-mono block">COMPLETED CHECKOUTS</span>
              <span className="font-sans font-black text-lg text-neutral-100 leading-none">
                {stats.total} Order(s)
              </span>
            </div>
            <div className="h-10 w-10 bg-cyan-950 rounded flex items-center justify-center border border-cyan-900/30">
              <Package className="h-5 w-5 text-cyan-400" />
            </div>
          </div>

          {/* Pending assembly */}
          <div className="p-5 rounded-lg border border-neutral-850 bg-neutral-900/40 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 font-mono block">PENDING / PROCESSING</span>
              <span className="font-sans font-black text-lg text-amber-500 leading-none">
                {stats.pending + stats.processing} Packages
              </span>
            </div>
            <div className="h-10 w-10 bg-amber-950 rounded flex items-center justify-center border border-amber-900/30">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
          </div>

          {/* Diagnostic Latency */}
          <div className="p-5 rounded-lg border border-neutral-850 bg-neutral-900/40 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 font-mono block">DATABASE CLUSTERS PIN</span>
              <span className="font-mono text-xs text-cyan-400 font-black">
                LH-Products: ACTIVE <br /> Render API: 112ms
              </span>
            </div>
            <div className="h-10 w-10 bg-red-950 rounded flex items-center justify-center border border-red-900/30">
              <Activity className="h-5 w-5 text-red-400 animate-pulse" />
            </div>
          </div>

        </div>

        {/* 2. ORDER LIST TABLE */}
        <div className={`p-6 rounded-lg border ${
          theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900/40 border-neutral-850'
        }`}>
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-4">
            <h3 className="font-sans font-black text-sm text-neutral-100 uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-red-500" /> Active Retrofitting Dispatch Board
            </h3>
            
            {/* Search filter input */}
            <input
              id="admin-search-orders-filter"
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Filter by Recipient Email, OrderID, fullname..."
              className="py-1.5 px-3 bg-neutral-950 border border-neutral-800 text-neutral-200 rounded text-xs font-mono w-full sm:max-w-xs focus:outline-none"
            />
          </div>

          {loading ? (
            <div className="py-20 text-center font-mono text-xs text-neutral-500 animate-pulse">
              Retrieving LH-Orders from Render servers...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No orders matched your search values.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-850 text-neutral-500 text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-2">Order ID / Date</th>
                    <th className="py-3 px-2">Recipient Customer</th>
                    <th className="py-3 px-2">Items inside Package</th>
                    <th className="py-3 px-2">Invoice Amount</th>
                    <th className="py-3 px-2">Ｆｕｌｆｉｌｌｍｅｎｔ  Ｓｔａｔｕｓ</th>
                    <th className="py-3 px-2 text-right">Delete Record</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/50 text-neutral-300">
                  {filteredOrders.map(order => (
                    <tr key={order.orderId} className="hover:bg-neutral-950/20 transition">
                      
                      {/* ID and Date */}
                      <td className="py-3.5 px-2">
                        <span className="font-bold text-cyan-400 block">{order.orderId}</span>
                        <span className="text-[10px] text-neutral-500 block mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Recipient info */}
                      <td className="py-3.5 px-2">
                        <span className="font-sans font-bold text-neutral-200 block truncate max-w-[140px]">
                          {order.shippingInfo?.fullName}
                        </span>
                        <span className="text-[10px] text-neutral-500 block block truncate max-w-[140px]">
                          {order.userId}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-2 max-w-[180px] truncate hover:text-white cursor-help" title={order.items?.map(it => `${it.name} (x${it.quantity})`).join(', ')}>
                        {order.items?.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-2 font-black text-amber-500">
                        KES {order.total?.toLocaleString()}
                      </td>

                      {/* Select state controller */}
                      <td className="py-3.5 px-2">
                        <select
                          id={`admin-status-select-${order.orderId}`}
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.orderId, e.target.value as Order['status'])}
                          className={`py-1 px-2.5 rounded bg-neutral-950 text-[10px] font-bold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500 ${
                            order.status === 'delivered' ? 'border-emerald-900 text-emerald-400 bg-emerald-950/20' :
                            order.status === 'shipped' ? 'border-cyan-900 text-cyan-400 bg-cyan-950/20' :
                            order.status === 'cancelled' ? 'border-rose-900 text-rose-400 bg-rose-950/20' : 'border-neutral-800 text-neutral-300'
                          }`}
                        >
                          <option value="pending">Pending Approval</option>
                          <option value="processing">Processing & Assembly</option>
                          <option value="shipped">Shipped/Dispatched</option>
                          <option value="delivered">Delivered Package</option>
                          <option value="cancelled">Cancelled Transaction</option>
                        </select>
                      </td>

                      {/* Delete button */}
                      <td className="py-3.5 px-2 text-right">
                        <button
                          id={`admin-delete-btn-${order.orderId}`}
                          onClick={() => handleDeleteOrder(order.orderId)}
                          className="p-1.5 rounded hover:bg-rose-950/35 text-neutral-600 hover:text-rose-400 transition"
                          title="Delete checkout reference"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
