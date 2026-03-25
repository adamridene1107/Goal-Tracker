import { useState } from "react"
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft, Zap, ShieldQuestion } from "lucide-react"

const QUESTIONS = [
  "Quel est le nom de ton premier animal de compagnie ?",
  "Dans quelle ville es-tu né(e) ?",
  "Quel est le prénom de ta mère ?",
  "Quel était le nom de ton école primaire ?",
  "Quelle est ta couleur préférée ?",
  "Quel est le modèle de ta première voiture ?",
  "Quel est le prénom de ton meilleur ami d'enfance ?",
  "Quelle est ta nourriture préférée ?",
]

function getUsers() { try { return JSON.parse(localStorage.getItem("gt_users") || "{}") } catch { return {} } }
function saveUsers(u) { localStorage.setItem("gt_users", JSON.stringify(u)) }

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login") // login | signup | questions | forgot | forgot-answer | reset
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  // Questions de sécurité
  const [q1, setQ1] = useState(QUESTIONS[0])
  const [a1, setA1] = useState("")
  const [q2, setQ2] = useState(QUESTIONS[1])
  const [a2, setA2] = useState("")

  // Pour forgot
  const [forgotQ1, setForgotQ1] = useState("")
  const [forgotQ2, setForgotQ2] = useState("")
  const [forgotA1, setForgotA1] = useState("")
  const [forgotA2, setForgotA2] = useState("")

  const goTo = (m) => { setMode(m); setError(""); setSuccess("") }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))
    const users = getUsers()

    if (mode === "login") {
      if (!users[email]) { setLoading(false); return setError("Compte introuvable") }
      if (users[email].password !== password) { setLoading(false); return setError("Mot de passe incorrect") }
      const n = users[email].name
      localStorage.setItem("gt_session", JSON.stringify({ email, name: n }))
      onAuth({ email, name: n })

    } else if (mode === "signup") {
      if (!name.trim()) { setLoading(false); return setError("Entre ton prénom") }
      if (!email.trim()) { setLoading(false); return setError("Entre ton email") }
      if (password.length < 6) { setLoading(false); return setError("Mot de passe trop court (6 min)") }
      if (users[email]) { setLoading(false); return setError("Ce compte existe déjà") }
      setLoading(false)
      goTo("questions")
      return

    } else if (mode === "questions") {
      if (!a1.trim() || !a2.trim()) { setLoading(false); return setError("Réponds aux deux questions") }
      if (q1 === q2) { setLoading(false); return setError("Choisis deux questions différentes") }
      const users2 = getUsers()
      users2[email] = { name: name.trim(), password, q1, a1: a1.trim().toLowerCase(), q2, a2: a2.trim().toLowerCase() }
      saveUsers(users2)
      localStorage.setItem("gt_session", JSON.stringify({ email, name: name.trim() }))
      onAuth({ email, name: name.trim() })

    } else if (mode === "forgot") {
      if (!email.trim()) { setLoading(false); return setError("Entre ton email") }
      const u = getUsers()[email]
      if (!u) { setLoading(false); return setError("Aucun compte avec cet email") }
      setForgotQ1(u.q1)
      setForgotQ2(u.q2)
      setLoading(false)
      goTo("forgot-answer")
      return

    } else if (mode === "forgot-answer") {
      const u = getUsers()[email]
      if (forgotA1.trim().toLowerCase() !== u.a1 || forgotA2.trim().toLowerCase() !== u.a2) {
        setLoading(false); return setError("Réponses incorrectes")
      }
      setLoading(false)
      goTo("reset")
      return

    } else if (mode === "reset") {
      if (newPassword.length < 6) { setLoading(false); return setError("Mot de passe trop court (6 min)") }
      const users3 = getUsers()
      users3[email].password = newPassword
      saveUsers(users3)
      setSuccess("Mot de passe mis à jour !")
      setTimeout(() => goTo("login"), 1500)
    }
    setLoading(false)
  }

  const titles = {
    login: { h: "Bon retour 👋", p: "Content de te revoir !" },
    signup: { h: "Crée ton compte", p: "7 jours gratuits, sans carte requise" },
    questions: { h: "Questions de sécurité", p: "Pour récupérer ton compte si besoin" },
    forgot: { h: "Mot de passe oublié", p: "Entre ton email pour continuer" },
    "forgot-answer": { h: "Vérifie ton identité", p: "Réponds à tes questions de sécurité" },
    reset: { h: "Nouveau mot de passe", p: "Choisis un nouveau mot de passe" },
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "#0A0A0F" }}>
      <div className="glow-orb glow-orb-violet w-96 h-96 -top-20 -left-20 opacity-25" />
      <div className="glow-orb glow-orb-indigo w-64 h-64 bottom-10 right-10 opacity-15" />
      <div className="w-full max-w-sm relative fade-up">
        <button onClick={() => goTo(mode === "login" || mode === "signup" ? "login" : "login")}
          className="inline-flex items-center gap-1.5 text-white/30 text-xs mb-8 hover:text-white/60 transition-colors">
          <ArrowLeft size={12} />
          {mode === "login" || mode === "signup" ? <a href="/">Retour</a> : "Retour à la connexion"}
        </button>

        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)", boxShadow: "0 4px 16px rgba(139,92,246,0.4)" }}>
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-base">Trakova</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">{titles[mode]?.h}</h1>
          <p className="text-white/40 text-sm">{titles[mode]?.p}</p>
        </div>

        <div className="card-glass p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Signup */}
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
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </>}

            {/* Login */}
            {mode === "login" && <>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input pl-10" />
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </>}

            {/* Questions setup */}
            {mode === "questions" && <>
              <div className="px-3 py-2 rounded-xl text-xs text-white/50 mb-2" style={{ background:"rgba(139,92,246,0.06)", border:"1px solid rgba(139,92,246,0.1)" }}>
                <ShieldQuestion size={12} className="inline mr-1.5 text-violet-400" />
                Ces réponses serviront à récupérer ton compte
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

            {/* Forgot email */}
            {mode === "forgot" && (
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input pl-10" />
              </div>
            )}

            {/* Forgot answers */}
            {mode === "forgot-answer" && <>
              <div className="space-y-2">
                <p className="text-white/50 text-xs">{forgotQ1}</p>
                <input value={forgotA1} onChange={e => setForgotA1(e.target.value)} placeholder="Ta réponse" className="input" />
              </div>
              <div className="space-y-2">
                <p className="text-white/50 text-xs">{forgotQ2}</p>
                <input value={forgotA2} onChange={e => setForgotA2(e.target.value)} placeholder="Ta réponse" className="input" />
              </div>
            </>}

            {/* Reset password */}
            {mode === "reset" && (
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={show ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe" className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            )}

            {error && <div className="px-3 py-2 rounded-xl text-xs text-red-400" style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)" }}>{error}</div>}
            {success && <div className="px-3 py-2 rounded-xl text-xs text-emerald-400" style={{ background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.15)" }}>{success}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm mt-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                mode === "login" ? "Se connecter" :
                mode === "signup" ? "Continuer" :
                mode === "questions" ? "Créer mon compte" :
                mode === "forgot" ? "Continuer" :
                mode === "forgot-answer" ? "Vérifier" :
                "Réinitialiser"}
            </button>
          </form>
        </div>

        {(mode === "login" || mode === "signup") && (
          <div className="mt-5 space-y-2 text-center">
            {mode === "login" && (
              <button onClick={() => goTo("forgot")} className="block w-full text-white/30 text-xs hover:text-violet-400 transition-colors">
                Mot de passe oublié ?
              </button>
            )}
            <p className="text-white/30 text-xs">
              {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
              <button onClick={() => goTo(mode === "login" ? "signup" : "login")} className="text-violet-400 hover:text-violet-300 transition-colors">
                {mode === "login" ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}