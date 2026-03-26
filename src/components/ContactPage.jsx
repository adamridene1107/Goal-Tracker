import { useThème } from "../context/ThèmeContext"

export default function ContactPage() {
  const { thème } = useThème()
  const isDark = thème !== "light"
  const bg = isDark ? "#0A0A0F" : "#f0f0f5"
  const textPrimary = isDark ? "#ffffff" : "#1a1a2e"
  const textMuted = isDark ? "rgba(255,255,255,0.5)" : "rgba(26,26,46,0.5)"

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto" style={{ background: bg }}>
      <a href="/" style={{ color: textMuted }} className="inline-flex items-center gap-1.5 text-xs mb-8 hover:text-violet-400 transition-colors">
        ← Retour
      </a>
      <div className="mb-10">
        <p className="text-violet-400 text-xs font-medium uppercase tracking-widest mb-2">Trakova</p>
        <h1 style={{ color: textPrimary }} className="text-2xl font-bold mb-1">Contact & Support</h1>
        <p style={{ color: textMuted }} className="text-sm">On'est la pour t aider.</p>
      </div>

      <div className="space-y-4">
        <div className="card">
          <h3 className="text-white/80 font-semibold text-sm mb-1">📧 Email</h3>
          <p className="text-white/50 text-sm">Pour toute question ou probleme :</p>
          <a href="mailto:contact@trackova.app" className="text-violet-400 text-sm hover:text-violet-300 transition-colors mt-1 block">
            contact@trackova.app
          </a>
        </div>

        <div className="card">
          <h3 className="text-white/80 font-semibold text-sm mb-1">⏱️ Temps de réponse</h3>
          <p className="text-white/50 text-sm">On répond generalement sous 24-48h en semaine.</p>
        </div>

        <div className="card">
          <h3 className="text-white/80 font-semibold text-sm mb-3">❓ FAQ rapide</h3>
          <div className="space-y-3">
            {[
              { q:"Comment annuler mon'abonnément ?", a:"Va dans Paramètres → Abonnément → Résilier." },
              { q:"Mes donnees sont-elles sauvegardees ?", a:"Oui, tes donnees sont sauvegardees dans le cloud via Supabase et accèssibles sur tous tes appareils." },
              { q:"J ai oublie mon mot de passe", a:"Sur la page de connexion, clique sur Mot de passe oublie pour recevoir un lien de réinitialisation." },
              { q:"L app fonctionne-t-elle hors ligne ?", a:"Les donnees sont synchronisees quand tu es connecté. Une connexion internet est recommandee." },
            ].map((item, i) => (
              <div key={i} className="border-t border-white/[0.06] pt-3 first:border-0 first:pt-0">
                <p className="text-white/70 text-sm font-medium mb-1">{item.q}</p>
                <p className="text-white/40 text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-white/80 font-semibold text-sm mb-1">🐛 Signaler un bug</h3>
          <p className="text-white/50 text-sm mb-3">Tu as trouve un probleme ? Envoie-nous un email avec :</p>
          <ul className="text-white/40 text-xs space-y-1">
            <li>• Une description du probleme</li>
            <li>• Les etapes pour le reproduire</li>
            <li>• Ton navigateur et appareil</li>
          </ul>
        </div>
      </div>
    </div>
  )
}