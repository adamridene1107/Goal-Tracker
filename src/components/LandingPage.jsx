import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { Zap, Target, BookOpen, ArrowRight, CheckCircle2, Flame, Star, Shield, Dumbbell, Lightbulb, ListTodo, ChevronRight, Play } from "lucide-react"

const FEATURES = [
  { emoji: "📚", title: "Études", desc: "Devoirs, révisions, Pomodoro. Ne rate plus jamais une deadline.", color: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.2)" },
  { emoji: "💪", title: "Sport", desc: "Séances, exercices, nutrition. Suis ta progression physique.", color: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.2)" },
  { emoji: "🎨", title: "Projet perso", desc: "Idées, missions créatives, inspiration. Concrétise tes projets.", color: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.2)" },
  { emoji: "🗂️", title: "Organisation", desc: "Tâches, projets, outils. Garde le contrôle de ton quotidien.", color: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.2)" },
]

const TESTIMONIALS = [
  { name: "Lucas M.", role: "Étudiant en médecine", text: "Mon streak est à 47 jours. Je n'aurais jamais cru tenir aussi longtemps.", avatar: "L", bg: "#8b5cf6" },
  { name: "Sarah K.", role: "Freelance créative", text: "Le système XP m'a rendu accro à ma propre productivité. C'est dingue.", avatar: "S", bg: "#6366f1" },
  { name: "Thomas R.", role: "Sportif amateur", text: "Je suis mes séances depuis 3 mois. Les stats ne mentent pas.", avatar: "T", bg: "#ec4899" },
]

const STATS = [
  { value: "12k+", label: "Utilisateurs actifs" },
  { value: "94%", label: "Taux de rétention" },
  { value: "2.1M", label: "Tâches complétées" },
  { value: "4.9★", label: "Note moyenne" },
]

function Confetti({ items }) {
  return items.map(p => (
    <div key={p.id} className="confetti-particle" style={{ left: p.x, top: p.y, background: p.color, width: p.size, height: p.size, animationDelay: p.delay + "ms", borderRadius: p.round ? "50%" : "2px" }} />
  ))
}

export default function LandingPage({ onGetStarted }) {
  const { theme } = useTheme()
  const isDark = theme !== "light"
  const pageBg = isDark ? "#0A0A0F" : "#f0f0f5"
  const textPrimary = isDark ? "#ffffff" : "#1a1a2e"
  const textMuted = isDark ? "rgba(255,255,255,0.5)" : "rgba(26,26,46,0.5)"
  const [faqOpen, setFaqOpen] = useState(null)
  const [confetti, setConfetti] = useState([])
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveFeature(i => (i + 1) % FEATURES.length), 3000)
    return () => clearInterval(t)
  }, [])

  const spawn = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2
    const colors = ["#8b5cf6","#6366f1","#a78bfa","#818cf8","#f472b6","#34d399","#fbbf24"]
    const items = Array.from({ length: 22 }, (_, i) => ({
      id: Date.now() + i,
      x: cx + (Math.random() - 0.5) * 140,
      y: cy + (Math.random() - 0.5) * 70,
      color: colors[i % colors.length],
      delay: Math.random() * 250,
      size: 6 + Math.random() * 6,
      round: Math.random() > 0.5,
    }))
    setConfetti(items)
    setTimeout(() => setConfetti([]), 1200)
    onGetStarted()
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: pageBg }}>
      <Confetti items={confetti} />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Trakova" className="h-8 w-8" />
          <span className="font-bold text-white text-sm tracking-tight">Trakova</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onGetStarted} className="text-white/50 text-sm hover:text-white transition-colors hidden sm:block">Connexion</button>
          <button onClick={spawn} className="btn-primary text-xs px-4 py-2">Essai gratuit</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="glow-orb glow-orb-violet w-96 h-96 -top-20 left-1/2 -translate-x-1/2 opacity-50" />
        <div className="glow-orb glow-orb-indigo w-64 h-64 top-40 right-10 opacity-30" />
        <div className="relative max-w-3xl mx-auto fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-medium"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#a78bfa" }}>
            <Flame size={12} /> Productivité gamifiée — Essai 7 jours gratuit
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6 tracking-tight">
            Transforme tes objectifs<br />
            <span className="gradient-text">en habitudes.</span>
          </h1>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Études, sport, projets, organisation — un seul outil pour tout tracker, gamifier et accomplir.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={spawn} className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              Commencer gratuitement <ArrowRight size={16} />
            </button>
            <button className="flex items-center gap-2 text-white/50 text-sm hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <Play size={12} className="text-violet-400 ml-0.5" />
              </div>
              Voir la démo
            </button>
          </div>
          <p className="text-white/25 text-xs mt-5">7 jours gratuits · Puis 6€/mois · Annulable à tout moment</p>
        </div>
        <div className="relative max-w-2xl mx-auto mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <div key={i} className="card-glass text-center py-4 px-3">
              <p className="text-2xl font-bold gradient-text">{s.value}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">4 piliers</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Un outil pour chaque objectif</h2>
            <p className="text-white/40 mt-3 max-w-md mx-auto text-sm">Chaque mode est pensé pour son domaine. Onglets, catégories et outils adaptés.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} onClick={() => setActiveFeature(i)}
                className={`card cursor-pointer transition-all duration-300 ${activeFeature === i ? "card-glow" : ""}`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: f.color, border: "1px solid " + f.border }}>
                    {f.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base mb-1">{f.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                  {activeFeature === i && <ChevronRight size={16} className="text-violet-400 flex-shrink-0 mt-1" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">Tarif</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Simple et transparent</h2>
          </div>
          <div className="relative">
            <div className="glow-orb glow-orb-violet w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
            <div className="card-glass relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="badge badge-violet text-xs">Le plus populaire</span>
              </div>
              <div className="mb-6">
                <p className="text-white/50 text-sm mb-2">Accès complet</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold gradient-text">6€</span>
                  <span className="text-white/40 text-sm mb-2">/mois</span>
                </div>
                <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl"
                  style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <Flame size={14} className="text-violet-400" />
                  <span className="text-violet-300 text-sm font-medium">7 jours gratuits — aucun débit immédiat</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {["4 modes : Études, Sport, Créatif, Organisation","Système XP, niveaux et streaks","Devoirs, missions, fichiers illimités","Pomodoro et planning journalier","Statistiques et calendrier de progression","Toutes les futures fonctionnalités"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>
                      <CheckCircle2 size={11} className="text-violet-400" />
                    </div>
                    <span className="text-white/70 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={spawn} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
                <Zap size={16} /> Commencer l'essai gratuit
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-4 text-white/25 text-xs">
                <Shield size={11} /> Paiement sécurisé par Stripe · Annulable à tout moment
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">Témoignages</p>
            <h2 className="text-3xl font-bold text-white">Ils ont changé leurs habitudes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} className="text-violet-400 fill-violet-400" />)}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: t.bg }}>{t.avatar}</div>
                  <div>
                    <p className="text-white text-xs font-semibold">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center relative">
          <div className="glow-orb glow-orb-violet w-80 h-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />
          <div className="relative">
            <h2 className="text-4xl font-bold text-white mb-4">Prêt à passer au niveau supérieur ?</h2>
            <p className="text-white/40 mb-8 text-sm">Rejoins des milliers d'utilisateurs qui ont transformé leur quotidien.</p>
            <button onClick={spawn} className="btn-primary flex items-center gap-2 mx-auto text-base px-8 py-4">
              Commencer gratuitement <ArrowRight size={16} />
            </button>
            <p className="text-white/25 text-xs mt-4">7 jours gratuits · Puis 6€/mois · Annulable à tout moment</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      {/* FAQ */}
      <section className="px-6 py-20 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Questions fréquentes</h2>
        <p className="text-white/40 text-sm text-center mb-10">Tout ce que tu veux savoir sur Trackova</p>
        <div className="space-y-3">
          {[
            { q:"Comment s'organiser quand on est étudiant ?", a:"Trackova centralise tes devoirs, révisions et objectifs. Tu crées des tâches quotidiennes, suis ta progression et maintiens un streak de travail régulier pour rester motivé." },
            { q:"Quelle est la meilleure app de productivité gratuite ?", a:"Trackova propose un essai gratuit de 7 jours sans carte bancaire avec toutes les fonctionnalités : suivi d'objectifs, gamification XP, calendrier et gestion de fichiers." },
            { q:"Comment suivre ses objectifs sportifs efficacement ?", a:"Le mode Sport de Trackova te permet de planifier tes séances avec des templates (Push/Pull/Legs, HIIT, Yoga), suivre ton volume et tes calories, et accéder à des ressources nutrition." },
            { q:"Comment rester motivé sur un projet personnel ?", a:"Trackova utilise des streaks et des points XP pour te garder motivé. Plus tu travailles régulièrement, plus tu montes en niveau. Les badges de récompense rendent chaque victoire satisfaisante." },
            { q:"Peut-on gérer plusieurs objectifs avec Trackova ?", a:"Oui, 4 modes disponibles : Études, Sport, Projet créatif et Organisation. Chaque mode a ses propres outils adaptés à tes besoins spécifiques." },
          ].map((item, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border:"1px solid rgba(139,92,246,0.15)", background:"rgba(139,92,246,0.04)" }}>
              <button onClick={() => setFaqOpen(faqOpen===i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <h3 className="text-white/80 text-sm font-medium pr-4">{item.q}</h3>
                <span className="text-violet-400 flex-shrink-0 text-lg leading-none">{faqOpen===i ? "−" : "+"}</span>
              </button>
              {faqOpen===i && <div className="px-5 pb-4"><p className="text-white/50 text-sm leading-relaxed">{item.a}</p></div>}
            </div>
          ))}
        </div>
      </section>
      <footer className="px-6 py-8" style={{ borderTop: "1px solid rgba(139,92,246,0.1)" }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)" }}>
              <Zap size={11} className="text-white" />
            </div>
            <span className="text-white/50 text-sm font-medium">Trakova</span>
          </div>
          <p className="text-white/25 text-xs">© 2025 Trakova · Fait avec ��</p>
          <div className="flex items-center gap-4 text-white/30 text-xs">
            <a href="/subscribe" className="hover:text-white/60 transition-colors">Abonnement</a>
            <a href="/admin" className="hover:text-white/60 transition-colors">Admin</a>
          </div>
        </div>
      </footer>
    </div>
  )
}