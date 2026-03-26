import { useState, useEffect } from "react"
import LangSwitcher from "./LangSwitcher"
import { Globe } from "lucide-react"
import { useThème } from "../context/ThèmeContext"
import { User, Bell, Palette, Target, Shield, CreditCard, ChevronRight, Check, Download, Trash2, X, LogOut } from "lucide-react"



function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t) }, [])
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm text-white flex items-center gap-2 fade-up"
      style={{ background:"rgba(139,92,246,0.9)", backdropFilter:"blur(12px)", boxShadow:"0 8px 32px rgba(139,92,246,0.3)" }}>
      <Check size={14}/> {msg}
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2 pb-3" style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <Icon size={15} className="text-violet-400" />
        <h3 className="text-white/80 font-semibold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className="relative flex-shrink-0 w-10 h-5 rounded-full transition-all duration-200"
      style={{ background: checked ? "#8b5cf6" : "rgba(255,255,255,0.1)" }}>
      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
        style={{ left: checked ? "calc(100% - 18px)" : "2px" }} />
    </button>
  )
}

function getUsers() { try { return JSON.parse(localStorage.getItem("gt_users") || "{}") } catch { return {} } }
function saveUsers(u) { localStorage.setItem("gt_users", JSON.stringify(u)) }
function getSettings() { try { return JSON.parse(localStorage.getItem("gt_settings") || "{}") } catch { return {} } }
function saveSettings(s) { localStorage.setItem("gt_settings", JSON.stringify(s)) }

export default function SettingsPage({ user, data, onLogout, resetGoal, onClose }) {
  const [toast, setToast] = useState("")
  const [section, setSection] = useState("profil")

  const settings = getSettings()
  const [name, setName] = useState(user?.name || "")
  const [email] = useState(user?.email || "")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [pwdError, setPwdError] = useState("")

  const [notifDaily, setNotifDaily] = useState(settings.notifDaily ?? true)
  const [notifHour, setNotifHour] = useState(settings.notifHour || "08:00")
  const [notifWeekly, setNotifWeekly] = useState(settings.notifWeekly ?? false)
  const [notifStreak, setNotifStreak] = useState(settings.notifStreak ?? true)

  const { thème, setThème } = useThème()
  const [streakGoal, setStreakGoal] = useState(settings.streakGoal || 7)

  const [deleteConfirm, setDeleteConfirm] = useState(0)
  const [cancelStatus, setCancelStatus] = useState("") // "" | "confirm" | "loading" | "done"
  const [cancelEndDate, setCancelEndDate] = useState("")

  const toast_ = (msg) => setToast(msg)

  const cancelSub = async () => {
    if (cancelStatus === "") { setCancelStatus("confirm"); return }
    if (cancelStatus === "confirm") {
      setCancelStatus("loading")
      try {
        const res = await fetch("/api/cancel-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        })
        const data = await res.json()
        if (!res.ok) { toast_(data.error || "Erreur"); setCancelStatus(""); return }
        setCancelEndDate(data.endDate)
        setCancelStatus("done")
        toast_("Abonnément résilié — actif jusqu'au " + data.endDate)
      } catch(e) { toast_("Erreur réseau"); setCancelStatus("") }
    }
  }

  const saveProfil = () => {
    if (!name.trim()) return
    const users = getUsers()
    if (users[email]) { users[email].name = name.trim(); saveUsers(users) }
    const session = JSON.parse(localStorage.getItem("gt_session") || "{}")
    localStorage.setItem("gt_session", JSON.stringify({ ...session, name: name.trim() }))
    toast_("Profil mis à jour")
  }

  const savePassword = () => {
    setPwdError("")
    if (newPwd.length < 6) return setPwdError("6 caractères minimum")
    if (newPwd !== confirmPwd) return setPwdError("Les mots de passe ne correspondent pas")
    const users = getUsers()
    if (users[email]) { users[email].password = newPwd; saveUsers(users) }
    setNewPwd(""); setConfirmPwd("")
    toast_("Mot de passe mis à jour")
  }

  const requestNotifPermission = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission()
      if (perm === "granted") toast_("Notifications activées !")
      else toast_("Notifications refusées")
    }
  }

  const saveNotifs = () => {
    saveSettings({ ...getSettings(), notifDaily, notifHour, notifWeekly, notifStreak })
    toast_("Notifications sauvegardées")
  }

  const applyThème = (t) => { setThème(t); toast_(t === "dark" ? "Thème sombre activé" : "Thème clair activé") }

  const saveObjectifs = () => {
    saveSettings({ ...getSettings(), streakGoal })
    toast_("Objectif de streak sauvegardé")
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ user, data, settings: getSettings() }, null, 2)], { type:"application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "trackova-data.json"; a.click()
    URL.revokeObjectURL(url)
    toast_("Données exportées")
  }

  const deleteAccount = () => {
    if (deleteConfirm < 2) { setDeleteConfirm(d => d + 1); return }
    const users = getUsers()
    delete users[email]
    saveUsers(users)
    localStorage.removeItem("gt_session")
    localStorage.removeItem("gt_settings")
    onLogout()
  }

  const SECTIONS = [
    { id:"profil",    label:"Profil",           icon:User },
    { id:"notifs",    label:"Notifications",    icon:Bell },
    { id:"apparence", label:"Apparence",        icon:Palette },
    { id:"objectifs", label:"Objectifs",        icon:Target },
    { id:"privacy",   label:"Confidentialité",  icon:Shield },
    { id:"abo",       label:"Abonnément",       icon:CreditCard },
  ]

  return (
    <div className="fixed inset-0 z-50 flex" style={{ background:"rgba(0,0,0,0.8)", backdropFilter:"blur(8px)" }}>
      <div className="m-auto w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden fade-up"
        style={{ background:"rgba(12,12,20,0.98)", border:"1px solid rgba(139,92,246,0.15)", boxShadow:"0 32px 80px rgba(0,0,0,0.7)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-white font-bold text-base">Paramètres</h2>
          <button onClick={onClose} className="btn-ghost"><X size={16}/></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-44 flex-shrink-0 p-3 space-y-0.5" style={{ borderRight:"1px solid rgba(255,255,255,0.06)" }}>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setSection(s.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all text-left"
                style={{ background: section===s.id ? "rgba(139,92,246,0.15)" : "transparent", color: section===s.id ? "#a78bfa" : "rgba(255,255,255,0.4)" }}>
                <s.icon size={13}/> {s.label}
              </button>
            ))}

          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {section === "profil" && (
              <Section icon={User} title="Profil">
                <div className="space-y-3">
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">Prénom</label>
                    <input value={name} onChange={e => setName(e.target.value)} className="input w-full" placeholder="Ton prénom" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">Email</label>
                    <input value={email} disabled className="input w-full opacity-40 cursor-not-allowed" />
                  </div>
                  <div className="flex gap-2">
                  <button onClick={saveProfil} className="btn-primary text-sm py-2 px-4">Sauvegarder</button>
                  <button onClick={() => { navigator.clipboard.writeText("https://trackova.vercel.app/profile/" + (user?.id||"")); toast_("Lien copié !") }} className="btn-outline text-sm py-2 px-4">Partager mon profil</button>
                </div>
                </div>
                <div className="space-y-3 pt-4" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-white/40 text-xs font-medium">Changer le mot de passe</p>
                  <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} className="input w-full" placeholder="Nouveau mot de passe" />
                  <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} className="input w-full" placeholder="Confirmer" />
                  {pwdError && <p className="text-red-400 text-xs">{pwdError}</p>}
                  <button onClick={savePassword} className="btn-outline text-sm py-2 px-4">Mettre à jour</button>
                </div>
                <div className="pt-4" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-red-400/70 hover:text-red-400 transition-colors"
                    style={{ border:"1px solid rgba(239,68,68,0.15)", background:"rgba(239,68,68,0.05)" }}>
                    <LogOut size={14}/> Se déconnectér
                  </button>
                </div>
              </Section>
            )}

            {section === "notifs" && (
              <Section icon={Bell} title="Notifications">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm">Rappel quotidien</p>
                      <p className="text-white/30 text-xs mt-0.5">Rappel pour faire ta séance du jour</p>
                    </div>
                    <Toggle checked={notifDaily} onChange={setNotifDaily} />
                  </div>
                  {notifDaily && (
                    <div className="flex items-center gap-3">
                      <label className="text-white/40 text-xs">Heure</label>
                      <input type="time" value={notifHour} onChange={e => setNotifHour(e.target.value)} className="input" />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm">Récap hebdomadaire</p>
                      <p className="text-white/30 text-xs mt-0.5">Résumé de ta semaine par email</p>
                    </div>
                    <Toggle checked={notifWeekly} onChange={setNotifWeekly} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm">Alerte streak</p>
                      <p className="text-white/30 text-xs mt-0.5">Prévenu si tu risques de perdre ta série</p>
                    </div>
                    <Toggle checked={notifStreak} onChange={setNotifStreak} />
                  </div>
                  <button onClick={requestNotifPermission} className="btn-outline text-sm py-2 px-4">
                    Activer les notifications navigateur
                  </button>
                  <button onClick={saveNotifs} className="btn-primary text-sm py-2 px-4">Sauvegarder</button>
                </div>
              </Section>
            )}

            {section === "apparence" && (
              <Section icon={Palette} title="Apparence">
                <div>
                  <p className="text-white/40 text-xs mb-3">Thème</p>
                  <div className="flex gap-3">
                    <button onClick={() => applyThème("dark")}
                      className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                      style={{ border: thème==="dark" ? "2px solid #8b5cf6" : "2px solid rgba(255,255,255,0.08)", background: thème==="dark" ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.03)" }}>
                      <div className="w-10 h-7 rounded-lg" style={{ background:"#0A0A0F", border:"1px solid rgba(255,255,255,0.1)" }}/>
                      <span className="text-white/60 text-xs">Sombre</span>
                    </button>
                    <button onClick={() => applyThème("light")}
                      className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                      style={{ border: thème==="light" ? "2px solid #8b5cf6" : "2px solid rgba(255,255,255,0.08)", background: thème==="light" ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.03)" }}>
                      <div className="w-10 h-7 rounded-lg" style={{ background:"#f8f8ff", border:"1px solid rgba(0,0,0,0.1)" }}/>
                      <span className="text-white/60 text-xs">Clair</span>
                    </button>
                  </div>
                </div>
              </Section>
            )}

            {section === "objectifs" && (
              <Section icon={Target} title="Objectifs">
                <div className="space-y-4">
                  <div>
                    <label className="text-white/40 text-xs mb-1.5 block">Objectif de streak (jours)</label>
                    <div className="flex items-center gap-3">
                      <input type="number" min="1" max="365" value={streakGoal} onChange={e => setStreakGoal(parseInt(e.target.value)||7)} className="input w-24" />
                      <span className="text-white/30 text-xs">jours consécutifs</span>
                    </div>
                  </div>
                  <button onClick={saveObjectifs} className="btn-primary text-sm py-2 px-4">Sauvegarder</button>
                  <div className="pt-4" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-white/40 text-xs mb-3">Réinitialiser la progression</p>
                    <button onClick={() => { if(window.confirm("Réinitialiser toute ta progression ?")) { resetGoal(); onClose() } }}
                      className="btn-outline text-sm py-2 px-4 text-red-400/70 border-red-400/20 hover:border-red-400/40">
                      Réinitialiser l'objectif actuel
                    </button>
                  </div>
                </div>
              </Section>
            )}

            {section === "privacy" && (
              <Section icon={Shield} title="Confidentialité & Compte">
                <div className="space-y-3">
                  <button onClick={exportData} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white transition-all"
                    style={{ border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)" }}>
                    <span className="flex items-center gap-2"><Download size={14}/> Exportér mes données (JSON)</span>
                    <ChevronRight size={14}/>
                  </button>
                  <a href="/cgu" target="_blank" className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white transition-all"
                    style={{ border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)" }}>
                    <span>Conditions Générales d'Utilisation</span>
                    <ChevronRight size={14}/>
                  </a>
                  <a href="/privacy" target="_blank" className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white transition-all"
                    style={{ border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)" }}>
                    <span>Politique de confidentialité</span>
                    <ChevronRight size={14}/>
                  </a>
                  <div className="pt-4" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-white/30 text-xs mb-3">Zone dangereuse</p>
                    <button onClick={deleteAccount}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
                      style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171" }}>
                      <Trash2 size={14}/>
                      {deleteConfirm === 0 ? "Supprimer mon compte" : deleteConfirm === 1 ? "Confirmer la suppression" : "Dernière confirmation — supprimer définitivement"}
                    </button>
                    {deleteConfirm > 0 && <p className="text-red-400/50 text-xs text-center mt-2">Cette action'est irréversible</p>}
                  </div>
                </div>
              </Section>
            )}

            {section === "langue" && (
              <Section icon={Globe} title="Langue">
                <p className="text-white/40 text-xs mb-4">Choisir la langue de l'application</p>
                <LangSwitcher />
              </Section>
            )}
            {section === "abo" && (
              <Section icon={CreditCard} title="Abonnément">
                <div className="space-y-4">
                  <div className="px-4 py-3 rounded-xl" style={{ background:"rgba(139,92,246,0.08)", border:"1px solid rgba(139,92,246,0.15)" }}>
                    <p className="text-violet-400 text-xs font-medium mb-1">Plan'actuel</p>
                    <p className="text-white font-bold">Trakova Premium — 6€/mois</p>
                    <p className="text-white/40 text-xs mt-1">Essai gratuit 7 jours · Sans engagement</p>
                  </div>
                  {cancelStatus === "done" ? (
                    <div className="px-4 py-3 rounded-xl text-sm text-amber-400" style={{ background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)" }}>
                      Abonnément résilié — accès jusqu'au {cancelEndDate}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button onClick={cancelSub} disabled={cancelStatus==="loading"}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all"
                        style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#f87171" }}>
                        {cancelStatus === "loading" ? <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"/> :
                         cancelStatus === "confirm" ? "Confirmer la résiliation" : "Résilier mon'abonnément"}
                      </button>
                      {cancelStatus === "confirm" && (
                        <div className="flex gap-2">
                          <p className="text-white/30 text-xs flex-1">Ton'accès reste actif jusqu'à la fin de la période en cours.</p>
                          <button onClick={() => setCancelStatus("")} className="text-white/30 text-xs hover:text-white/60">Annuler</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Section>
            )}

          </div>
        </div>
      </div>
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </div>
  )
}