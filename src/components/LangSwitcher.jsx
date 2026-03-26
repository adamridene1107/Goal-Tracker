import { useState } from "react"
import { LANGUAGES } from "../lib/i18n"
import { useLang } from "../context/LangContext"

export default function LangSwitcher({ compact = false }) {
  const { lang, changeLang } = useLang()
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs transition-all hover:bg-white/[0.08]"
        style={{ color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.1)" }}>
        <span>{current.flag}</span>
        {!compact && <span>{current.label}</span>}
        <span className="text-white/30">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 rounded-xl overflow-hidden shadow-2xl"
          style={{ background:"rgba(18,18,26,0.98)", border:"1px solid rgba(139,92,246,0.2)", minWidth:"140px" }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => { changeLang(l.code); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-all hover:bg-white/[0.06]"
              style={{ color: lang===l.code ? "#a78bfa" : "rgba(255,255,255,0.6)", background: lang===l.code ? "rgba(139,92,246,0.1)" : "transparent" }}>
              <span>{l.flag}</span>
              <span>{l.label}</span>
              {lang===l.code && <span className="ml-auto text-violet-400">✓</span>}
            </button>
          ))}
        </div>
      )}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  )
}