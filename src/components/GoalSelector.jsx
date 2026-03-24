import { GOALS } from "../lib/goals"

export default function GoalSelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10 fade-in">
        <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-4">Trakova</p>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Quel est ton objectif ?</h1>
        <p className="text-white/50 text-sm">Choisis et commence maintenant.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg fade-in">
        {GOALS.map((goal, i) => (
          <button key={goal.id} onClick={() => onSelect(goal.id)}
            style={{ animationDelay: `${i * 50}ms` }}
            className="group relative overflow-hidden rounded-2xl p-5 text-left bg-[#111111] border border-white/[0.06] hover:border-white/20 active:scale-[0.98] transition-all duration-200 fade-in">
            <div className="text-3xl mb-3">{goal.emoji}</div>
            <h3 className="text-base font-semibold text-white/90">{goal.label}</h3>
            <p className="text-xs text-white/40 mt-1 line-clamp-1">{goal.tasks.join(" · ")}</p>
            <div className="mt-4 flex items-center gap-1 text-xs text-white/50 group-hover:text-white/60 transition-colors">
              Commencer <span className="group-hover:translate-x-1 transition-transform inline-block ml-1">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}