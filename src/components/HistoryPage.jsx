import { useMemo } from "react"
import { format, subDays, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

function getLevel(count) {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 4) return 2
  if (count <= 6) return 3
  return 4
}

const COLORS = [
  "rgba(255,255,255,0.06)",
  "rgba(139,92,246,0.25)",
  "rgba(139,92,246,0.45)",
  "rgba(139,92,246,0.7)",
  "#8b5cf6",
]

export default function HistoryPage({ data }) {
  const today = format(new Date(), "yyyy-MM-dd")

  const activityMap = useMemo(() => {
    const map = {}
    const entries = data.entries || {}
    Object.entries(entries).forEach(([date, entry]) => {
      const fixed = (entry.tasks || []).filter(Boolean).length
      const free = (entry.freeTasks || []).filter(t => t.done).length
      const custom = (entry.customTasks || []).filter(t => t.done).length
      map[date] = fixed + free + custom
    })
    return map
  }, [data.entries])

  // 52 semaines = 364 jours
  const weeks = useMemo(() => {
    const days = []
    for (let i = 363; i >= 0; i--) {
      const d = format(subDays(new Date(), i), "yyyy-MM-dd")
      days.push(d)
    }
    const w = []
    for (let i = 0; i < days.length; i += 7) w.push(days.slice(i, i + 7))
    return w
  }, [])

  const totalDays = Object.keys(activityMap).filter(d => activityMap[d] > 0).length
  const totalTasks = Object.values(activityMap).reduce((a, b) => a + b, 0)
  const currentStreak = data.streak || 0

  // Historique des tâches complétées
  const complètedTasks = useMemo(() => {
    const entries = data.entries || {}
    const list = []
    Object.entries(entries).sort((a,b) => b[0].localeCompare(a[0])).slice(0, 30).forEach(([date, entry]) => {
      const tasks = []
      const goal = data.goal
      ;(entry.tasks || []).forEach((done, i) => { if (done) tasks.push({ text: `Tâche ${i+1}`, done: true }) })
      ;(entry.freeTasks || []).filter(t => t.done).forEach(t => tasks.push(t))
      ;(entry.customTasks || []).filter(t => t.done).forEach(t => tasks.push(t))
      if (tasks.length > 0) list.push({ date, tasks })
    })
    return list
  }, [data.entries])

  return (
    <div className="space-y-4 fade-in">
      <div className="card">
        <h2 className="text-white font-bold text-lg mb-1">Historique</h2>
        <p className="text-white/40 text-xs">Ton'activité sur les 52 dernières semaines</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:"Jours actifs", value: totalDays },
          { label:"Tâches totales", value: totalTasks },
          { label:"Streak actuel", value: `${currentStreak}j` },
        ].map(s => (
          <div key={s.label} className="card text-center py-3">
            <p className="text-white font-bold text-xl">{s.value}</p>
            <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="card overflow-x-auto">
        <p className="text-white/40 text-xs mb-3">Contributions</p>
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map(day => {
                const count = activityMap[day] || 0
                const level = getLevel(count)
                const isToday = day === today
                return (
                  <div key={day} title={`${day} — ${count} tâche${count !== 1 ? "s" : ""}`}
                    className="w-3 h-3 rounded-sm transition-all"
                    style={{
                      background: COLORS[level],
                      outline: isToday ? "1px solid #8b5cf6" : "none",
                      outlineOffset: "1px"
                    }} />
                )
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-white/30 text-[10px]">Moins</span>
          {COLORS.map((c, i) => <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />)}
          <span className="text-white/30 text-[10px]">Plus</span>
        </div>
      </div>

      {/* Liste des jours */}
      {complètedTasks.length === 0 ? (
        <div className="card text-center py-10 text-white/40 text-sm">Aucune activité enregistrée.</div>
      ) : complètedTasks.map(({ date, tasks }) => (
        <div key={date} className="card">
          <p className="text-white/50 text-xs font-medium mb-2 capitalize">
            {format(parseISO(date), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
          <div className="space-y-1">
            {tasks.slice(0, 5).map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                <span className="text-emerald-400 text-xs">✓</span>
                {t.text || `Tâche ${i+1}`}
              </div>
            ))}
            {tasks.length > 5 && <p className="text-white/30 text-xs">+{tasks.length - 5} autres</p>}
          </div>
        </div>
      ))}
    </div>
  )
}