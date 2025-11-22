import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

export type Language = "en" | "de"

const translations = {
  en: {
    "generalInformation.sectionTitle": "Information on the report necessary for XBRL",
      "generalInformation.entityNameTitle": "Name of the reporting entity",
  },
  de: {
    "generalInformation.sectionTitle": "Informationen, die für XBRL notwendig sind",
      "generalInformation.entityNameTitle": "Name of the reporting entity deutsch",
  },
} as const

type TranslationKey = keyof (typeof translations)["en"]

interface I18nContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("de")

  const translate = useCallback(
    (key: TranslationKey) => {
      const fallback = translations.en[key]
      return translations[language]?.[key] ?? fallback ?? key
    },
    [language],
  )

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: translate,
    }),
    [language, translate],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

export const supportedLanguages: Array<{ value: Language; label: string }> = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
]
