import { useState } from "react"
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft, Zap } from "lucide-react"

function getUsers() { try { return JSON.parse(localStorage.getItem("gt_users") || "{}") } catch { return {} } }
function saveUsers(u) { localStorage.setItem("gt_users", JSON.stringify(u)) }

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login") // login | signup | forgot | verify | reset
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [code, setCode] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
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
    } else if (mode === "login") {
      if (!users[email]) { setLoading(false); return setError("Compte introuvable") }
      if (users[email].password !== password) { setLoading(false); return setError("Mot de passe incorrect") }
      const n = users[email].name
      localStorage.setItem("gt_session", JSON.stringify({ email, name: n }))
      onAuth({ email, name: n })
    } else if (mode === "forgot") {
      if (!email.trim()) { setLoading(false); return setError("Entre ton email") }
      const users2 = getUsers()
      if (!users2[email]) { setLoading(false); return setError("Aucun compte avec cet email") }
      try {
        const res = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "send", email })
        })
        const data = await res.json()
        if (!res.ok) { setLoading(false); return setError(data.error || "Erreur envoi") }
        setSuccess("Code envoyé ! Vérifie ta boîte mail.")
        setMode("verify")
      } catch(e) { setError("Erreur réseau") }
    } else if (mode === "verify") {
      if (code.length !== 6) { setLoading(false); return setError("Le code fait 6 chiffres") }
      try {
        const res = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "verify", email, code })
        })
        const data = await res.json()
        if (!res.ok) { setLoading(false); return setError(data.error || "Code invalide") }
        setMode("reset")
      } catch(e) { setError("Erreur réseau") }
    } else if (mode === "reset") {
      if (newPassword.length < 6) { setLoading(false); return setError("Mot de passe trop court (6 min)") }
      const users3 = getUsers()
      users3[email].password = newPassword
      saveUsers(users3)
      setSuccess("Mot de passe mis à jour !")
      setTimeout(() => { setMode("login"); setSuccess("") }, 1500)
    }
    setLoading(false)
  }

  const titles = {
    login: { h: "Bon retour 👋", p: "Content de te revoir !" },
    signup: { h: "Crée ton compte", p: "7 jours gratuits, sans carte requise" },
    forgot: { h: "Mot de passe oublié", p: "On t'envoie un code par email" },
    verify: { h: "Vérifie ton email", p: `Code envoyé à ${email}` },
    reset: { h: "Nouveau mot de passe", p: "Choisis un nouveau mot de passe" },
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "#0A0A0F" }}>
      <div className="glow-orb glow-orb-violet w-96 h-96 -top-20 -left-20 opacity-25" />
      <div className="glow-orb glow-orb-indigo w-64 h-64 bottom-10 right-10 opacity-15" />
      <div className="w-full max-w-sm relative fade-up">
        <button onClick={() => { setMode(mode === "login" || mode === "signup" ? mode : "login"); setError(""); setSuccess("") }}
          className="inline-flex items-center gap-1.5 text-white/30 text-xs mb-8 hover:text-white/60 transition-colors">
          <ArrowLeft size={12} /> {mode === "login" || mode === "signup" ? <a href="/">Retour</a> : "Retour à la connexion"}
        </button>
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)", boxShadow: "0 4px 16px rgba(139,92,246,0.4)" }}>
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-base">Trakova</span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">{titles[mode].h}</h1>
          <p className="text-white/40 text-sm">{titles[mode].p}</p>
        </div>
        <div className="card-glass p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Prénom" className="input pl-10" />
              </div>
            )}
            {(mode === "login" || mode === "signup" || mode === "forgot") && (
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input pl-10" />
              </div>
            )}
            {(mode === "login" || mode === "signup") && (
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            )}
            {mode === "verify" && (
              <div className="relative">
                <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0,6))}
                  placeholder="Code à 6 chiffres" className="input text-center text-2xl tracking-widest font-bold" maxLength={6} />
              </div>
            )}
            {mode === "reset" && (
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={show ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            )}
            {error && (
              <div className="px-3 py-2 rounded-xl text-xs text-red-400" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                {error}
              </div>
            )}
            {success && (
              <div className="px-3 py-2 rounded-xl text-xs text-emerald-400" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}>
                {success}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm mt-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                mode === "login" ? "Se connecter" :
                mode === "signup" ? "Créer mon compte" :
                mode === "forgot" ? "Envoyer le code" :
                mode === "verify" ? "Vérifier le code" :
                "Réinitialiser"}
            </button>
          </form>
        </div>
        {(mode === "login" || mode === "signup") && (
          <div className="mt-5 space-y-2 text-center">
            {mode === "login" && (
              <button onClick={() => { setMode("forgot"); setError(""); setSuccess("") }}
                className="block w-full text-white/30 text-xs hover:text-violet-400 transition-colors">
                Mot de passe oublié ?
              </button>
            )}
            <p className="text-white/30 text-xs">
              {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
              <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError("") }}
                className="text-violet-400 hover:text-violet-300 transition-colors">
                {mode === "login" ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}