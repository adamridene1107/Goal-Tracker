import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { Lock, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Supabase met le token dans le hash de l URL
    const hash = window.location.hash
    if (!hash.includes("access_token")) {
      setError("Lien invalide ou expiré.")
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (password.length < 6) return setError("Mot de passe trop court (6 min)")
    if (password !== confirm) return setError("Les mots de passe ne correspondent pas")
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setTimeout(() => { window.location.href = "/" }, 2000)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background:"#0A0A0F" }}>
      <div className="w-full max-w-sm fade-up">
        <div className="flex items-center gap-2.5 mb-8">
          <img src="/logo.svg" alt="Trakova" style={{ height:"32px" }} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Nouveau mot de passe</h1>
        <p className="text-white/40 text-sm mb-8">Choisis un nouveau mot de passe sécurisé.</p>

        {success ? (
          <div className="card text-center py-8">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-white font-bold">Mot de passe mis à jour !</p>
            <p className="text-white/40 text-sm mt-1">Redirection en cours...</p>
          </div>
        ) : (
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={show ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Nouveau mot de passe" className="input pl-10 pr-10 w-full" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                  {show ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={show ? "text" : "password"} value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Confirmer le mot de passe" className="input pl-10 w-full" />
              </div>
              {error && <div className="px-3 py-2 rounded-xl text-xs text-red-400" style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)" }}>{error}</div>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm flex items-center justify-center">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : "Réinitialiser"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}