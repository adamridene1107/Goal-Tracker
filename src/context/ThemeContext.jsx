import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext({ theme: "dark", setTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme_] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gt_settings") || "{}").theme || "dark" } catch { return "dark" }
  })

  const setTheme = (t) => {
    setTheme_(t)
    try {
      const s = JSON.parse(localStorage.getItem("gt_settings") || "{}")
      s.theme = t
      localStorage.setItem("gt_settings", JSON.stringify(s))
    } catch {}
  }

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-theme", theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)