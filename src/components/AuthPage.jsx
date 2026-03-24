import { useState } from "react"
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft, Zap } from "lucide-react"

function getUsers() { try { return JSON.parse(localStorage.getItem("gt_users") || "{}") } catch { return {} } }
function saveUsers(u) { localStorage.setItem("gt_users", JSON.stringify(u)) }

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const users = getUsers()
    if (mode === "signup") {
      if (!name.trim()) { setLoading(false); return setError("Entre ton prénom") }
      if (!email.trim()) { setLoading(false); return setError("Entre ton email") }
      if (password.length < 6) { setLoading(false); return setError("Mot de passe trop court (6 min)") }
      if (users[email]) { setLoading(false); return setError("Ce compte existe déjà") }
      users[email] = { name: name.trim(), password }
      saveUsers(users)
      localStorage.setItem("gt_session", JSON.stringify({ email, name: name.trim() }))
      onAuth({ email, name: name.trim() })
    } else {
      if (!users[email]) { setLoading(false); return setError("Compte introuvable") }
      if (users[email].password !== password) { setLoading(false); return setError("Mot de passe incorrect") }
      const n = users[email].name
      localStorage.setItem("gt_session", JSON.stringify({ email, name: n }))
      onAuth({ email, name: n })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "#0A0A0F" }}>
      <div className="glow-orb glow-orb-violet w-96 h-96 -top-20 -left-20 opacity-25" />
      <div className="glow-orb glow-orb-indigo w-64 h-64 bottom-10 right-10 opacity-15" />
      <div className="w-full max-w-sm relative fade-up">
        <a href="/" className="inline-flex items-center gap-1.5 text-white/30 text-xs mb-8 hover:text-white/60 transition-colors">
          <ArrowLeft size={12} /> Retour
        </a>
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)", boxShadow: "0 4px 16px rgba(139,92,246,0.4)" }}>
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-base">Trakova</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            {mode === "login" ? "Bon retour 👋" : "Crée ton compte"}
          </h1>
          <p className="text-white/40 text-sm">
            {mode === "login" ? "Content de te revoir !" : "7 jours gratuits, sans carte requise"}
          </p>
        </div>
        <div className="card-glass p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Prénom" className="input pl-10" />
              </div>
            )}
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input pl-10" />
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="input pl-10 pr-10" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {error && (
              <div className="px-3 py-2 rounded-xl text-xs text-red-400" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm mt-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (mode === "login" ? "Se connecter" : "Créer mon compte")}
            </button>
          </form>
        </div>
        <p className="text-white/30 text-xs text-center mt-5">
          {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError("") }} className="text-violet-400 hover:text-violet-300 transition-colors">
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  )
}