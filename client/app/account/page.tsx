"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  User, ShoppingBag, LogOut, Edit2, Check, X,
  MapPin, Heart, Clock, Bell, ChevronRight,
  Package, Truck, CheckCircle2, XCircle, AlertCircle,
  Plus, Trash2, Star
} from "lucide-react"
import { useAuth, API_URL } from "@/components/boty/auth-context"
import { Header } from "@/components/boty/header"

type Order = {
  order_id: string
  status: string
  total_amount: number
  created_at: string
  items: { name: string; quantity: number; price: number; image_url?: string }[]
}

type Address = {
  address_id: string
  label: string
  street: string
  city: string
  county: string
  is_default: boolean
}

type WishlistItem = {
  product_id: string
  name: string
  price: number
  image_url: string
}

type Notification = {
  notification_id: string
  title: string
  message: string
  read: boolean
  created_at: string
}

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  pending:    { color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",   icon: AlertCircle },
  processing: { color: "text-blue-400 bg-blue-400/10 border-blue-400/20",         icon: Package },
  shipped:    { color: "text-primary bg-primary/10 border-primary/20",            icon: Truck },
  delivered:  { color: "text-green-400 bg-green-400/10 border-green-400/20",      icon: CheckCircle2 },
  cancelled:  { color: "text-destructive bg-destructive/10 border-destructive/20", icon: XCircle },
}

type Tab = "overview" | "orders" | "addresses" | "wishlist" | "notifications" | "profile"

export default function AccountPage() {
  const { user, token, logout, loading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("overview")
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<WishlistItem[]>([])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "" })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")

  useEffect(() => { if (!loading && !user) router.push("/login") }, [user, loading])
  useEffect(() => { if (user) setForm({ name: user.name, phone: user.phone || "" }) }, [user])

  // Load recently viewed from localStorage
  useEffect(() => {
    try {
      const rv = JSON.parse(localStorage.getItem("rm_recently_viewed") || "[]")
      setRecentlyViewed(rv)
    } catch {}
  }, [])

  useEffect(() => {
    if (!token) return
    const headers = { Authorization: `Bearer ${token}` }
    fetch(`${API_URL}/api/orders`, { headers }).then(r => r.ok ? r.json() : { data: [] }).then(d => setOrders(d.data || []))
    fetch(`${API_URL}/api/addresses`, { headers }).then(r => r.ok ? r.json() : { data: [] }).then(d => setAddresses(d.data || []))
    fetch(`${API_URL}/api/wishlist`, { headers }).then(r => r.ok ? r.json() : { data: [] }).then(d => setWishlist(d.data || []))
    fetch(`${API_URL}/api/notifications`, { headers }).then(r => r.ok ? r.json() : { data: [] }).then(d => setNotifications(d.data || []))
  }, [token])

  const saveProfile = async () => {
    setSaving(true)
    try {
      await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      setSaveMsg("Saved!")
      setEditing(false)
      setTimeout(() => setSaveMsg(""), 3000)
    } finally { setSaving(false) }
  }

  const removeWishlist = async (product_id: string) => {
    await fetch(`${API_URL}/api/wishlist/${product_id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    setWishlist(w => w.filter(i => i.product_id !== product_id))
  }

  const markNotificationRead = async (id: string) => {
    await fetch(`${API_URL}/api/notifications/${id}/read`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } })
    setNotifications(n => n.map(i => i.notification_id === id ? { ...i, read: true } : i))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading || !user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "overview",      label: "Overview",      icon: User },
    { id: "orders",        label: "Orders",        icon: ShoppingBag, badge: orders.length },
    { id: "addresses",     label: "Addresses",     icon: MapPin },
    { id: "wishlist",      label: "Wishlist",      icon: Heart, badge: wishlist.length },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount || undefined },
    { id: "profile",       label: "Profile",       icon: Edit2 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Welcome back, {user.name.split(" ")[0]}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
            </div>
            <button onClick={() => { logout(); router.push("/") }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-56 shrink-0">
              <nav className="bg-card border border-border rounded-2xl p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap w-full text-left ${tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-background"}`}>
                    <t.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{t.label}</span>
                    {t.badge ? <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab === t.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"}`}>{t.badge}</span> : null}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">

              {/* OVERVIEW */}
              {tab === "overview" && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Total Orders", value: orders.length, icon: ShoppingBag },
                      { label: "Wishlist", value: wishlist.length, icon: Heart },
                      { label: "Addresses", value: addresses.length, icon: MapPin },
                      { label: "Unread", value: unreadCount, icon: Bell },
                    ].map(s => (
                      <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
                        <s.icon className="w-5 h-5 text-primary mb-3" strokeWidth={1.5} />
                        <p className="text-2xl font-bold text-foreground">{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-foreground">Recent Orders</h2>
                      <button onClick={() => setTab("orders")} className="text-xs text-primary hover:underline flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></button>
                    </div>
                    {orders.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">No orders yet</p>
                    ) : (
                      <div className="space-y-3">
                        {orders.slice(0, 3).map(o => {
                          const cfg = STATUS_CONFIG[o.status] || { color: "text-muted-foreground bg-muted border-border", icon: Package }
                          const Icon = cfg.icon
                          return (
                            <div key={o.order_id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${cfg.color}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">#{o.order_id.slice(-8).toUpperCase()}</p>
                                  <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-primary">KES {o.total_amount.toLocaleString()}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${cfg.color}`}>{o.status}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Recently Viewed */}
                  {recentlyViewed.length > 0 && (
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-primary" />
                        <h2 className="font-semibold text-foreground">Recently Viewed</h2>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {recentlyViewed.slice(0, 4).map(p => (
                          <Link key={p.product_id} href={`/product/${p.product_id}`} className="group">
                            <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-2 relative">
                              <Image src={p.image_url || "/placeholder.svg"} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <p className="text-xs font-medium text-foreground line-clamp-1">{p.name}</p>
                            <p className="text-xs text-primary">KES {p.price.toLocaleString()}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ORDERS */}
              {tab === "orders" && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-16 text-center">
                      <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
                      <p className="font-medium text-foreground mb-2">No orders yet</p>
                      <p className="text-sm text-muted-foreground mb-6">Your order history will appear here</p>
                      <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">Browse Products</Link>
                    </div>
                  ) : orders.map(order => {
                    const cfg = STATUS_CONFIG[order.status] || { color: "text-muted-foreground bg-muted border-border", icon: Package }
                    const Icon = cfg.icon
                    return (
                      <div key={order.order_id} className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-semibold text-foreground">Order #{order.order_id.slice(-8).toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</p>
                          </div>
                          <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium capitalize ${cfg.color}`}>
                            <Icon className="w-3.5 h-3.5" />{order.status}
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          {(order.items || []).map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                              <div className="flex items-center gap-3">
                                {item.image_url && (
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted relative shrink-0">
                                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                  </div>
                                )}
                                <span className="text-foreground">{item.name} <span className="text-muted-foreground">×{item.quantity}</span></span>
                              </div>
                              <span className="text-foreground font-medium">KES {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-muted-foreground">{(order.items || []).reduce((s, i) => s + i.quantity, 0)} item(s)</span>
                          <span className="font-bold text-primary text-lg">KES {order.total_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* ADDRESSES */}
              {tab === "addresses" && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Link href="/account/addresses/new" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
                      <Plus className="w-4 h-4" /> Add Address
                    </Link>
                  </div>
                  {addresses.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-16 text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
                      <p className="font-medium text-foreground mb-2">No addresses saved</p>
                      <p className="text-sm text-muted-foreground">Add a delivery address for faster checkout</p>
                    </div>
                  ) : addresses.map(addr => (
                    <div key={addr.address_id} className="bg-card border border-border rounded-2xl p-6 flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-foreground capitalize">{addr.label}</p>
                            {addr.is_default && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Default</span>}
                          </div>
                          <p className="text-sm text-muted-foreground">{addr.street}</p>
                          <p className="text-sm text-muted-foreground">{addr.city}, {addr.county}</p>
                        </div>
                      </div>
                      <button className="text-muted-foreground hover:text-destructive transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* WISHLIST */}
              {tab === "wishlist" && (
                <div>
                  {wishlist.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-16 text-center">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
                      <p className="font-medium text-foreground mb-2">Your wishlist is empty</p>
                      <p className="text-sm text-muted-foreground mb-6">Save products you love for later</p>
                      <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.map(item => (
                        <div key={item.product_id} className="bg-card border border-border rounded-2xl overflow-hidden group">
                          <Link href={`/product/${item.product_id}`}>
                            <div className="aspect-square relative bg-muted overflow-hidden">
                              <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                            </div>
                          </Link>
                          <div className="p-4 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground text-sm line-clamp-1">{item.name}</p>
                              <p className="text-primary font-semibold text-sm mt-0.5">KES {item.price.toLocaleString()}</p>
                            </div>
                            <button onClick={() => removeWishlist(item.product_id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* NOTIFICATIONS */}
              {tab === "notifications" && (
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-16 text-center">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
                      <p className="font-medium text-foreground">No notifications</p>
                    </div>
                  ) : notifications.map(n => (
                    <div key={n.notification_id} onClick={() => !n.read && markNotificationRead(n.notification_id)}
                      className={`bg-card border rounded-2xl p-5 transition-all cursor-pointer ${n.read ? "border-border opacity-60" : "border-primary/30 bg-primary/5"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className={`font-medium text-sm ${n.read ? "text-muted-foreground" : "text-foreground"}`}>{n.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{new Date(n.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PROFILE */}
              {tab === "profile" && (
                <div className="bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-foreground text-lg">Personal Information</h2>
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button onClick={saveProfile} disabled={saving} className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300">
                          <Check className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
                        </button>
                        <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {saveMsg && <p className="text-sm text-green-400 bg-green-400/10 rounded-xl px-4 py-3 mb-5">{saveMsg}</p>}

                  <div className="grid sm:grid-cols-2 gap-6">
                    {[{ label: "Full Name", key: "name", value: form.name }, { label: "Phone", key: "phone", value: form.phone }].map(f => (
                      <div key={f.key}>
                        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">{f.label}</label>
                        {editing ? (
                          <input value={f.value} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" />
                        ) : (
                          <p className="text-foreground font-medium">{f.value || "—"}</p>
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Email</label>
                      <p className="text-foreground font-medium">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Account Type</label>
                      <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium capitalize">{user.role}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-4">Security</h3>
                    <Link href="/forgot-password" className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-colors group">
                      <span className="text-sm text-foreground">Change Password</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
