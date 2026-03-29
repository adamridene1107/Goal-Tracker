import { useState } from "react"
import { Lock, Eye, EyeOff, Users, Gift, BarChart2, CreditCard, ExternalLink, Copy, Check } from "lucide-react"
import { supabase } from "../lib/supabase"

const ADMIN_PASSWORD = "admin2024"

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [auth, setAuth] = useState(false)
  const [error, setError] = useState(false)
  const [tab, setTab] = useState("pages")

  // Mois gratuits
  const [giftEmail, setGiftEmail] = useState("")
  const [giftMonths, setGiftMonths] = useState(1)
  const [giftLoading, setGiftLoading] = useState(false)
  const [giftMsg, setGiftMsg] = useState("")

  // Stats
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  // Copy
  const [copied, setCopied] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) { setAuth(true); setError(false) }
    else setError(true)
  }

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(""), 2000)
  }

  const loadStats = async () => {
    setStatsLoading(true)
    try {
      const { count: users } = await supabase.from("profiles").select("*", { count:"exact", head:true })
      const { count: active } = await supabase.from("goal_data").select("*", { count:"exact", head:true }).not("goal", "is", null)
      const { data: recent } = await supabase.from("profiles").select("name, email, created_at").order("created_at", { ascending:false }).limit(5)
      setStats({ users, active, recent })
    } catch(e) { console.error(e) }
    setStatsLoading(false)
  }

  const grantFreeMonths = async () => {
    if (!giftEmail.trim()) return setGiftMsg("Entre un email")
    setGiftLoading(true)
    setGiftMsg("")
    try {
      const res = await fetch("/api/grant-free-months", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: giftEmail.trim(), months: giftMonths })
      })
      const data = await res.json()
      if (!res.ok) { setGiftMsg("Erreur: " + (data.error || "Inconnue")); setGiftLoading(false); return }
      const expiry = new Date()
      expiry.setMonth(expiry.getMonth() + parseInt(giftMonths))
      setGiftMsg(`✅ ${giftMonths} mois gratuit${giftMonths > 1 ? "s" : ""} accordé${giftMonths > 1 ? "s" : ""} à ${giftEmail} jusqu'au ${expiry.toLocaleDateString("fr-FR")} (Stripe + Supabase mis à jour)`)
    } catch(e) { setGiftMsg("Erreur réseau: " + e.message) }
    setGiftLoading(false)
  }

  if (!auth) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
      <div className="w-full max-w-xs fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-white/50" />
          </div>
          <h1 className="text-xl font-black text-white">Admin</h1>
          <p className="text-white/30 text-xs mt-1">Accès restreint</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="relative">
            <input type={show ? "text" : "password"} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Mot de passe"
              className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-white/20 pr-10" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
              {show ? <EyeOff size={14}/> : <Eye size={14}/>}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs text-center">Mot de passe incorrect</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm">Entrer</button>
        </form>
      </div>
    </div>
  )

  const TABS = [
    { id:"pages", label:"Pages", icon:ExternalLink },
    { id:"gift", label:"Mois gratuits", icon:Gift },
    { id:"stats", label:"Stats", icon:BarChart2 },
    { id:"stripe", label:"Stripe", icon:CreditCard },
  ]

  return (
    <div className="min-h-screen bg-[#080808] p-6">
      <div className="max-w-lg mx-auto fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-white">Panel Admin</h1>
            <p className="text-white/30 text-xs mt-0.5">Trakova — accès restreint</p>
          </div>
          <a href="/" className="text-white/30 text-xs hover:text-white/60">← App</a>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/[0.04] rounded-xl p-1">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => { setTab(t.id); if(t.id==="stats") loadStats() }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all"
                style={{ background: tab===t.id ? "rgba(139,92,246,0.2)" : "transparent", color: tab===t.id ? "#a78bfa" : "rgba(255,255,255,0.4)" }}>
                <Icon size={12}/> {t.label}
              </button>
            )
          })}
        </div>

        {/* Pages */}
        {tab === "pages" && (
          <div className="space-y-2">
            {[
              { label:"App principale", path:"/", desc:"L'application" },
              { label:"Abonnement", path:"/subscribe", desc:"Page d'essai 7 jours" },
              { label:"Succès paiement", path:"/success", desc:"Après paiement" },
              { label:"Essai expiré", path:"/trial-expired", desc:"7 jours écoulés" },
              { label:"Contact", path:"/contact", desc:"Page support" },
              { label:"CGU", path:"/cgu", desc:"Conditions d'utilisation" },
              { label:"Confidentialité", path:"/privacy", desc:"Politique de confidentialité" },
            ].map(p => (
              <a key={p.path} href={p.path} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] hover:border-white/20 transition-all group" style={{ background:"rgba(255,255,255,0.02)" }}>
                <div>
                  <p className="text-white/80 text-sm font-medium">{p.label}</p>
                  <p className="text-white/30 text-xs">{p.desc}</p>
                </div>
                <span className="text-white/20 text-xs font-mono group-hover:text-white/40">{p.path}</span>
              </a>
            ))}
          </div>
        )}

        {/* Mois gratuits */}
        {tab === "gift" && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-white/70 text-sm font-semibold mb-4">Accorder des mois gratuits</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Email de l'utilisateur</label>
                  <input value={giftEmail} onChange={e => setGiftEmail(e.target.value)}
                    placeholder="user@example.com" className="input w-full" />
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Nombre de mois gratuits</label>
                  <div className="flex gap-2">
                    {[1,2,3,6,12].map(m => (
                      <button key={m} onClick={() => setGiftMonths(m)}
                        className="flex-1 py-2 rounded-xl text-sm transition-all"
                        style={{ background: giftMonths===m ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)", border: giftMonths===m ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.06)", color: giftMonths===m ? "#a78bfa" : "rgba(255,255,255,0.5)" }}>
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={grantFreeMonths} disabled={giftLoading}
                  className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                  {giftLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Gift size={14}/> Accorder {giftMonths} mois gratuit{giftMonths>1?"s":""}</>}
                </button>
                {giftMsg && <p className={`text-xs px-3 py-2 rounded-xl ${giftMsg.startsWith("✅") ? "text-emerald-400" : "text-red-400"}`} style={{ background: giftMsg.startsWith("✅") ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)" }}>{giftMsg}</p>}
              </div>
            </div>
            <div className="card">
              <p className="text-white/40 text-xs">ℹ️ Les mois gratuits sont enregistrés dans les paramètres de l'utilisateur. L'app vérifie <code className="text-violet-400">freeUntil</code> pour autoriser l'accès sans abonnement actif.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        {tab === "stats" && (
          <div className="space-y-3">
            {statsLoading ? (
              <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"/></div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="card text-center py-4">
                    <p className="text-white font-bold text-2xl">{stats.users || 0}</p>
                    <p className="text-white/40 text-xs mt-1">Utilisateurs total</p>
                  </div>
                  <div className="card text-center py-4">
                    <p className="text-white font-bold text-2xl">{stats.active || 0}</p>
                    <p className="text-white/40 text-xs mt-1">Avec un objectif</p>
                  </div>
                </div>
                <div className="card">
                  <p className="text-white/50 text-xs font-medium mb-3">Derniers inscrits</p>
                  <div className="space-y-2">
                    {(stats.recent || []).map((u, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-white/70 text-sm">{u.name || "—"}</p>
                          <p className="text-white/30 text-xs">{u.email}</p>
                        </div>
                        <p className="text-white/20 text-xs">{new Date(u.created_at).toLocaleDateString("fr-FR")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <button onClick={loadStats} className="btn-primary w-full py-3 text-sm">Charger les stats</button>
            )}
          </div>
        )}

        {/* Stripe */}
        {tab === "stripe" && (
          <div className="space-y-3">
            <div className="card">
              <p className="text-white/50 text-xs font-medium mb-3">Carte test principale</p>
              {[
                { label:"Numéro", value:"4242 4242 4242 4242" },
                { label:"Expiration", value:"12/26" },
                { label:"CVC", value:"123" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5">
                  <span className="text-white/30 text-xs">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-xs font-mono">{item.value}</span>
                    <button onClick={() => copyText(item.value, item.label)} className="text-white/20 hover:text-violet-400 transition-colors">
                      {copied===item.label ? <Check size={12} className="text-emerald-400"/> : <Copy size={12}/>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <p className="text-white/50 text-xs font-medium mb-3">Cartes spéciales</p>
              {[
                { label:"Refusé", value:"4000 0000 0000 0002" },
                { label:"Fonds insuffisants", value:"4000 0000 0000 9995" },
                { label:"3D Secure", value:"4000 0025 0000 3155" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5">
                  <span className="text-white/30 text-xs">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-xs font-mono">{item.value}</span>
                    <button onClick={() => copyText(item.value, item.label)} className="text-white/20 hover:text-violet-400 transition-colors">
                      {copied===item.label ? <Check size={12} className="text-emerald-400"/> : <Copy size={12}/>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] hover:border-white/20 transition-all" style={{ background:"rgba(255,255,255,0.02)" }}>
              <span className="text-white/60 text-sm">Dashboard Stripe</span>
              <ExternalLink size={14} className="text-white/30"/>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}