import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

const faqs = [
  {
    section: "Orders & Payment",
    items: [
      { q: "What payment methods do you accept?", a: "We accept M-Pesa, bank transfer, and cash on delivery within Nairobi." },
      { q: "Can I modify or cancel my order?", a: "Orders can be modified or cancelled within 2 hours of placement. Contact us immediately via WhatsApp." },
      { q: "Do you offer bulk/wholesale pricing?", a: "Yes. Contact us directly for orders of 10+ units for special pricing." },
    ]
  },
  {
    section: "Products",
    items: [
      { q: "Are your LED bulbs plug & play?", a: "Most of our bulbs are direct plug & play replacements. Product pages indicate if any modification is needed." },
      { q: "How do I know which bulb fits my car?", a: "Use our Fitment Guide or contact us with your car's make, model, and year." },
      { q: "Do your products come with a warranty?", a: "Yes — all products carry a 2-year warranty against manufacturing defects." },
    ]
  },
  {
    section: "Technical",
    items: [
      { q: "Will LED bulbs cause a 'bulb out' warning on my dashboard?", a: "Some vehicles require a CANbus decoder to prevent this. We stock compatible decoders — ask us when ordering." },
      { q: "Can I install the bulbs myself?", a: "Yes. Most installations take under 15 minutes with basic tools. We provide installation guides with every order." },
    ]
  },
]

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">Help Center</span>
            <h1 className="font-serif text-5xl text-foreground mb-4">FAQ</h1>
            <p className="text-muted-foreground">Answers to the most common questions.</p>
          </div>

          <div className="space-y-12">
            {faqs.map(section => (
              <div key={section.section}>
                <h2 className="font-serif text-xl text-primary mb-6">{section.section}</h2>
                <div className="space-y-4">
                  {section.items.map(item => (
                    <div key={item.q} className="bg-card border border-border rounded-2xl p-6">
                      <p className="font-semibold text-foreground mb-2">{item.q}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  ))}
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
