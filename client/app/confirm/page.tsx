"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { API_URL } from "@/components/boty/auth-context"

function ConfirmForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState(params.get("email") || "")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Confirmation failed")
      }
      router.push("/login?confirmed=1")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    await fetch(`${API_URL}/api/auth/resend-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setResent(true)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="font-serif text-2xl font-bold text-foreground">⚡ RADIANT<span className="text-primary">MOTORS</span></h1>
          </Link>
          <p className="text-muted-foreground mt-2 text-sm">Check your email for the verification code</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Verification Code</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="123456" required maxLength={6}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors tracking-widest text-center text-lg" />
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">{error}</p>}
            {resent && <p className="text-sm text-primary bg-primary/10 rounded-xl px-4 py-3">Code resent! Check your email.</p>}

            <button type="submit" disabled={loading}
              className="group w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60">
              {loading ? "Verifying..." : "Verify Account"}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <button onClick={resend} className="mt-4 w-full text-sm text-muted-foreground hover:text-primary transition-colors text-center">
            Didn't receive a code? Resend
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return <Suspense><ConfirmForm /></Suspense>
}
