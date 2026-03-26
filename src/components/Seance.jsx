import { useState } from "react"
import AnimatedCheckbox from "./AnimatedCheckbox"
import { Plus, Trash2, CheckCircle2, Circle, Timer, Flame, ChevronDown, ChevronUp, Zap, RotateCcw, FileText } from "lucide-react"

const TYPES = [
  { v:"cardio",  l:"Cardio",       emoji:"🏃" },
  { v:"muscu",   l:"Muscu",        emoji:"💪" },
  { v:"yoga",    l:"Yoga",         emoji:"🧘" },
  { v:"hiit",    l:"HIIT",         emoji:"🔥" },
  { v:"natation",l:"Natation",     emoji:"🏊" },
  { v:"sport",   l:"Sport",        emoji:"⚽" },
  { v:"autre",   l:"Autre",        emoji:"🏅" },
]

const TEMPLATES = [
  { label:"Push (Poitrine/Épaules/Triceps)", emoji:"💪", exercices:[
    { type:"muscu", nom:"Développé couché", séries:"4", reps:"8", poids:"", durée:"" },
    { type:"muscu", nom:"Développé incliné haltères", séries:"3", reps:"10", poids:"", durée:"" },
    { type:"muscu", nom:"Élévations latérales", séries:"3", reps:"15", poids:"", durée:"" },
    { type:"muscu", nom:"Dips triceps", séries:"3", reps:"12", poids:"", durée:"" },
  ]},
  { label:"Pull (Dos/Biceps)", emoji:"🔙", exercices:[
    { type:"muscu", nom:"Tractions", séries:"4", reps:"8", poids:"", durée:"" },
    { type:"muscu", nom:"Rowing barre", séries:"3", reps:"10", poids:"", durée:"" },
    { type:"muscu", nom:"Curl biceps", séries:"3", reps:"12", poids:"", durée:"" },
    { type:"muscu", nom:"Face pull", séries:"3", reps:"15", poids:"", durée:"" },
  ]},
  { label:"Legs (Jambes)", emoji:"🦵", exercices:[
    { type:"muscu", nom:"Squat", séries:"4", reps:"8", poids:"", durée:"" },
    { type:"muscu", nom:"Presse à cuisses", séries:"3", reps:"12", poids:"", durée:"" },
    { type:"muscu", nom:"Fentes", séries:"3", reps:"10", poids:"", durée:"" },
    { type:"muscu", nom:"Mollets debout", séries:"4", reps:"20", poids:"", durée:"" },
  ]},
  { label:"Full Body", emoji:"⚡", exercices:[
    { type:"muscu", nom:"Squat", séries:"3", reps:"10", poids:"", durée:"" },
    { type:"muscu", nom:"Développé couché", séries:"3", reps:"10", poids:"", durée:"" },
    { type:"muscu", nom:"Rowing haltères", séries:"3", reps:"10", poids:"", durée:"" },
    { type:"cardio", nom:"Gainage", séries:"3", reps:"", poids:"", durée:"1" },
  ]},
  { label:"Cardio HIIT 20 min", emoji:"🔥", exercices:[
    { type:"hiit", nom:"Jumping jacks", séries:"4", reps:"30", poids:"", durée:"" },
    { type:"hiit", nom:"Burpees", séries:"4", reps:"10", poids:"", durée:"" },
    { type:"hiit", nom:"Mountain climbers", séries:"4", reps:"20", poids:"", durée:"" },
    { type:"cardio", nom:"Course sur place", séries:"", reps:"", poids:"", durée:"2" },
  ]},
  { label:"Yoga & Mobilité", emoji:"🧘", exercices:[
    { type:"yoga", nom:"Salutation'au soleil", séries:"3", reps:"", poids:"", durée:"5" },
    { type:"yoga", nom:"Pigeon (chaque côté)", séries:"2", reps:"", poids:"", durée:"2" },
    { type:"yoga", nom:"Étirements ischio-jambiers", séries:"2", reps:"", poids:"", durée:"2" },
  ]},
]

const MET = { cardio:7, muscu:5, hiit:9, yoga:3, natation:8, sport:6, autre:5 }

export default function Séance({ data, updateEntry, getTodayEntry }) {
  const entry = getTodayEntry()
  const séances = entry.séances || []
  const [form, setForm] = useState({ type:"muscu", nom:"", durée:"", séries:"", reps:"", poids:"", note:"" })
  const [showForm, setShowForm] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showNote, setShowNote] = useState(null)

  const add = () => {
    if (!form.nom.trim()) return
    const s = { id: Date.now(), ...form, nom: form.nom.trim(), done: false }
    updateEntry({ séances: [...séances, s] })
    setForm({ type:"muscu", nom:"", durée:"", séries:"", reps:"", poids:"", note:"" })
    setShowForm(false)
  }

  const loadTemplate = (tpl) => {
    const news = tpl.exercices.map((e, i) => ({ id: Date.now() + i, ...e, done: false, note:"" }))
    updateEntry({ séances: [...séances, ...news] })
    setShowTemplates(false)
  }

  const toggle = id => updateEntry({ séances: séances.map(s => s.id===id ? {...s, done:!s.done} : s) })
  const remove = id => updateEntry({ séances: séances.filter(s => s.id!==id) })
  const updateNote = (id, note) => updateEntry({ séances: séances.map(s => s.id===id ? {...s, note} : s) })
  const reset = () => updateEntry({ séances: [] })

  const done = séances.filter(s => s.done).length
  const totalMin = séances.filter(s => s.done && s.durée).reduce((a,s) => a + parseInt(s.durée||0), 0)
  const totalVolume = séances.filter(s => s.done && s.séries && s.reps && s.poids)
    .reduce((a,s) => a + (parseInt(s.séries||0) * parseInt(s.reps||0) * parseFloat(s.poids||0)), 0)
  const calories = séances.filter(s => s.done).reduce((a,s) => {
    const met = MET[s.type] || 5
    const min = parseInt(s.durée||0) || (s.séries && s.reps ? parseInt(s.séries||0) * parseInt(s.reps||0) * 0.05 : 0)
    return'a + Math.round(met * 70 * min / 60)
  }, 0)

  return (
    <div className="space-y-3 fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-bold text-lg">Séance du jour</h2>
          <div className="flex items-center gap-2">
            {totalMin > 0 && <span className="flex items-center gap-1 text-white/50 text-xs"><Timer size={11}/> {totalMin} min</span>}
            {calories > 0 && <span className="flex items-center gap-1 text-orange-400/70 text-xs"><Flame size={11}/> ~{calories} kcal</span>}
            <span className="text-white/50 text-xs">{done}/{séances.length}</span>
          </div>
        </div>

        {séances.length > 0 && (
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mb-4">
            <div className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${Math.round((done/séances.length)*100)}%` }} />
          </div>
        )}

        {totalVolume > 0 && (
          <div className="mb-3 px-3 py-2 rounded-xl text-xs text-white/40" style={{ background:"rgba(139,92,246,0.06)", border:"1px solid rgba(139,92,246,0.1)" }}>
            Volume total : <span className="text-white/60 font-medium">{Math.round(totalVolume).toLocaleString()} kg</span>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={() => { setShowForm(!showForm); setShowTemplates(false) }}
            className="flex-1 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <Plus size={14}/> Exercice
          </button>
          <button onClick={() => { setShowTemplates(!showTemplates); setShowForm(false) }}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <Zap size={14}/> Templates
          </button>
          {séances.length > 0 && (
            <button onClick={reset} className="flex items-center gap-1 text-xs text-white/30 hover:text-red-400 transition-colors">
              <RotateCcw size={12}/> Reset
            </button>
          )}
        </div>

        {showTemplates && (
          <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
            <p className="text-white/40 text-xs mb-2">Choisir un template</p>
            {TEMPLATES.map((tpl, i) => (
              <button key={i} onClick={() => loadTemplate(tpl)}
                className="w-full text-left px-3 py-2.5 rounded-xl border border-white/[0.06] hover:border-white/20 transition-all text-sm text-white/70 hover:text-white">
                {tpl.emoji} {tpl.label}
                <span className="ml-2 text-white/30 text-xs">{tpl.exercices.length} exercices</span>
              </button>
            ))}
          </div>
        )}

        {showForm && (
          <div className="mt-4 space-y-3 border-t border-white/[0.06] pt-4">
            <div className="flex gap-2">
              <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} className="input w-32 flex-shrink-0">
                {TYPES.map(t => <option key={t.v} value={t.v}>{t.emoji} {t.l}</option>)}
              </select>
              <input value={form.nom} onChange={e => setForm(f=>({...f,nom:e.target.value}))}
                placeholder="Nom (ex: Squat, Course...)" className="input flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input value={form.durée} onChange={e => setForm(f=>({...f,durée:e.target.value}))}
                placeholder="Durée (min)" type="number" className="input" />
              <input value={form.séries} onChange={e => setForm(f=>({...f,séries:e.target.value}))}
                placeholder="Séries" type="number" className="input" />
              <input value={form.reps} onChange={e => setForm(f=>({...f,reps:e.target.value}))}
                placeholder="Reps" type="number" className="input" />
              <input value={form.poids} onChange={e => setForm(f=>({...f,poids:e.target.value}))}
                placeholder="Poids (kg)" type="number" className="input" />
            </div>
            <input value={form.note} onChange={e => setForm(f=>({...f,note:e.target.value}))}
              placeholder="Note (optionnel)" className="input w-full" />
            <div className="flex gap-2">
              <button onClick={add} className="btn-primary flex-1">Ajouter</button>
              <button onClick={() => setShowForm(false)} className="btn-outline">Annuler</button>
            </div>
          </div>
        )}
      </div>

      {séances.length === 0 ? (
        <div className="card text-center py-10 text-white/40 text-sm">Aucun exercice. Ajoute ta séance ou choisis un template !</div>
      ) : (
        <div className="space-y-2">
          {séances.map(s => {
            const t = TYPES.find(t => t.v===s.type) || TYPES[6]
            return (
              <div key={s.id} className={`card transition-all ${s.done ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggle(s.id)} className="flex-shrink-0">
                    {s.done ? <CheckCircle2 size={20} className="text-white/40"/> : <Circlé size={20} className="text-white/40"/>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium ${s.done ? "line-through text-white/40" : "text-white/80"}`}>
                      {t.emoji} {s.nom}
                    </span>
                    <div className="flex gap-3 mt-0.5 text-xs text-white/40 flex-wrap">
                      {s.durée && <span><Timer size={10} className="inline mr-0.5"/>{s.durée} min</span>}
                      {s.séries && <span>{s.séries} séries</span>}
                      {s.reps && <span>× {s.reps} reps</span>}
                      {s.poids && <span>{s.poids} kg</span>}
                      {s.séries && s.reps && s.poids && (
                        <span className="text-purple-400/60">Vol: {Math.round(parseInt(s.séries)*parseInt(s.reps)*parseFloat(s.poids))} kg</span>
                      )}
                    </div>
                    {s.note && <p className="text-xs text-white/30 mt-1 italic">{s.note}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setShowNote(showNote===s.id ? null : s.id)} className="btn-ghost p-1.5">
                      <FileText size={13} className={s.note ? "text-purple-400/60" : ""}/>
                    </button>
                    <button onClick={() => remove(s.id)} className="btn-ghost p-1.5">
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </div>
                {showNote === s.id && (
                  <div className="mt-2 pt-2 border-t border-white/[0.06]">
                    <input value={s.note||""} onChange={e => updateNote(s.id, e.target.value)}
                      placeholder="Ajouter une note..." className="input w-full text-xs" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {done === séances.length && séances.length > 0 && (
        <div className="card text-center py-4" style={{ border:"1px solid rgba(139,92,246,0.2)" }}>
          <p className="text-white/70 text-sm">🔥 Séance complète !</p>
          <p className="text-white/40 text-xs mt-1">
            {totalMin > 0 && `${totalMin} min · `}
            {totalVolume > 0 && `${Math.round(totalVolume).toLocaleString()} kg de volume · `}
            {calories > 0 && `~${calories} kcal`}
          </p>
        </div>
      )}
    </div>
  )
}