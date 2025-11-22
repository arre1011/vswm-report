import { useI18n, supportedLanguages, Language } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as Language)
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      Sprache:
      <select
        className="rounded-md border border-input bg-background px-2 py-1 text-foreground"
        value={language}
        onChange={handleChange}
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </label>
  )
}
