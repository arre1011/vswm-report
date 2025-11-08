import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputWithInfo } from "@/components/ui/input-with-info"
import { Button } from "@/components/ui/button"

interface EmailFormData {
  email: string
  confirmEmail: string
}

export function EmailForm() {
  const [formData, setFormData] = useState<EmailFormData>({
    email: "",
    confirmEmail: "",
  })

  const [errors, setErrors] = useState<Partial<EmailFormData>>({})

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors: Partial<EmailFormData> = {}

    // E-Mail-Validierung
    if (!formData.email) {
      newErrors.email = "E-Mail-Adresse ist erforderlich"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein"
    }

    // Bestätigungs-E-Mail-Validierung
    if (!formData.confirmEmail) {
      newErrors.confirmEmail = "Bitte bestätigen Sie Ihre E-Mail-Adresse"
    } else if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = "Die E-Mail-Adressen stimmen nicht überein"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    console.log("E-Mail-Formular abgesendet:", formData)
    // Hier können Sie die Daten weiterverarbeiten
  }

  const handleChange = (field: keyof EmailFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    // Fehler beim Tippen zurücksetzen
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>E-Mail-Adresse</CardTitle>
        <CardDescription>
          Bitte geben Sie Ihre E-Mail-Adresse ein und bestätigen Sie diese.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputWithInfo
            id="email"
            label="E-Mail-Adresse"
            type="email"
            placeholder="max.mustermann@example.com"
            value={formData.email}
            onChange={handleChange("email")}
            required
            infoTitle="Informationen zum E-Mail-Feld"
            infoDescription="Geben Sie hier Ihre vollständige E-Mail-Adresse ein. Diese sollte im Format 'name@domain.com' sein. Achten Sie darauf, dass die E-Mail-Adresse korrekt geschrieben ist, da wir Ihnen möglicherweise wichtige Informationen an diese Adresse senden werden. Verwenden Sie eine E-Mail-Adresse, die Sie regelmäßig überprüfen."
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
              <span className="font-medium">⚠️</span>
              {errors.email}
            </p>
          )}

          <InputWithInfo
            id="confirmEmail"
            label="E-Mail-Adresse bestätigen"
            type="email"
            placeholder="max.mustermann@example.com"
            value={formData.confirmEmail}
            onChange={handleChange("confirmEmail")}
            required
            infoTitle="Informationen zur E-Mail-Bestätigung"
            infoDescription="Geben Sie hier Ihre E-Mail-Adresse erneut ein, um Tippfehler zu vermeiden. Die beiden E-Mail-Adressen müssen exakt übereinstimmen. Überprüfen Sie beide Felder sorgfältig, bevor Sie das Formular absenden."
            className={errors.confirmEmail ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.confirmEmail && (
            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
              <span className="font-medium">⚠️</span>
              {errors.confirmEmail}
            </p>
          )}

          <Button
            type="submit"
            className="w-full mt-6 hover:scale-105 transition-transform"
          >
            Absenden
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

