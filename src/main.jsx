import React, { useState, lazy, Suspense, useEffect } from "react"
import { ThemeProvider } from "./context/ThemeContext"
import { supabase } from "./lib/supabase"
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
const ContactPage = lazy(() => import("./components/ContactPage"))
const NotFound = lazy(() => import("./components/NotFound"))

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background:"#0A0A0F" }}>
    <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"/>
  </div>
)

function Root() {
  const path = window.location.pathname
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    // Recuperer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    // Ecouter les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Pages publiques
  if (path === "/subscribe") return <Suspense fallback={<Spinner />}><Subscription /></Suspense>
  if (path === "/success") return <Suspense fallback={<Spinner />}><SuccessPage /></Suspense>
  if (path === "/trial-expired") return <Suspense fallback={<Spinner />}><TrialExpired /></Suspense>
  if (path === "/admin") return <Suspense fallback={<Spinner />}><AdminPage /></Suspense>
  if (path === "/privacy") return <Suspense fallback={<Spinner />}><LegalPage type="privacy" /></Suspense>
  if (path === "/cgu") return <Suspense fallback={<Spinner />}><LegalPage type="cgu" /></Suspense>
  if (path === "/contact") return <Suspense fallback={<Spinner />}><ContactPage /></Suspense>

  // Loading session
  if (session === undefined) return <Spinner />

  // Pas connecte
  if (!session) {
    if (path === "/login") return (
      <Suspense fallback={<Spinner />}>
        <AuthPage onAuth={(u, isNew) => {
          if (isNew) window.location.href = "/subscribe"
          else window.location.href = "/"
        }} />
      </Suspense>
    )
    return <Suspense fallback={<Spinner />}><LandingPage onGetStarted={() => { window.location.href = "/login" }} /></Suspense>
  }

  const user = { id: session.user.id, email: session.user.email, name: session.user.user_metadata?.name || session.user.email.split("@")[0] }

  return (
    <Suspense fallback={<Spinner />}>
      <App user={user} onLogout={async () => {
        await supabase.auth.signOut()
        const s = JSON.parse(localStorage.getItem("gt_settings") || "{}")
        s.theme = "dark"
        localStorage.setItem("gt_settings", JSON.stringify(s))
        window.location.href = "/"
      }} />
    </Suspense>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><ThemeProvider><Root /></ThemeProvider></React.StrictMode>
)