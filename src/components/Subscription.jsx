import { useState } from "react"
import { Zap, Check, Gift, ArrowLeft, Shield } from "lucide-react"

const FEATURES = [
  "4 modes : Études, Sport, Créatif, Organisation",
  "Système XP, niveaux et streaks",
  "Devoirs, missions, fichiers illimités",
  "Pomodoro et planning journalier",
  "Statistiques et calendrier de progression",
  "Toutes les futures fonctionnalités",
]

export default function Subscription() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubscribe = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/create-checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) { window.location.href = data.url }
      else { setError("Erreur lors de la création de la session.") }
    } catch (e) {
      setError("Erreur réseau. Réessaie.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "#0A0A0F" }}>
      <div className="glow-orb glow-orb-violet w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />
      <div className="w-full max-w-sm relative fade-up">
        <a href="/" className="inline-flex items-center gap-1.5 text-white/30 text-xs mb-8 hover:text-white/60 transition-colors">
          <ArrowLeft size={12} /> Retour
        </a>
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa" }}>
            <Gift size={12} /> 7 jours gratuits — aucun débit immédiat
          </span>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Accès complet</h1>
          <div className="flex items-end justify-center gap-2">
            <span className="text-white/30 text-lg line-through mr-2">10€</span>
            <span className="text-5xl font-bold gradient-text">6€</span>
            <span className="text-white/40 text-sm mb-2">/mois</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background:"rgba(16,185,129,0.15)", color:"#34d399", border:"1px solid rgba(16,185,129,0.3)" }}>-40%</span>
            <p className="text-white/30 text-xs">Offre de lancement · Annulable à tout moment</p>
          </div>
        </div>
        <div className="card-glass mb-4">
          <ul className="space-y-3 mb-6">
            {FEATURES.map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>
                  <Check size={11} className="text-violet-400" />
                </div>
                <span className="text-white/70 text-sm">{f}</span>
              </li>
            ))}
          </ul>
          <button onClick={handleSubscribe} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-sm">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Zap size={15} /> Commencer l'essai gratuit</>}
          </button>
          {error && <p className="text-red-400 text-xs text-center mt-3">{error}</p>}
        </div>
        <div className="flex items-center justify-center gap-1.5 text-white/25 text-xs">
          <Shield size={11} /> Paiement sécurisé par Stripe
        </div>
      </div>
    </div>
  )
}