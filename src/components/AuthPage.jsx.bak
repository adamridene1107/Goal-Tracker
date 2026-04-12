import { useState } from "react"
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft, Zap, ShieldQuestion } from "lucide-react"
import { supabase } from "../lib/supabase"
import { useTheme } from "../context/ThemeContext"

const QUESTIONS = [
  "Quel est le nom de ton premier animal de compagnie ?",
  "Dans quelle ville es-tu ne(e) ?",
  "Quel est le prénom de ta mere ?",
  "Quel etait le nom de ton école primaire ?",
  "Quelle est ta couleur preferee ?",
  "Quel est le prénom de ton meilleur ami d enfance ?",
  "Quelle est ta nourriture preferee ?",
  "Quel est le modèle de ta première voiture ?",
]

export default function AuthPage({ onAuth }) {
  const { theme } = useTheme()
  const isDark = theme !== "light"
  const pageBg = isDark ? "#0A0A0F" : "#f0f0f5"
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const textPrimary = isDark ? "#ffffff" : "#1a1a2e"
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(26,26,46,0.5)"
  const borderColor = isDark ? "rgba(139,92,246,0.15)" : "rgba(0,0,0,0.1)"

  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [q1, setQ1] = useState(QUESTIONS[0])
  const [a1, setA1] = useState("")
  const [q2, setQ2] = useState(QUESTIONS[1])
  const [a2, setA2] = useState("")
  const [forgotQ1, setForgotQ1] = useState("")
  const [forgotQ2, setForgotQ2] = useState("")
  const [forgotA1, setForgotA1] = useState("")
  const [forgotA2, setForgotA2] = useState("")

  const goTo = (m) => { setMode(m); setError(""); setSuccess("") }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(""); setLoading(true)

    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message === "Invalid login credentials" ? "Email ou mot de passe incorrect" : error.message) }
      else onAuth({ id: data.user.id, email: data.user.email, name: data.user.user_metadata?.name || email.split("@")[0] })

    } else if (mode === "signup") {
      if (!name.trim()) { setLoading(false); return setError("Entre ton prénom") }
      if (password.length < 6) { setLoading(false); return setError("Mot de passe trop court (6 min)") }
      if (!acceptTerms) { setLoading(false); return setError("Tu dois accepter les CGU") }
      setLoading(false); goTo("questions"); return

    } else if (mode === "questions") {
      if (!a1.trim() || !a2.trim()) { setLoading(false); return setError("Réponds aux deux questions") }
      if (q1 === q2) { setLoading(false); return setError("Choisis deux questions differentes") }
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name: name.trim(), q1, a1: a1.trim().toLowerCase(), q2, a2: a2.trim().toLowerCase() } }
      })
      if (error) { setError(error.message) }
      else if (data.user) {
        // Envoyer email de bienvenue
      fetch("/api/welcome-email", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email, name: name.trim() }) }).catch(()=>{})
      onAuth({ id: data.user.id, email: data.user.email, name: name.trim() }, true)
      }

    } else if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://trackova.vercel.app/reset-password"
      })
      if (error) setError(error.message)
      else { setSuccess("Email envoyé ! Vérifie ta boite mail."); goTo("verify") }

    } else if (mode === "reset") {
      if (newPassword.length < 6) { setLoading(false); return setError("Mot de passe trop court") }
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) setError(error.message)
      else { setSuccess("Mot de passe mis à jour !"); setTimeout(() => goTo("login"), 1500) }
    }

    setLoading(false)
  }

  const titles = {
    login: { h: "Bon retour 👋", p: "Content de te revoir !" },
    signup: { h: "Crée ton compte", p: "7 jours gratuits, sans carte requise" },
    questions: { h: "Questions de sécurité", p: "Pour récupérer ton compte si besoin" },
    forgot: { h: "Mot de passe oublie", p: "Entre ton email pour continuer" },
    verify: { h: "Email envoyé !", p: "Vérifie ta boite mail" },
    reset: { h: "Nouveau mot de passe", p: "Choisis un nouveau mot de passe" },
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: pageBg }}>
      <div className="glow-orb glow-orb-violet w-96 h-96 -top-20 -left-20 opacity-25" />
      <div className="w-full max-w-sm relative fade-up">
        <button onClick={() => goTo(mode === "login" || mode === "signup" ? "login" : "login")}
          style={{ color: textMuted }} className="inline-flex items-center gap-1.5 text-xs mb-8 transition-colors">
          <ArrowLeft size={12} />
          {mode === "login" || mode === "signup" ? <a href="/">Retour</a> : "Retour a la connexion"}
        </button>
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)", boxShadow: "0 4px 16px rgba(139,92,246,0.4)" }}>
            <Zap size={16} className="text-white" />
          </div>
          <span style={{ color: textPrimary }} className="font-bold text-base">Trakova</span>
        </div>
        <div className="mb-8">
          <h1 style={{ color: textPrimary }} className="text-3xl font-bold mb-1">{titles[mode]?.h}</h1>
          <p style={{ color: textMuted }} className="text-sm">{titles[mode]?.p}</p>
        </div>
        <div className="card-glass p-6" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && <>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Prénom" className="input pl-10" />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input pl-10" />
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} className="mt-0.5 flex-shrink-0 accent-violet-500" />
                <span style={{ color: textMuted }} className="text-xs leading-relaxed">
                  J accepte les <a href="/cgu" target="_blank" className="text-violet-400 underline">CGU</a> et la <a href="/privacy" target="_blank" className="text-violet-400 underline">politique de confidentialité</a>
                </span>
              </label>
            </>}
            {mode === "login" && <>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input pl-10" />
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </>}
            {mode === "questions" && <>
              <div className="px-3 py-2 rounded-xl text-xs mb-2" style={{ background:"rgba(139,92,246,0.06)", border:"1px solid rgba(139,92,246,0.1)", color: textMuted }}>
                <ShieldQuestion size={12} className="inline mr-1.5 text-violet-400" />
                Ces réponses serviront a récupérer ton compte
              </div>
              <div className="space-y-2">
                <select value={q1} onChange={e => setQ1(e.target.value)} className="input w-full text-sm">
                  {QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <input value={a1} onChange={e => setA1(e.target.value)} placeholder="Ta réponse" className="input" />
              </div>
              <div className="space-y-2">
                <select value={q2} onChange={e => setQ2(e.target.value)} className="input w-full text-sm">
                  {QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <input value={a2} onChange={e => setA2(e.target.value)} placeholder="Ta réponse" className="input" />
              </div>
            </>}
            {mode === "forgot" && (
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input pl-10" />
              </div>
            )}
            {mode === "reset" && (
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={show ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            )}
            {error && <div className="px-3 py-2 rounded-xl text-xs text-red-400" style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)" }}>{error}</div>}
            {success && <div className="px-3 py-2 rounded-xl text-xs text-emerald-400" style={{ background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.15)" }}>{success}</div>}
            {mode !== "verify" && (
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm mt-2">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                  mode === "login" ? "Se connecter" :
                  mode === "signup" ? "Continuer" :
                  mode === "questions" ? "Créer mon compte" :
                  mode === "forgot" ? "Envoyer le lien" : "Réinitialiser"}
              </button>
            )}
          </form>
        </div>
        {(mode === "login" || mode === "signup") && (
          <div className="mt-5 space-y-2 text-center">
            {mode === "login" && (
              <button onClick={() => goTo("forgot")} style={{ color: textMuted }} className="block w-full text-xs hover:text-violet-400 transition-colors">
                Mot de passe oublie ?
              </button>
            )}
            <p style={{ color: textMuted }} className="text-xs">
              {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
              <button onClick={() => goTo(mode === "login" ? "signup" : "login")} className="text-violet-400 hover:text-violet-300 transition-colors">
                {mode === "login" ? "S inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}