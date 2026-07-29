"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, ShoppingBag, LogOut, Edit2, Check, X } from "lucide-react"
import { useAuth, API_URL } from "@/components/boty/auth-context"

type Order = {
  order_id: string
  status: string
  total_amount: number
  created_at: string
  items: { name: string; quantity: number; price: number }[]
}

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10",
  processing: "text-blue-400 bg-blue-400/10",
  shipped: "text-primary bg-primary/10",
  delivered: "text-green-400 bg-green-400/10",
  cancelled: "text-destructive bg-destructive/10",
}

export default function AccountPage() {
  const { user, token, logout, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<"profile" | "orders">("profile")
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "" })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading])

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone || "" })
  }, [user])

  useEffect(() => {
    if (token && tab === "orders") {
      fetch(`${API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : { data: [] })
        .then(d => setOrders(d.data || []))
    }
  }, [token, tab])

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
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">My Account</h1>
            <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
          </div>
          <button onClick={() => { logout(); router.push("/") }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-8 w-fit">
          {(["profile", "orders"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "profile" ? <span className="flex items-center gap-2"><User className="w-4 h-4" />Profile</span>
                : <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" />Orders</span>}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <div className="bg-card border border-border rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={saveProfile} disabled={saving}
                    className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300">
                    <Check className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
            </div>

            {saveMsg && <p className="text-sm text-green-400 bg-green-400/10 rounded-xl px-4 py-3 mb-4">{saveMsg}</p>}

            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { label: "Full Name", key: "name", value: form.name },
                { label: "Phone", key: "phone", value: form.phone },
              ].map(f => (
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
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Role</label>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-card border border-border rounded-3xl p-12 text-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
                <p className="text-foreground font-medium mb-2">No orders yet</p>
                <p className="text-muted-foreground text-sm mb-6">Start shopping to see your orders here</p>
                <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
                  Browse Products
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.order_id} className="bg-card border border-border rounded-3xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Order #{order.order_id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[order.status] || "text-muted-foreground bg-muted"}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {(order.items || []).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-foreground">{item.name} <span className="text-muted-foreground">×{item.quantity}</span></span>
                        <span className="text-foreground">KES {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-semibold text-primary">KES {order.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
