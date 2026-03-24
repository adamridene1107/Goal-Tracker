import { useState, useCallback } from "react"
import { useTrakova } from "./hooks/useTrakova"
import GoalSelector from "./components/GoalSelector"
import DailyCheck from "./components/DailyCheck"
import Missions from "./components/Missions"
import ProgressCalendar from "./components/ProgressCalendar"
import ProgressChart from "./components/ProgressChart"
import ExportPDF from "./components/ExportPDF"
import Notifications from "./components/Notifications"
import Resources from "./components/Resources"
import Devoirs from "./components/Devoirs"
import MesFichiers from "./components/MesFichiers"
import Gamification from "./components/Gamification"
import Seance from "./components/Seance"
import Idees from "./components/Idees"
import { useGamification } from "./hooks/useGamification"
import { getGoalById } from "./lib/goals"
import { parseISO, isToday, isPast } from "date-fns"
import { CheckSquare, Target, Calendar, BarChart2, BookOpen, ClipboardList, Settings, X, Flame, FolderOpen, Zap, LogOut, Dumbbell, Lightbulb, Apple, ListTodo } from "lucide-react"

const TABS_BY_GOAL = {
  homework: [
    { id:"today",     label:"Aujourd'hui", icon:CheckSquare },
    { id:"devoirs",   label:"Devoirs",     icon:ClipboardList },
    { id:"missions",  label:"Missions",    icon:Target },
    { id:"resources", label:"Ressources",  icon:BookOpen },
    { id:"calendar",  label:"Calendrier",  icon:Calendar },
    { id:"stats",     label:"Stats",       icon:BarChart2 },
    { id:"fichiers",  label:"Fichiers",    icon:FolderOpen },
    { id:"xp",        label:"XP",          icon:Zap },
  ],
  sport: [
    { id:"seance",    label:"Séance",        icon:Dumbbell },
    { id:"missions",  label:"Entraînements", icon:Target },
    { id:"resources", label:"Nutrition",     icon:Apple },
    { id:"calendar",  label:"Calendrier",    icon:Calendar },
    { id:"stats",     label:"Stats",         icon:BarChart2 },
    { id:"fichiers",  label:"Fichiers",      icon:FolderOpen },
    { id:"xp",        label:"XP",            icon:Zap },
  ],
  creative: [
    { id:"today",     label:"Aujourd'hui", icon:CheckSquare },
    { id:"idees",     label:"Idées",        icon:Lightbulb },
    { id:"missions",  label:"Missions",     icon:Target },
    { id:"resources", label:"Inspiration",  icon:BookOpen },
    { id:"calendar",  label:"Calendrier",   icon:Calendar },
    { id:"stats",     label:"Stats",        icon:BarChart2 },
    { id:"fichiers",  label:"Fichiers",     icon:FolderOpen },
    { id:"xp",        label:"XP",           icon:Zap },
  ],
  organization: [
    { id:"today",     label:"Aujourd'hui", icon:CheckSquare },
    { id:"devoirs",   label:"Tâches",       icon:ListTodo },
    { id:"missions",  label:"Projets",      icon:Target },
    { id:"resources", label:"Outils",       icon:BookOpen },
    { id:"calendar",  label:"Calendrier",   icon:Calendar },
    { id:"stats",     label:"Stats",        icon:BarChart2 },
    { id:"fichiers",  label:"Fichiers",     icon:FolderOpen },
    { id:"xp",        label:"XP",           icon:Zap },
  ],
}

function ConfettiParticle({ x, y, color, delay, size, round }) {
  return (
    <div className="confetti-particle" style={{
      left: x, top: y, background: color, width: size, height: size,
      animationDelay: delay + "ms", borderRadius: round ? "50%" : "2px",
    }} />
  )
}

export default function App({ user, onLogout }) {
  const { data, today, setGoal, resetGoal, getTodayEntry, updateEntry, toggleTask, updateMissions, updateNotifications, updateDevoirs } = useTrakova()
  const { g, onTaskComplete, onFocusComplete } = useGamification()
  const [tab, setTab] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [confetti, setConfetti] = useState([])

  const spawnConfetti = useCallback(() => {
    const colors = ["#8b5cf6","#6366f1","#a78bfa","#818cf8","#f472b6","#34d399","#fbbf24"]
    const cx = window.innerWidth / 2, cy = window.innerHeight / 3
    const items = Array.from({ length: 26 }, (_, i) => ({
      id: Date.now() + i,
      x: cx + (Math.random() - 0.5) * 200,
      y: cy + (Math.random() - 0.5) * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 300,
      size: 6 + Math.random() * 7,
      round: Math.random() > 0.5,
    }))
    setConfetti(items)
    setTimeout(() => setConfetti([]), 1400)
  }, [])

  const handleTaskComplete = useCallback(() => {
    onTaskComplete?.()
    spawnConfetti()
  }, [onTaskComplete, spawnConfetti])

  if (!data.goal) return <GoalSelector onSelect={setGoal} />

  const goal = getGoalById(data.goal)
  const tabs = TABS_BY_GOAL[data.goal] || TABS_BY_GOAL.homework
  const activeTab = tab && tabs.find(t => t.id === tab) ? tab : tabs[0].id
  const devoirsRaw = data.devoirs || []
  const urgentCount = devoirsRaw.filter(d => !d.done && d.date && (isToday(parseISO(d.date)) || isPast(parseISO(d.date)))).length
  const streakBig = data.streak >= 7

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0F" }}>
      {confetti.map(p => <ConfettiParticle key={p.id} {...p} />)}

      <header className="sticky top-0 z-40 px-4 pt-4 pb-0"
        style={{ background: "rgba(12,12,20,0.95)", borderBottom: "1px solid rgba(139,92,246,0.1)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Trakova" className="h-10 flex-shrink-0" />
          </div>
          <div className="flex items-center gap-1">
            <ExportPDF data={data} />
            <button onClick={() => setShowSettings(true)} className="btn-ghost"><Settings size={16} /></button>
            <button onClick={onLogout} className="btn-ghost" title="Déconnexion"><LogOut size={16} /></button>
          </div>
        </div>
        <nav className="max-w-2xl mx-auto flex overflow-x-auto gap-0 -mb-px scrollbar-hide">
          {tabs.map(t => {
            const Icon = t.icon
            const active = activeTab === t.id
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className={`nav-tab ${active ? "active" : ""}`}>
                <Icon size={13} />
                <span className="hidden sm:inline">{t.label}</span>
                {t.id === "devoirs" && urgentCount > 0 && (
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold leading-none"
                    style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)", color: "white" }}>
                    {urgentCount > 9 ? "9+" : urgentCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-8">
        <div className={activeTab === "today"     ? "" : "hidden"}><DailyCheck data={data} today={today} getTodayEntry={getTodayEntry} toggleTask={toggleTask} updateEntry={updateEntry} onTaskComplete={handleTaskComplete} onFocusComplete={onFocusComplete} showPomodoro={data.goal === "homework"} /></div>
        <div className={activeTab === "seance"    ? "" : "hidden"}><Seance data={data} updateEntry={updateEntry} getTodayEntry={getTodayEntry} /></div>
        <div className={activeTab === "idees"     ? "" : "hidden"}><Idees /></div>
        <div className={activeTab === "devoirs"   ? "" : "hidden"}><Devoirs devoirs={data.devoirs || []} updateDevoirs={updateDevoirs} goalId={data.goal} /></div>
        <div className={activeTab === "missions"  ? "" : "hidden"}><Missions data={data} updateMissions={updateMissions} /></div>
        <div className={activeTab === "resources" ? "" : "hidden"}><Resources goalId={data.goal} /></div>
        <div className={activeTab === "calendar"  ? "" : "hidden"}><ProgressCalendar data={data} /></div>
        <div className={activeTab === "stats"     ? "" : "hidden"}><ProgressChart data={data} /></div>
        <div className={activeTab === "fichiers"  ? "" : "hidden"}><MesFichiers goalId={data.goal} /></div>
        <div className={activeTab === "xp"        ? "" : "hidden"}><Gamification /></div>
      </main>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md fade-up" style={{ background: "rgba(18,18,26,0.97)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: "1.25rem", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid rgba(139,92,246,0.08)" }}>
              <h2 className="font-semibold text-white text-sm">Paramètres</h2>
              <button onClick={() => setShowSettings(false)} className="btn-ghost"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <Notifications data={data} updateNotifications={updateNotifications} />
              <button onClick={() => { resetGoal(); setShowSettings(false) }} className="btn-outline w-full py-3 text-sm">
                Changer d'objectif
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}