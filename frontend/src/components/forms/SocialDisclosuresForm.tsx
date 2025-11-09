import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputWithInfo } from "@/components/ui/input-with-info"
import { SelectWithInfo } from "@/components/ui/select-with-info"
import { useWizard, EmployeeCountingMethod } from "@/contexts/WizardContext"
import { ChangeEvent } from "react"

const employeeMethodOptions: Array<{ value: EmployeeCountingMethod; label: string }> = [
  { value: "Headcount", label: "Headcount (Anzahl Personen)" },
  { value: "Full-time equivalent", label: "FTE (Full-time equivalent)" },
  { value: "Both", label: "Beides / gemischt" },
]

export function SocialDisclosuresForm() {
  const { data, updateSocialDisclosures } = useWizard()
  const social = data.socialDisclosures

  const handleInputChange =
    (field: keyof typeof social) => (event: ChangeEvent<HTMLInputElement>) => {
      updateSocialDisclosures({ [field]: event.target.value })
    }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Workforce – Allgemeine Kennzahlen (B8)</CardTitle>
          <CardDescription>
            Angaben zur Belegschaft, Verträgen und Gesamtzahl der Mitarbeitenden.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SelectWithInfo
            id="employeeMethodology"
            label="Zählmethode für Mitarbeitende"
            value={social.employeeMethodology}
            onValueChange={(value) =>
              updateSocialDisclosures({
                employeeMethodology: value as EmployeeCountingMethod,
              })
            }
            options={employeeMethodOptions}
            placeholder="Methodik wählen"
            infoTitle="Employee counting methodology"
            infoDescription="Stellen Sie sicher, dass die Methode mit den Angaben unter General Information übereinstimmt (Zeile 2-4 im Social Sheet)."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputWithInfo
              id="totalEmployees"
              label="Gesamtzahl Mitarbeitende"
              value={social.totalEmployees ?? ""}
              onChange={handleInputChange("totalEmployees")}
              type="number"
              min="0"
              infoTitle="Total employees"
              infoDescription="Pflichtfeld gemäß B8 (Zeile 12/22)."
            />
            <InputWithInfo
              id="permanentEmployees"
              label="Davon unbefristet"
              value={social.permanentEmployees ?? ""}
              onChange={handleInputChange("permanentEmployees")}
              type="number"
              min="0"
              infoTitle="Permanent contract"
              infoDescription="Anzahl Mitarbeitende mit unbefristetem Vertrag (Zeile 10)."
            />
            <InputWithInfo
              id="temporaryEmployees"
              label="Davon befristet"
              value={social.temporaryEmployees ?? ""}
              onChange={handleInputChange("temporaryEmployees")}
              type="number"
              min="0"
              infoTitle="Temporary contract"
              infoDescription="Anzahl Mitarbeitende mit befristetem Vertrag (Zeile 11)."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fluktuation & Gesundheit (B8–B10)</CardTitle>
          <CardDescription>Pflichtindikatoren zu Turnover und Arbeitssicherheit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputWithInfo
              id="turnoverRate"
              label="Fluktuationsrate (%)"
              value={social.turnoverRate ?? ""}
              onChange={handleInputChange("turnoverRate")}
              infoTitle="Turnover rate"
              infoDescription="Berechnen Sie die Fluktuationsrate gemäß Zeile 47 (Anzahl Abgänge / durchschnittlicher Bestand)."
            />
            <InputWithInfo
              id="accidentRate"
              label="Unfallrate"
              value={social.accidentRate ?? ""}
              onChange={handleInputChange("accidentRate")}
              infoTitle="Accident rate"
              infoDescription="Verhältnis meldepflichtiger Arbeitsunfälle pro 1.000 Mitarbeitende (Zeile 53)."
            />
            <InputWithInfo
              id="fatalities"
              label="Anzahl Todesfälle"
              value={social.fatalities ?? ""}
              onChange={handleInputChange("fatalities")}
              type="number"
              min="0"
              infoTitle="Fatalities"
              infoDescription="Anzahl tödlicher Arbeitsunfälle (Zeile 54)."
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}


