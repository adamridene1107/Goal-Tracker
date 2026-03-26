import { useState, useEffect } from "react"
import { Plus, Trash2, CheckCircle2, Circle, Calendar, ChevronDown, ChevronUp, Pencil, Bell, Flag } from "lucide-react"
import { getCatégoriesForGoal } from "../lib/categories"
import { format, isPast, isToday, isTomorrow, parseISO, differenceInDays } from "date-fns"
import { fr } from "date-fns/locale"

const PRIOS = [
  { v:"high",   l:"Haute",   c:"bg-red-500/10 text-red-400 border-red-500/20" },
  { v:"medium", l:"Moyenne", c:"bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { v:"low",    l:"Basse",   c:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
]

const MATIERES = [
  { v:"maths",    l:"Maths",    color:"bg-blue-500/10 text-blue-400",   emoji:"📐" },
  { v:"francais", l:"Francais", color:"bg-pink-500/10 text-pink-400",   emoji:"📝" },
  { v:"histoire", l:"Histoire", color:"bg-amber-500/10 text-amber-400", emoji:"🏛️" },
  { v:"geo",      l:"Geo",      color:"bg-emerald-500/10 text-emerald-400", emoji:"🌍" },
  { v:"sciences", l:"Sciences", color:"bg-purple-500/10 text-purple-400", emoji:"🔬" },
  { v:"anglais",  l:"Anglais",  color:"bg-sky-500/10 text-sky-400",     emoji:"🇬🇧" },
  { v:"espagnol", l:"Espagnol", color:"bg-orange-500/10 text-orange-400", emoji:"🇪��" },
  { v:"autre",    l:"Autre",    color:"bg-white/10 text-white/40",      emoji:"📚" },
]

const TIPS = [
  "Commence par le devoir le plus difficile quand tu es encore frais.",
  "Fais des pauses de 5 min toutes les 25 min (technique Pomodoro).",
  "Relis tes notes de cours avant de commencer un exercice.",
  "Un devoir fait a l avance vaut mieux que deux faits a la hate.",
  "Pose des questions a ton prof si quelque chose n'est pas clair.",
  "Organise ton bureau avant de travailler pour mieux te concentrer.",
]

function getDateInfo(dateStr, done) {
  if (!dateStr || done) return null
  const d = parseISO(dateStr)
  const diff = differenceInDays(d, new Date())
  if (isPast(d) && !isToday(d)) return { label:"En retard", color:"text-red-400 font-semibold" }
  if (isToday(d)) return { label:"Aujourd'hui", color:"text-amber-400 font-semibold" }
  if (isTomorrow(d)) return { label:"Demain", color:"text-amber-400" }
  if (diff <= 3) return { label:`Dans ${diff} jours`, color:"text-white/40" }
  return { label:format(d, "d MMM yyyy", { locale:fr }), color:"text-white/50" }
}

const getEmpty = (cats) => ({ title:"", desc:"", date:"", priority:"medium", matiere: cats[cats.length-1].v })

export default function Devoirs({ devoirs, updateDevoirs, goalId = "homework" }) {
  const MATIERES = getCatégoriesForGoal(goalId)
  const defaultCat = MATIERES[MATIERES.length - 1].v
  const [form, setForm] = useState(() => getEmpty(getCatégoriesForGoal(goalId)))
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [filter, setFilter] = useState("all")
  const [filterMat, setFilterMat] = useState("all")
  const [notifSent, setNotifSent] = useState(false)
  const tip = TIPS[new Date().getDay() % TIPS.length]

  useEffect(() => {
    if (notifSent) return
    const urgent = devoirs.filter(d => !d.done && d.date && (isToday(parseISO(d.date)) || isPast(parseISO(d.date))))
    if (urgent.length > 0 && "Notification" in window && Notification.permission === "granted") {
      new Notification("Devoirs urgents !", { body: `${urgent.length} devoir(s) a rendre aujourd'hui ou en retard.` })
      setNotifSent(true)
    }
  }, [devoirs, notifSent])

  const submit = () => {
    if (!form.title.trim()) return
    if (editId) {
      updateDevoirs(devoirs.map(d => d.id === editId ? { ...d, ...form, title:form.title.trim(), desc:form.desc.trim() } : d))
      setEditId(null)
    } else {
      updateDevoirs([...devoirs, { id:Date.now(), ...form, title:form.title.trim(), desc:form.desc.trim(), done:false }])
    }
    setForm(getEmpty(MATIERES)); setShowForm(false)
  }

  const startEdit = d => { setForm({ title:d.title, desc:d.desc||"", date:d.date||"", priority:d.priority||"medium", matiere:d.matiere||"autre" }); setEditId(d.id); setShowForm(true) }
  const cancelForm = () => { setForm(getEmpty(MATIERES)); setEditId(null); setShowForm(false) }
  const toggle = id => updateDevoirs(devoirs.map(d => d.id === id ? { ...d, done:!d.done } : d))
  const remove = id => updateDevoirs(devoirs.filter(d => d.id !== id))

  const filtered = devoirs.filter(d => {
    if (filter === "todo" && d.done) return false
    if (filter === "done" && !d.done) return false
    if (filter === "urgent" && (d.done || !d.date || (!isToday(parseISO(d.date)) && !isPast(parseISO(d.date))))) return false
    if (filterMat !== "all" && d.matiere !== filterMat) return false
    return true
  }).sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    const pa = PRIOS.findIndex(p => p.v === a.priority)
    const pb = PRIOS.findIndex(p => p.v === b.priority)
    if (pa !== pb) return pa - pb
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return a.date.localeCompare(b.date)
  })

  const urgentCount = devoirs.filter(d => !d.done && d.date && (isToday(parseISO(d.date)) || isPast(parseISO(d.date)))).length
  const todoCount = devoirs.filter(d => !d.done).length

  return (
    <div className="space-y-3 fade-in">

      {/* Hero */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Devoirs</h2>
            <p className="text-white/50 text-xs mt-0.5">{todoCount} a faire</p>
          </div>
          <div className="flex items-center gap-2">
            {urgentCount > 0 && (
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium px-2.5 py-1 rounded-full">
                ⚠ {urgentCount} urgent{urgentCount>1?"s":""}
              </span>
            )}
            <button onClick={() => "Notification" in window && Notification.requestPermission()}
              className="btn-ghost">
              <Bell size={15}/>
            </button>
          </div>
        </div>
      </div>

      {/* Conseil */}
      <div className="card">
        <p className="text-white/50 text-xs leading-relaxed">{tip}</p>
      </div>

      {/* Formulaire */}
      <div className="card">
        <button onClick={() => showForm && !editId ? cancelForm() : setShowForm(!showForm)}
          className="w-full flex items-center justify-between text-sm font-medium text-white/60 hover:text-white transition-colors">
          <span className="flex items-center gap-2">
            <Plus size={15}/>
            {editId ? "Modifier le devoir" : "Ajouter un devoir"}
          </span>
          {showForm ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
        </button>

        {showForm && (
          <div className="mt-4 space-y-3 border-t border-white/[0.06] pt-4">
            <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))}
              placeholder="Titre du devoir" className="input w-full" />
            <textarea value={form.desc} onChange={e => setForm(f=>({...f,desc:e.target.value}))}
              placeholder="Details, consignes... (optionnel)" className="input w-full resize-none" rows={2} />
            <div className="flex gap-2 flex-wrap">
              <select value={form.matiere} onChange={e => setForm(f=>({...f,matiere:e.target.value}))}
                className="input flex-1">
                {MATIERES.map(m => <option key={m.v} value={m.v}>{m.emoji} {m.l}</option>)}
              </select>
              <select value={form.priority} onChange={e => setForm(f=>({...f,priority:e.target.value}))}
                className="input flex-shrink-0 w-32">
                {PRIOS.map(p => <option key={p.v} value={p.v}>{p.l}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-white/50 flex-shrink-0" />
              <input type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} className="input flex-1" />
            </div>
            <div className="flex gap-2">
              <button onClick={submit} className="btn-primary flex-1">{editId ? "Enregistrér" : "Ajouter"}</button>
              <button onClick={cancelForm} className="btn-outline">Annuler</button>
            </div>
          </div>
        )}
      </div>

      {/* Filtres */}
      {devoirs.length > 0 && (
        <div className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            {[["all","Tous"],["todo","A faire"],["urgent","Urgents"],["done","Terminés"]].map(([v,l]) => (
              <button key={v} onClick={() => setFilter(v)}
                className={`pill ${filter===v ? "pill-active" : "pill-inactive"}`}>
                {v==="urgent"&&urgentCount>0?`${l} (${urgentCount})`:l}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilterMat("all")}
              className={`pill ${filterMat==="all" ? "pill-active" : "pill-inactive"}`}>
              Toutes
            </button>
            {MATIERES.map(m => (
              <button key={m.v} onClick={() => setFilterMat(filterMat===m.v?"all":m.v)}
                className={`pill ${filterMat===m.v ? "pill-active" : "pill-inactive"}`}>
                {m.emoji} {m.l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="card text-center py-10 text-white/40 text-sm">
          {devoirs.length===0 ? "Aucun devoir pour l instant." : "Aucun devoir dans cette catégorie."}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(d => {
            const pr = PRIOS.find(p => p.v===(d.priority||"medium"))||PRIOS[1]
            const mat = MATIERES.find(m => m.v===(d.matiere||"autre"))||MATIERES[6]
            const dateInfo = getDateInfo(d.date, d.done)
            return (
              <div key={d.id} className={`card transition-all ${d.done ? "opacity-40" : ""}`}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggle(d.id)} className="flex-shrink-0 mt-0.5">
                    {d.done
                      ? <CheckCircle2 size={20} className="text-white/40"/>
                      : <Circlé size={20} className="text-white/40"/>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-medium text-sm ${d.done ? "line-through text-white/40" : "text-white/80"}`}>{d.title}</p>
                      <span className={`badge text-[10px] ${mat.color}`}>{mat.emoji} {mat.l}</span>
                      <span className={`badge border text-[10px] ${pr.c}`}>{pr.l}</span>
                    </div>
                    {d.desc && <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{d.desc}</p>}
                    {d.date && dateInfo && (
                      <div className={`flex items-center gap-1 mt-1.5 text-xs ${dateInfo.color}`}>
                        <Calendar size={10}/><span>{dateInfo.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => startEdit(d)} className="btn-ghost p-1.5"><Pencil size={13}/></button>
                    <button onClick={() => remove(d.id)} className="btn-ghost p-1.5"><Trash2 size={13}/></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}