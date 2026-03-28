import { GOALS } from "../lib/goals"
import { useTheme } from "../context/ThemeContext"

export default function GoalSelector({ onSelect }) {
  const { theme } = useTheme()
  const isDark = theme !== "light"
  const bg = isDark ? "#0A0A0F" : "#f0f0f5"
  const cardBg = isDark ? "rgba(139,92,246,0.06)" : "rgba(255,255,255,0.9)"
  const cardBorder = isDark ? "rgba(139,92,246,0.15)" : "rgba(0,0,0,0.08)"
  const cardHoverBorder = isDark ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.3)"
  const textColor = isDark ? "#ffffff" : "#1a1a2e"
  const mutedColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(26,26,46,0.5)"

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: bg }}>
      {isDark && <>
        <div className="glow-orb glow-orb-violet w-96 h-96 -top-20 -left-20 opacity-20" />
        <div className="glow-orb glow-orb-indigo w-64 h-64 bottom-10 right-10 opacity-15" />
      </>}
      <div className="text-center mb-10 fade-in relative">
        <div className="inline-flex items-center gap-2 mb-5">
          <img src="/logo.svg" alt="Trakova" style={{ height:"36px", width:"auto" }} />
        </div>
        <h1 style={{ color: textColor }} className="text-3xl font-bold mb-2 tracking-tight">
          Quel est ton objectif ?
        </h1>
        <p style={{ color: mutedColor }} className="text-sm">Choisis et commence maintenant.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg fade-in relative">
        {GOALS.map((goal, i) => (
          <button key={goal.id} onClick={() => onSelect(goal.id)}
            style={{
              animationDelay: `${i * 60}ms`,
              background: cardBg,
              border: `1px solid ${cardBorder}`,
            }}
            onMouseEnter={e => e.currentTarget.style.border = `1px solid ${cardHoverBorder}`}
            onMouseLeave={e => e.currentTarget.style.border = `1px solid ${cardBorder}`}
            className="group relative overflow-hidden rounded-2xl p-5 text-left active:scale-[0.98] transition-all duration-200 fade-in">
            <div className="text-3xl mb-3">{goal.emoji}</div>
            <h3 style={{ color: textColor }} className="text-base font-semibold">{goal.label}</h3>
            <p style={{ color: mutedColor }} className="text-xs mt-1 line-clamp-1">{goal.tasks.join(" · ")}</p>
            <div className="mt-4 flex items-center gap-1 text-xs transition-colors" style={{ color: "#a78bfa" }}>
              Commencer <span className="group-hover:translate-x-1 transition-transform inline-block ml-1">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}