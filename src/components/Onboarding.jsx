import { useState, useEffect } from "react"
import { X, ChevronRight } from "lucide-react"

const STEPS = [
  { emoji:"🎯", title:"Bienvenue sur Trakova !", desc:"L'app pour atteindre tes objectifs. Études, sport, projets — tout en un seul endroit." },
  { emoji:"📋", title:"Tes tâches du jour", desc:"Chaque jour, coche tes tâches pour maintenir ton streak. Plus tu es régulier, plus tu progresses !" },
  { emoji:"🔥", title:"Le système de streak", desc:"Complète au moins une tâche par jour pour maintenir ta série. Le streak se remet à zéro si tu sautes une journée." },
  { emoji:"⚡", title:"XP et niveaux", desc:"Chaque tâche complétée te rapporte des points XP. Monte en niveau et débloque des badges de récompense." },
  { emoji:"🚀", title:"C'est parti !", desc:"Tu es prêt. Commence par choisir ton objectif et compléter ta première tâche du jour. Bonne chance !" },
]

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}>
      <div className="w-full max-w-sm fade-up" style={{ background: "rgba(18,18,26,0.98)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "1.5rem", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
        <div className="p-6">
          {/* Progress dots */}
          <div className="flex gap-1.5 mb-6">
            {STEPS.map((_, i) => (
              <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{ background: i <= step ? "#8b5cf6" : "rgba(255,255,255,0.1)" }} />
            ))}
          </div>

          <div className="text-center py-4">
            <div className="text-5xl mb-4">{current.emoji}</div>
            <h2 className="text-white font-bold text-xl mb-3">{current.title}</h2>
            <p className="text-white/50 text-sm leading-relaxed">{current.desc}</p>
          </div>

          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-ghost flex-1 py-3 text-sm">
                Retour
              </button>
            )}
            <button onClick={() => isLast ? onDone() : setStep(s => s + 1)}
              className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2">
              {isLast ? "Commencer" : "Suivant"}
              {!isLast && <ChevronRight size={14} />}
            </button>
          </div>

          {!isLast && (
            <button onClick={onDone} className="w-full text-center text-white/20 text-xs mt-3 hover:text-white/40 transition-colors">
              Passér le tutoriel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}