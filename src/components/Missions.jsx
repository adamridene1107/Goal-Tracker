import { useState } from "react"
import { Plus, Trash2, CheckCircle2, Clock, Circle, ChevronDown, ChevronUp, Minus } from "lucide-react"
import { getCatégoriesForGoal } from "../lib/catégories"

const ST = [
  { v:"todo",       l:"A faire",  Icon:Circle,       c:"text-white/40",  bg:"bg-white/[0.07] text-white/40 border-white/[0.06]" },
  { v:"inprogress", l:"En cours", Icon:Clock,        c:"text-amber-400", bg:"bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { v:"done",       l:"Faite",    Icon:CheckCircle2, c:"text-white/40",  bg:"bg-white/[0.06] text-white/40 border-white/[0.08]" },
]
// CATS est maintenant dynamique selon goalId

export default function Missions({ data, updateMissions }) {
  const CATS = getCatégoriesForGoal(data.goal || "homework").map(c => c.l)
  const missions = data.missions || []
  const [txt, setTxt] = useState("")
  const [cat, setCat] = useState(() => getCatégoriesForGoal(data.goal || "homework")[0].l)
  const [target, setTarget] = useState("")
  const [open, setOpen] = useState(null)

  const save = m => updateMissions(m)
  const add = () => {
    if (!txt.trim()) return
    save([...missions, {
      id: Date.now(), text: txt.trim(), category: cat, status: "todo",
      note: "", progress: 0, target: target ? parseInt(target) : 0,
      createdAt: new Date().toISOString()
    }])
    setTxt(""); setTarget("")
  }
  const cycleStatus = id => {
    const m = missions.find(m => m.id === id)
    const i = ST.findIndex(s => s.v === m.status)
    const next = ST[(i + 1) % ST.length].v
    save(missions.map(m => m.id === id ? { ...m, status: next, progress: next === "done" ? (m.target || 1) : m.progress } : m))
  }
  const setNote = (id, note) => save(missions.map(m => m.id === id ? { ...m, note } : m))
  const setProgress = (id, val) => {
    const m = missions.find(m => m.id === id)
    const newProg = Math.max(0, Math.min(m.target || 100, val))
    const done = m.target && newProg >= m.target
    save(missions.map(m => m.id === id ? { ...m, progress: newProg, status: done ? "done" : "inprogress" } : m))
  }
  const setDeadline = (id, deadline) => save(missions.map(m => m.id === id ? { ...m, deadline } : m))
  const remove = id => save(missions.filter(m => m.id !== id))

  const done = missions.filter(m => m.status === "done").length
  const grouped = CATS.reduce((a, c) => {
    const items = missions.filter(m => m.category === c)
    if (items.length) a[c] = items
    return a
  }, {})

  return (
    <div className="space-y-3 fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Missions</h2>
          {missions.length > 0 && (
            <span className="text-white/50 text-xs">{done}/{missions.length} accomplies</span>
          )}
        </div>

        {missions.length > 0 && (
          <div className="mb-5">
            <div className="h-px bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.round((done / missions.length) * 100)}%` }} />
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-2 flex-wrap">
          <input value={txt} onChange={e => setTxt(e.target.value)} onKeyDown={e => e.key === "Enter" && add()}
            placeholder="Nouvelle mission..." className="input flex-1 min-w-0" />
          <select value={cat} onChange={e => setCat(e.target.value)}
            className="input flex-shrink-0 w-32">
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={add} className="btn-primary px-3 flex-shrink-0"><Plus size={15} /></button>
        </div>
        <input value={target} onChange={e => setTarget(e.target.value)} type="number" min="1"
          placeholder="Objectif chiffre (ex: 10 chapitres)"
          className="input text-xs" />
      </div>

      {missions.length === 0 ? (
        <div className="card text-center py-10 text-white/40 text-sm">Aucune mission. Crée ta première !</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([c, items]) => (
            <div key={c}>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 px-1">{c}</p>
              <div className="space-y-1.5">
                {items.map(m => {
                  const st = ST.find(s => s.v === m.status) || ST[0]
                  const isOpen = open === m.id
                  const hasProg = m.target > 0
                  const pct = hasProg ? Math.round((m.progress / m.target) * 100) : 0
                  return (
                    <div key={m.id} className="card overflow-hidden p-0">
                      <div className="flex items-center gap-3 p-3">
                        <button onClick={() => cycleStatus(m.id)} className="flex-shrink-0">
                          <st.Icon size={18} className={st.c} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium ${m.status === "done" ? "line-through text-white/40" : "text-white/80"}`}>
                            {m.text}
                          </span>
                          {hasProg && (
                            <div className="mt-1.5">
                              <div className="h-px bg-white/[0.06] rounded-full overflow-hidden">
                                <div className="h-full bg-white/40 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                              </div>
                              <p className="text-[10px] text-white/40 mt-0.5">{m.progress}/{m.target} — {pct}%</p>
                            </div>
                          )}
                        </div>
                        <span className={`badge border text-[10px] flex-shrink-0 ${st.bg}`}>{st.l}</span>
                        <button onClick={() => setOpen(isOpen ? null : m.id)} className="text-white/40 hover:text-white/50 flex-shrink-0">
                          {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                        <button onClick={() => remove(m.id)} className="text-white/40 hover:text-white/50 transition-colors flex-shrink-0">
                          <Trash2 size={13} />
                        </button>
                      </div>
                      {isOpen && (
                        <div className="px-3 pb-3 border-t border-white/[0.06] space-y-2 pt-3">
                          {hasProg && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white/50 flex-shrink-0">Progression :</span>
                              <button onClick={() => setProgress(m.id, m.progress - 1)} className="bg-white/[0.06] hover:bg-white/10 rounded-lg p-1 transition-colors text-white/50"><Minus size={11}/></button>
                              <span className="text-sm font-bold text-white/70 w-8 text-center">{m.progress}</span>
                              <button onClick={() => setProgress(m.id, m.progress + 1)} className="bg-white/[0.06] hover:bg-white/10 rounded-lg p-1 transition-colors text-white/50"><Plus size={11}/></button>
                              <span className="text-xs text-white/40">/ {m.target}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/50 flex-shrink-0">Date limite :</span>
                            <input type="date" value={m.deadline || ""} onChange={e => setDeadline(m.id, e.target.value)}
                              className="input text-xs flex-1" />
                          </div>
                          <textarea value={m.note} onChange={e => setNote(m.id, e.target.value)}
                            placeholder="Note ou description..." rows={2}
                            className="input resize-none w-full" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}