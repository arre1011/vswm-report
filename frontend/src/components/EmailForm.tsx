import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputWithInfo } from "@/components/ui/input-with-info"
import { useWizard } from "@/contexts/WizardContext"

export function EmailForm() {
  const { data, updateEmailData } = useWizard()
  const [errors, setErrors] = useState<{ email?: string; confirmEmail?: string }>({})

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (field: "email" | "confirmEmail") => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateEmailData({ [field]: e.target.value })
    
    // Validierung beim Tippen
    if (field === "email" && e.target.value) {
      if (!validateEmail(e.target.value)) {
        setErrors((prev) => ({ ...prev, email: "Ungültige E-Mail-Adresse" }))
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }))
      }
    }
    
    if (field === "confirmEmail" && e.target.value) {
      if (data.email && e.target.value !== data.email) {
        setErrors((prev) => ({ ...prev, confirmEmail: "E-Mail-Adressen stimmen nicht überein" }))
      } else {
        setErrors((prev) => ({ ...prev, confirmEmail: undefined }))
      }
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
        <div className="space-y-6">
          <InputWithInfo
            id="email"
            label="E-Mail-Adresse"
            type="email"
            placeholder="max.mustermann@example.com"
            value={data.email.email}
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
            value={data.email.confirmEmail}
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
        </div>
      </CardContent>
    </Card>
  )
}

