import { useState, useCallback, useMemo, lazy, Suspense } from "react" // trakova
import { useSupabaseData } from "./hooks/useSupabaseData"
import { useTheme } from "./context/ThemeContext"
import GoalSelector from "./components/GoalSelector"
const DailyCheck = lazy(() => import("./components/DailyCheck"))
import Missions from "./components/Missions"
const ProgressCalendar = lazy(() => import("./components/ProgressCalendar"))
const ProgressChart = lazy(() => import("./components/ProgressChart"))
const ExportPDF = lazy(() => import("./components/ExportPDF"))
import Notifications from "./components/Notifications"
import Resources from "./components/Resources"
import Devoirs from "./components/Devoirs"
const MesFichiers = lazy(() => import("./components/MesFichiers"))
const Gamification = lazy(() => import("./components/Gamification"))
import Seance from "./components/Seance"
const WeekSummary = lazy(() => import("./components/WeekSummary"))
const AmbientSound = lazy(() => import("./components/AmbientSound"))
const FocusMode = lazy(() => import("./components/FocusMode"))
const SettingsPage = lazy(() => import("./components/SettingsPage"))
const HistoryPage = lazy(() => import("./components/HistoryPage"))
const Onboarding = lazy(() => import("./components/Onboarding"))
import Idees from "./components/Idees"
import { useGamification } from "./hooks/useGamification"
import { getGoalById } from "./lib/goals"
import { parseISO, isToday, isPast } from "date-fns"
import { CheckSquare, Target, Calendar, BarChart2, BookOpen, ClipboardList, Settings, X, Flame, FolderOpen, Zap, LogOut, Dumbbell, Lightbulb, Apple, ListTodo, RefreshCw } from "lucide-react"

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
    { id:"history",   label:"Historique",  icon:Calendar },
  ],
  sport: [
    { id:"seance",    label:"Séance",        icon:Dumbbell },
    { id:"missions",  label:"Entraînements", icon:Target },
    { id:"resources", label:"Nutrition",     icon:Apple },
    { id:"calendar",  label:"Calendrier",    icon:Calendar },
    { id:"stats",     label:"Stats",         icon:BarChart2 },
    { id:"fichiers",  label:"Fichiers",      icon:FolderOpen },
    { id:"xp",        label:"XP",          icon:Zap },
    { id:"history",   label:"Historique",  icon:Calendar },
  ],
  creative: [
    { id:"today",     label:"Aujourd'hui", icon:CheckSquare },
    { id:"idees",     label:"Idées",        icon:Lightbulb },
    { id:"missions",  label:"Missions",     icon:Target },
    { id:"resources", label:"Inspiration",  icon:BookOpen },
    { id:"calendar",  label:"Calendrier",   icon:Calendar },
    { id:"stats",     label:"Stats",        icon:BarChart2 },
    { id:"fichiers",  label:"Fichiers",     icon:FolderOpen },
    { id:"xp",        label:"XP",          icon:Zap },
    { id:"history",   label:"Historique",  icon:Calendar },
  ],
  organization: [
    { id:"today",     label:"Aujourd'hui", icon:CheckSquare },
    { id:"devoirs",   label:"Tâches",       icon:ListTodo },
    { id:"missions",  label:"Projets",      icon:Target },
    { id:"resources", label:"Outils",       icon:BookOpen },
    { id:"calendar",  label:"Calendrier",   icon:Calendar },
    { id:"stats",     label:"Stats",        icon:BarChart2 },
    { id:"fichiers",  label:"Fichiers",     icon:FolderOpen },
    { id:"xp",        label:"XP",          icon:Zap },
    { id:"history",   label:"Historique",  icon:Calendar },
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
  const { theme } = useTheme()
  const { data, today, setGoal, resetGoal, getTodayEntry, updateEntry, toggleTask, updateMissions, updateNotifications, updateDevoirs, loading } = useSupabaseData(user?.id)
  const { g, onTaskComplete, onFocusComplete } = useGamification()
  const [tab, setTab] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showFocus, setShowFocus] = useState(false)
  const [confetti, setConfetti] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem("gt_onboarded") } catch { return false }
  })

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

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background:"#0A0A0F" }}><div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"/></div>
  if (!data.goal) return <GoalSelector onSelect={setGoal} />

  const goal = getGoalById(data.goal)
  const tabs = TABS_BY_GOAL[data.goal] || TABS_BY_GOAL.homework
  const activeTab = tab && tabs.find(t => t.id === tab) ? tab : tabs[0].id
  const devoirsRaw = data.devoirs || []
  const urgentCount = devoirsRaw.filter(d => !d.done && d.date && (isToday(parseISO(d.date)) || isPast(parseISO(d.date)))).length
  const streakBig = data.streak >= 7

  return (
    <div className="min-h-screen" style={{ background: theme === "light" ? "#f0f0f5" : "#0A0A0F" }}>
      {confetti.map(p => <ConfettiParticle key={p.id} {...p} />)}

      <header className="sticky top-0 z-40 px-4 pt-4 pb-0"
        style={{ background: theme === "light" ? "rgba(240,240,245,0.97)" : "rgba(12,12,20,0.95)", borderBottom: theme === "light" ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(139,92,246,0.1)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Trakova" style={{ height:"60px", width:"auto" }} className="flex-shrink-0" />
          </div>
          <div className="flex items-center gap-1">
            <ExportPDF data={data} />
            <button onClick={() => { resetGoal() }} className="btn-ghost" title="Changer d'objectif"><RefreshCw size={16} /></button>
            <button onClick={() => setShowFocus(true)} className="btn-ghost" title="Mode Focus" style={{ color: showFocus ? "#8b5cf6" : "" }}><Zap size={16} /></button>
            <button onClick={() => setShowSettings(true)} className="btn-ghost"><Settings size={16} /></button>
          </div>
        </div>
        <nav className="max-w-2xl mx-auto flex overflow-x-auto gap-0 -mb-px scrollbar-hide"
          style={{ cursor: "grab", WebkitOverflowScrolling: "touch" }}
          onMouseDown={e => {
            const el = e.currentTarget
            const startX = e.pageX - el.offsetLeft
            const scrollLeft = el.scrollLeft
            let dragging = false
            const onMove = mv => {
              const dx = Math.abs(mv.pageX - el.offsetLeft - startX)
              if (dx > 5) { dragging = true; el.style.cursor = "grabbing"; el.scrollLeft = scrollLeft - (mv.pageX - el.offsetLeft - startX) }
            }
            const onUp = () => {
              el.style.cursor = "grab"
              window.removeEventListener("mousemove", onMove)
              window.removeEventListener("mouseup", onUp)
            }
            window.addEventListener("mousemove", onMove)
            window.addEventListener("mouseup", onUp)
          }}>
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

      <main className="max-w-2xl mx-auto p-4 pb-8"><Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"/></div>}>
        <div className={activeTab === "today" ? "tab-content" : "hidden"}><Suspense fallback={null}><WeekSummary data={data} /></Suspense><Suspense fallback={null}><AmbientSound /></Suspense><DailyCheck data={data} today={today} getTodayEntry={getTodayEntry} toggleTask={toggleTask} updateEntry={updateEntry} onTaskComplete={handleTaskComplete} onFocusComplete={onFocusComplete} showPomodoro={data.goal === "homework"} /></div>
        <div className={activeTab === "seance" ? "tab-content" : "hidden"}><Seance data={data} updateEntry={updateEntry} getTodayEntry={getTodayEntry} /></div>
        <div className={activeTab === "idees" ? "tab-content" : "hidden"}><Idees /></div>
        <div className={activeTab === "devoirs" ? "tab-content" : "hidden"}><Devoirs devoirs={data.devoirs || []} updateDevoirs={updateDevoirs} goalId={data.goal} /></div>
        <div className={activeTab === "missions" ? "tab-content" : "hidden"}><Missions data={data} updateMissions={updateMissions} /></div>
        <div className={activeTab === "resources" ? "tab-content" : "hidden"}><Resources goalId={data.goal} /></div>
        <div className={activeTab === "calendar" ? "tab-content" : "hidden"}><ProgressCalendar data={data} /></div>
        <div className={activeTab === "stats" ? "tab-content" : "hidden"}><ProgressChart data={data} /></div>
        <div className={activeTab === "fichiers" ? "tab-content" : "hidden"}><MesFichiers goalId={data.goal} /></div>
        <div className={activeTab === "xp" ? "tab-content" : "hidden"}><Gamification /></div>
        <div className={activeTab === "history" ? "tab-content" : "hidden"}><HistoryPage data={data} /></div>
      </Suspense></main>

      {showFocus && (
        <Suspense fallback={null}>
          <FocusMode data={data} getTodayEntry={getTodayEntry} toggleTask={toggleTask} updateEntry={updateEntry} onClose={() => setShowFocus(false)} onFocusComplete={onFocusComplete} />
        </Suspense>
      )}
      {showOnboarding && (
        <Suspense fallback={null}>
          <Onboarding onDone={() => { localStorage.setItem("gt_onboarded","1"); setShowOnboarding(false) }} />
        </Suspense>
      )}
      {showSettings && (
        <Suspense fallback={null}>
          <SettingsPage
            user={user}
            data={data}
            onLogout={onLogout}
            resetGoal={() => { resetGoal(); setShowSettings(false) }}
            onClose={() => setShowSettings(false)}
          />
        </Suspense>
      )}
    </div>
  )
}
