import { useState } from "react"
import { useGamification, getLevel, LEVELS } from "../hooks/useGamification"
import { Zap, Flame, Trophy, Star, Plus, Trash2, Gift, Target, Clock, CheckSquare } from "lucide-react"


const BADGES = [
  { id:"first_task",   emoji:"⭐", label:"Premier pas",      desc:"Compléter ta première tâche",        xp:0,   streak:0,  tasks:1   },
  { id:"streak_3",     emoji:"🔥", label:"En feu",           desc:"3 jours de streak",                  xp:0,   streak:3,  tasks:0   },
  { id:"streak_7",     emoji:"🌟", label:"Une semaine",      desc:"7 jours de streak",                  xp:0,   streak:7,  tasks:0   },
  { id:"streak_30",    emoji:"💎", label:"Un mois",          desc:"30 jours de streak",                 xp:0,   streak:30, tasks:0   },
  { id:"xp_100",       emoji:"⚡", label:"Énergisé",         desc:"Atteindre 100 XP",                   xp:100, streak:0,  tasks:0   },
  { id:"xp_500",       emoji:"🏆", label:"Champion",         desc:"Atteindre 500 XP",                   xp:500, streak:0,  tasks:0   },
  { id:"xp_1000",      emoji:"👑", label:"Roi",              desc:"Atteindre 1000 XP",                  xp:1000,streak:0,  tasks:0   },
  { id:"tasks_10",     emoji:"✅", label:"Productif",        desc:"Compléter 10 tâches",                xp:0,   streak:0,  tasks:10  },
  { id:"tasks_50",     emoji:"🎯", label:"Focusé",           desc:"Compléter 50 tâches",                xp:0,   streak:0,  tasks:50  },
  { id:"tasks_100",    emoji:"🚀", label:"Inarrêtable",      desc:"Compléter 100 tâches",               xp:0,   streak:0,  tasks:100 },
  { id:"streak_14",    emoji:"🌈", label:"Deux semaines",    desc:"14 jours de streak",                 xp:0,   streak:14, tasks:0   },
  { id:"xp_2000",      emoji:"🦁", label:"Legendaire",       desc:"Atteindre 2000 XP",                  xp:2000,streak:0,  tasks:0   },
]

function isUnlocked(badge, g) {
  if (badge.xp > 0 && (g?.xp || 0) < badge.xp) return false
  if (badge.streak > 0 && (g?.streak || 0) < badge.streak) return false
  if (badge.tasks > 0 && (g?.totalTasks || 0) < badge.tasks) return false
  return true
}

function XPToast({ lastXP }) {
  if (!lastXP) return null
  return (
    <div className="fixed top-4 right-4 z-50 bg-[#1a1a1a] border border-white/10 rounded-2xl px-4 py-3 shadow-2xl fade-in">
      <div className="flex items-center gap-2">
        <Zap size={16} className="text-yellow-400" />
        <span className="text-white font-bold text-sm">+{lastXP.amount} XP</span>
      </div>
      <p className="text-white/50 text-xs mt-0.5">{lastXP.reasons.join(" · ")}</p>
      {/* Badges */}
      <div className="card">
        <h3 className="text-white/70 text-sm font-semibold mb-4">Badges</h3>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map(b => {
            const unlocked = isUnlocked(b, xpData)
            return (
              <div key={b.id} className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
                style={{ background: unlocked ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.03)", border: unlocked ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(255,255,255,0.06)", opacity: unlocked ? 1 : 0.4 }}>
                <span className="text-2xl" style={{ filter: unlocked ? "none" : "grayscale(1)" }}>{b.emoji}</span>
                <p className="text-white/70 text-[11px] font-medium text-center leading-tight">{b.label}</p>
                <p className="text-white/30 text-[10px] text-center leading-tight">{b.desc}</p>
                {unlocked && <span className="text-[9px] text-violet-400 font-medium">Débloqué</span>}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default function Gamification() {
  const { g, addReward, unlockReward, removeReward, setDailyGoal } = useGamification()
  const level = getLevel(g.xp)
  const [newReward, setNewReward] = useState({ name: "", cost: 100 })
  const [showAdd, setShowAdd] = useState(false)
  const [toast, setToast] = useState(null)

  const handleAddReward = () => {
    if (!newReward.name.trim()) return
    addReward({ name: newReward.name.trim(), cost: parseInt(newReward.cost) || 100 })
    setNewReward({ name: "", cost: 100 })
    setShowAdd(false)
  }

  const handleUnlock = (r) => {
    if (g.xp < r.cost) return
    unlockReward(r.id)
  }

  const nextStreakBonus = 3 - (g.streak % 3)

  return (
    <div className="space-y-3 fade-in">

      {toast && <XPToast lastXP={toast} />}

      {/* Niveau + XP */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">Niv. {level.level}</span>
              <span className="text-white/40 text-sm font-medium">{level.label}</span>
            </div>
            <p className="text-white/50 text-xs mt-0.5">{g.xp} XP total</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/[0.06] flex items-center justify-center">
            <Trophy size={24} className="text-white/60" />
          </div>
        </div>

        {level.next && (
          <>
            <div className="flex justify-between text-xs text-white/40 mb-1.5">
              <span>{level.xpInLevel} / {level.xpNeeded} XP</span>
              <span>Niv. {level.next.level} — {level.next.label}</span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${level.pct}%` }} />
            </div>
            <p className="text-white/30 text-xs mt-1.5">Encore {level.xpNeeded - level.xpInLevel} XP pour le niveau suivant</p>
          </>
        )}
        {!level.next && (
          <p className="text-white/50 text-sm font-medium">Niveau maximum atteint !</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card text-center py-3">
          <Flame size={18} className="text-white/40 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{g.streak}</p>
          <p className="text-white/40 text-[10px]">Streak</p>
        </div>
        <div className="card text-center py-3">
          <CheckSquare size={18} className="text-white/40 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{g.tasksComplèted}</p>
          <p className="text-white/40 text-[10px]">Tâches</p>
        </div>
        <div className="card text-center py-3">
          <Clock size={18} className="text-white/40 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{g.focusSessions}</p>
          <p className="text-white/40 text-[10px]">Sessions</p>
        </div>
      </div>

      {/* Objectif journalier */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-white/50" />
            <span className="text-white/70 text-sm font-semibold">Objectif du jour</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDailyGoal(Math.max(1, g.dailyGoal - 1))}
              className="w-6 h-6 rounded-lg bg-white/[0.06] text-white/50 hover:bg-white/10 transition-colors text-sm">-</button>
            <span className="text-white font-bold text-sm w-4 text-center">{g.dailyGoal}</span>
            <button onClick={() => setDailyGoal(g.dailyGoal + 1)}
              className="w-6 h-6 rounded-lg bg-white/[0.06] text-white/50 hover:bg-white/10 transition-colors text-sm">+</button>
          </div>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((g.dailyDone / g.dailyGoal) * 100))}%` }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-white/40 text-xs">{g.dailyDone} / {g.dailyGoal} tâches</span>
          {g.dailyDone >= g.dailyGoal
            ? <span className="text-white/60 text-xs">Objectif atteint ! +50 XP</span>
            : <span className="text-white/30 text-xs">+50 XP bonus a l atteinte</span>}
        </div>
      </div>

      {/* Streak info */}
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <Flame size={14} className="text-white/50" />
          <span className="text-white/70 text-sm font-semibold">Streak</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs">Actuel : <span className="text-white font-bold">{g.streak} jour{g.streak !== 1 ? "s" : ""}</span></p>
            <p className="text-white/50 text-xs">Meilleur : <span className="text-white font-bold">{g.bestStreak} jour{g.bestStreak !== 1 ? "s" : ""}</span></p>
          </div>
          <div className="text-right">
            <p className="text-white/30 text-xs">Prochain bonus streak</p>
            <p className="text-white/60 text-xs font-bold">dans {nextStreakBonus} jour{nextStreakBonus !== 1 ? "s" : ""} (+20 XP)</p>
          </div>
        </div>
      </div>

      {/* Récompenses */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gift size={14} className="text-white/50" />
            <span className="text-white/70 text-sm font-semibold">Récompenses</span>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-ghost p-1.5">
            <Plus size={14} />
          </button>
        </div>

        {showAdd && (
          <div className="flex gap-2 mb-3 flex-wrap border-b border-white/[0.06] pb-3">
            <input value={newReward.name} onChange={e => setNewReward(r => ({ ...r, name: e.target.value }))}
              placeholder="Ex: Regarder une série" className="input flex-1 min-w-0 text-sm" />
            <input value={newReward.cost} onChange={e => setNewReward(r => ({ ...r, cost: e.target.value }))}
              type="number" min="10" placeholder="Cout XP" className="input w-24 flex-shrink-0 text-sm" />
            <button onClick={handleAddReward} className="btn-primary px-3 text-sm">Ajouter</button>
          </div>
        )}

        {g.rewards.length === 0 ? (
          <p className="text-white/30 text-xs text-center py-3">Ajoute des récompenses a débloquér avec tes XP.</p>
        ) : (
          <div className="space-y-2">
            {g.rewards.map(r => {
              const canUnlock = g.xp >= r.cost && !r.unlocked
              const missing = r.cost - g.xp
              return (
                <div key={r.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  r.unlocked ? "border-white/[0.08] opacity-50" : "border-white/[0.06]"
                }`}>
                  <Star size={14} className={r.unlocked ? "text-white/30" : "text-white/50"} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${r.unlocked ? "line-through text-white/30" : "text-white/70"}`}>{r.name}</p>
                    {!r.unlocked && (
                      <p className="text-[10px] text-white/40">
                        {canUnlock ? "Disponible !" : `Encore ${missing} XP`}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-white/40 flex-shrink-0">{r.cost} XP</span>
                  {!r.unlocked && (
                    <button onClick={() => handleUnlock(r)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                        canUnlock ? "bg-white text-black hover:bg-white/90" : "bg-white/[0.06] text-white/30 cursor-not-allowed"
                      }`}>
                      {canUnlock ? "Débloquér" : "Locked"}
                    </button>
                  )}
                  <button onClick={() => removeReward(r.id)} className="btn-ghost p-1 flex-shrink-0">
                    <Trash2 size={12} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Historique XP */}
      {g.history && g.history.length > 0 && (
        <div className="card">
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Historique XP</p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {[...g.history].reverse().slice(0, 15).map((h, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-white/40">{h.reason}</span>
                <span className="text-white/60 font-medium">+{h.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}