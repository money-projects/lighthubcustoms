import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { Truck, Clock, MapPin, Package } from "lucide-react"

const zones = [
  { zone: "Nairobi CBD & Westlands", time: "Same day (order before 12pm)", cost: "KES 200" },
  { zone: "Nairobi Suburbs", time: "Same day / Next day", cost: "KES 300" },
  { zone: "Kiambu, Machakos, Kajiado", time: "1–2 business days", cost: "KES 400" },
  { zone: "Other Counties", time: "2–4 business days", cost: "KES 500–700" },
]

export default function DeliveryPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">Shipping</span>
            <h1 className="font-serif text-5xl text-foreground mb-4">Delivery Info</h1>
            <p className="text-muted-foreground">Fast, reliable delivery across Kenya.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Clock, title: "Order Cutoff", desc: "Order before 12pm for same-day dispatch in Nairobi." },
              { icon: Truck, title: "Nationwide Delivery", desc: "We deliver to all 47 counties via trusted courier partners." },
              { icon: Package, title: "Secure Packaging", desc: "All orders are carefully packed to prevent damage in transit." },
              { icon: MapPin, title: "Order Tracking", desc: "You'll receive tracking updates via SMS and email after dispatch." },
            ].map(c => (
              <div key={c.title} className="bg-card border border-border rounded-2xl p-6 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-serif text-xl text-foreground">Delivery Zones & Rates</h2>
            </div>
            <div className="divide-y divide-border">
              {zones.map(z => (
                <div key={z.zone} className="grid grid-cols-3 px-6 py-4 text-sm">
                  <span className="text-foreground font-medium">{z.zone}</span>
                  <span className="text-muted-foreground">{z.time}</span>
                  <span className="text-primary font-semibold text-right">{z.cost}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">Free delivery on orders over KES 5,000 within Nairobi.</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
