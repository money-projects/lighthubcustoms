import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { CheckCircle2, XCircle } from "lucide-react"

const eligible = [
  "Item is unused and in original packaging",
  "Return requested within 7 days of delivery",
  "Item is not damaged due to incorrect installation",
  "Proof of purchase (order number) is provided",
]

const notEligible = [
  "Items damaged due to improper installation",
  "Returns requested after 7 days",
  "Items without original packaging",
  "Custom or special-order items",
]

export default function ReturnsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">Policy</span>
            <h1 className="font-serif text-5xl text-foreground mb-4">Returns</h1>
            <p className="text-muted-foreground">We want you to be 100% satisfied with your purchase.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-400" /> Eligible for Return</h2>
              <ul className="space-y-3">
                {eligible.map(i => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />{i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-destructive" /> Not Eligible</h2>
              <ul className="space-y-3">
                {notEligible.map(i => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            <h2 className="font-serif text-xl text-foreground">How to Return</h2>
            {[
              { step: "1", title: "Contact Us", desc: "WhatsApp or email us with your order number and reason for return." },
              { step: "2", title: "Get Approval", desc: "We'll review and confirm your return within 24 hours." },
              { step: "3", title: "Ship the Item", desc: "Drop off the item at our Nairobi location or arrange a pickup." },
              { step: "4", title: "Refund / Exchange", desc: "Refund processed within 3–5 business days, or we'll send a replacement." },
            ].map(s => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">{s.step}</div>
                <div>
                  <p className="font-semibold text-foreground">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
