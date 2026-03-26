import { useState } from "react"
import { X, Zap } from "lucide-react"
import PomodoroWidget from "./PomodoroWidget"

export default function FocusMode({ data, getTodayEntry, toggleTask, updateEntry, onClose, onFocusComplète }) {
  const entry = getTodayEntry()
  const tasks = [
    ...(data.goal ? [] : []),
    ...(entry.freeTasks || []).filter(t => !t.done),
    ...(entry.customTasks || []).filter(t => !t.done),
  ]
  const [taskIdx, setTaskIdx] = useState(0)
  const current = tasks[taskIdx]

  return (
    <div className="focus-mode-overlay flex flex-col items-center justify-center p-6">
      <button onClick={onClose} className="absolute top-6 right-6 btn-ghost"><X size={20}/></button>
      <div className="w-full max-w-md space-y-6 fade-up">
        <div className="text-center">
          <p className="text-violet-400 text-xs font-medium uppercase tracking-widest mb-2">Mode Focus</p>
          <h2 className="text-white font-bold text-2xl">Concentre-toi sur une seule chose</h2>
        </div>

        {current ? (
          <div className="card text-center py-6">
            <p className="text-white/40 text-xs mb-2">Tâche en cours</p>
            <p className="text-white font-semibold text-lg mb-4">{current.text}</p>
            <button onClick={() => {
              if (current.id) {
                const freeTasks = (entry.freeTasks || []).map(t => t.id === current.id ? {...t, done:true} : t)
                const customTasks = (entry.customTasks || []).map(t => t.id === current.id ? {...t, done:true} : t)
                updateEntry({ freeTasks, customTasks })
              }
              setTaskIdx(i => i + 1)
            }} className="btn-primary px-6 py-2.5 text-sm">
              ✓ Terminé
            </button>
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-white font-bold text-lg">Toutes les tâches sont faites !</p>
            <p className="text-white/40 text-sm mt-1">Excellent travail aujourd'hui.</p>
          </div>
        )}

        <PomodoroWidget onFocusComplète={onFocusComplète} />

        {tasks.length > 1 && (
          <div className="flex gap-1 justify-center">
            {tasks.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === taskIdx ? "#8b5cf6" : i < taskIdx ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.1)" }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}