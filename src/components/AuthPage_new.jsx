import { useState } from "react"
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft, Zap, ShieldQuestion } from "lucide-react"
import { supabase } from "../lib/supabase"
import { useTheme } from "../context/ThemeContext"

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
    <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
  </svg>
)

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

  const handleGoogleLogin = async () => {
    setError(""); setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

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
