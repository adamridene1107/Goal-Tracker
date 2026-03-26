import { GOALS } from "../lib/goals"
import { useTheme } from "../context/ThemeContext"

export default function GoalSelector({ onSelect }) {
  const { theme } = useTheme()
  const bg = theme === "light" ? "#f0f0f5" : "#080808"
  const cardBg = theme === "light" ? "rgba(255,255,255,0.9)" : "#111111"
  const cardBorder = theme === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"
  const textColor = theme === "light" ? "#1a1a2e" : "rgba(255,255,255,0.9)"
  const mutedColor = theme === "light" ? "rgba(26,26,46,0.4)" : "rgba(255,255,255,0.4)"
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: bg }}>
      <div className="text-center mb-10 fade-in">
        <p style={{ color: mutedColor }} className="text-xs font-medium uppercase tracking-widest mb-4">Trakova</p>
        <h1 style={{ color: textColor }} className="text-3xl font-bold mb-2 tracking-tight">Quel est ton objectif ?</h1>
        <p style={{ color: mutedColor }} className="text-sm">Choisis et commence maintenant.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg fade-in">
        {GOALS.map((goal, i) => (
          <button key={goal.id} onClick={() => onSelect(goal.id)}
            style={{ animationDelay: `${i * 50}ms` }}
            className="group relative overflow-hidden rounded-2xl p-5 text-left bg-[#111111] border border-white/[0.06] hover:border-white/20 active:scale-[0.98] transition-all duration-200 fade-in">
            <div className="text-3xl mb-3">{goal.emoji}</div>
            <h3 style={{ color: textColor }} className="text-base font-semibold">{goal.label}</h3>
            <p style={{ color: mutedColor }} className="text-xs mt-1 line-clamp-1">{goal.tasks.join(" · ")}</p>
            <div style={{ color: mutedColor }} className="mt-4 flex items-center gap-1 text-xs transition-colors">
              Commencer <span className="group-hover:translate-x-1 transition-transform inline-block ml-1">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}