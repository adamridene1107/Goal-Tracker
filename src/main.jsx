import React, { useState, lazy, Suspense } from "react"
import { ThemeProvider } from "./context/ThemeContext"
import ReactDOM from "react-dom/client"
import "./index.css"

const App = lazy(() => import("./App"))
const Subscription = lazy(() => import("./components/Subscription"))
const SuccessPage = lazy(() => import("./components/SuccessPage"))
const TrialExpired = lazy(() => import("./components/TrialExpired"))
const AdminPage = lazy(() => import("./components/AdminPage"))
const LandingPage = lazy(() => import("./components/LandingPage"))
const AuthPage = lazy(() => import("./components/AuthPage"))
const LegalPage = lazy(() => import("./components/LegalPage"))

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background:"#0A0A0F" }}>
    <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"/>
  </div>
)

// Appliquer le theme sauvegarde
const savedTheme = (() => { try { return JSON.parse(localStorage.getItem("gt_settings") || "{}").theme || "dark" } catch { return "dark" } })()
if (savedTheme === "light") {
  document.documentElement.setAttribute("data-theme", "light")
  document.body.style.background = "#f8f8ff"
}

function getSession() {
  try { return JSON.parse(localStorage.getItem("gt_session")) } catch { return null }
}

function Root() {
  const path = window.location.pathname
  const [session, setSession] = useState(getSession)

  return (
    <Suspense fallback={<Spinner />}>
      {path === "/subscribe" ? <Subscription /> :
       path === "/success" ? <SuccessPage /> :
       path === "/trial-expired" ? <TrialExpired /> :
       path === "/admin" ? <AdminPage /> :
       path === "/privacy" ? <LegalPage type="privacy" /> :
       path === "/cgu" ? <LegalPage type="cgu" /> :
       path === "/login" ? <AuthPage onAuth={(u, isNew) => {
         if (isNew) { window.location.href = "/subscribe" }
         else { setSession(u); window.location.href = "/" }
       }} /> :
       !session ? <LandingPage onGetStarted={() => { window.location.href = "/login" }} /> :
       <App user={session} onLogout={() => { localStorage.removeItem("gt_session"); localStorage.removeItem("gt_settings"); window.location.href = "/" }} />}
    </Suspense>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><ThemeProvider><Root /></ThemeProvider></React.StrictMode>
)
