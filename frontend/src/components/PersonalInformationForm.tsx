import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerWithInfo } from "@/components/ui/date-picker-with-info"
import { SelectWithInfo } from "@/components/ui/select-with-info"
import { useWizard } from "@/contexts/WizardContext"

export function PersonalInformationForm() {
  const { data, updatePersonalData } = useWizard()

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // Disable future dates
    return date > today
  }

  const currencyOptions = [
    { value: "EUR", label: "EUR - Euro" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "GBP", label: "GBP - Britisches Pfund" },
    { value: "JPY", label: "JPY - Japanischer Yen" },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Persönliche Informationen</CardTitle>
        <CardDescription>
          Bitte geben Sie Ihre persönlichen Informationen ein.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <DatePickerWithInfo
            id="dateOfBirth"
            label="Geburtsdatum"
            date={data.personal.dateOfBirth}
            onDateChange={(date) => updatePersonalData({ dateOfBirth: date })}
            placeholder="Geburtsdatum auswählen"
            disabled={isDateDisabled}
            infoTitle="Informationen zum Geburtsdatum"
            infoDescription="Bitte wählen Sie Ihr Geburtsdatum aus. Zukünftige Daten können nicht ausgewählt werden. Das Geburtsdatum wird für die Verifizierung Ihrer Identität verwendet und muss mit Ihrem offiziellen Ausweisdokument übereinstimmen."
          />

          <SelectWithInfo
            id="currency"
            label="Währung"
            value={data.personal.currency}
            onValueChange={(value) =>
              updatePersonalData({ currency: value as "EUR" | "USD" | "GBP" | "JPY" })
            }
            options={currencyOptions}
            placeholder="Währung auswählen"
            infoTitle="Informationen zur Währung"
            infoDescription="Wählen Sie Ihre bevorzugte Währung aus. Diese Währung wird für alle Transaktionen und Berechnungen in Ihrem Konto verwendet. Sie können die Währung später in den Einstellungen ändern. Verfügbare Währungen: EUR (Euro), USD (US Dollar), GBP (Britisches Pfund), JPY (Japanischer Yen)."
          />
        </div>
      </CardContent>
    </Card>
  )
}

