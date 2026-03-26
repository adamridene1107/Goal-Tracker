import { createContext, useContext, useState } from "react"
import { getLang, setLang, LANGUAGES } from "../lib/i18n"

const LangContext = createContext({ lang: "fr", changeLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLang_] = useState(getLang)

  const changeLang = (code) => {
    setLang_(code)
    setLang(code)
    // RTL support
    document.documentElement.setAttribute("dir", LANGUAGES.find(l => l.code === code)?.rtl ? "rtl" : "ltr")
    document.documentElement.setAttribute("lang", code)
  }

  return <LangContext.Provider value={{ lang, changeLang }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)