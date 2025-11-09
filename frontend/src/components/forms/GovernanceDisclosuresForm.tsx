import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputWithInfo } from "@/components/ui/input-with-info"
import { SelectWithInfo } from "@/components/ui/select-with-info"
import { useWizard } from "@/stores/WizardStore"
import { ChangeEvent } from "react"

const yesNoOptions = [
  { value: "yes", label: "Ja" },
  { value: "no", label: "Nein" },
]

export function GovernanceDisclosuresForm() {
  const { data, updateGovernanceDisclosures } = useWizard()
  const governance = data.governanceDisclosures

  const handleChange =
    (field: keyof typeof governance) => (event: ChangeEvent<HTMLInputElement>) => {
      updateGovernanceDisclosures({ [field]: event.target.value })
    }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Compliance & Anti-Korruption (B11)</CardTitle>
          <CardDescription>
            Erfassen Sie etwaige Verurteilungen oder Bußgelder im Zusammenhang mit Korruption.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SelectWithInfo
            id="hasAntiCorruptionConvictions"
            label="Verurteilungen/Bußgelder vorhanden?"
            value={governance.hasAntiCorruptionConvictions}
            onValueChange={(value) =>
              updateGovernanceDisclosures({
                hasAntiCorruptionConvictions: value as "" | "yes" | "no",
              })
            }
            options={yesNoOptions}
            placeholder="Auswahl treffen"
            infoTitle="Convictions and fines"
            infoDescription="Zeile 5 im Governance-Sheet: Falls Ihr Unternehmen wegen Korruption verurteilt wurde oder Strafen zahlen musste, wählen Sie 'Ja'."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWithInfo
              id="convictionsCount"
              label="Anzahl Verurteilungen"
              value={governance.convictionsCount ?? ""}
              onChange={handleChange("convictionsCount")}
              type="number"
              min="0"
              infoTitle="Number of convictions"
              infoDescription="Anzahl rechtskräftiger Verurteilungen im Berichtszeitraum (Zeile 6)."
            />
            <InputWithInfo
              id="antiCorruptionFines"
              label="Höhe der Bußgelder"
              value={governance.antiCorruptionFines ?? ""}
              onChange={handleChange("antiCorruptionFines")}
              type="number"
              min="0"
              infoTitle="Amount of fines"
              infoDescription="Gesamtbetrag der gezahlten Strafen (Zeile 7)."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kontroverse Umsätze (C8)</CardTitle>
          <CardDescription>
            Angaben zu Umsätzen aus sensiblen oder kontroversen Aktivitäten.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <InputWithInfo
            id="fossilFuelRevenue"
            label="Umsätze aus fossilen Energien"
            value={governance.fossilFuelRevenue ?? ""}
            onChange={handleChange("fossilFuelRevenue")}
            infoTitle="Fossil fuel revenues"
            infoDescription="Zeile 17: Gesamtumsatz aus Kohle, Öl und Gas. Verwenden Sie die Berichtswährung."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Governance Body Diversity (C9)</CardTitle>
          <CardDescription>Geschlechterverteilung im Leitungsorgan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWithInfo
              id="femaleBoardMembers"
              label="Anzahl weibliche Mitglieder"
              value={governance.femaleBoardMembers ?? ""}
              onChange={handleChange("femaleBoardMembers")}
              type="number"
              min="0"
              infoTitle="Female board members"
              infoDescription="Zeile 31: Anzahl der weiblichen Vorstands-/Aufsichtsratsmitglieder zum Periodenende."
            />
            <InputWithInfo
              id="maleBoardMembers"
              label="Anzahl männliche Mitglieder"
              value={governance.maleBoardMembers ?? ""}
              onChange={handleChange("maleBoardMembers")}
              type="number"
              min="0"
              infoTitle="Male board members"
              infoDescription="Zeile 32: Anzahl der männlichen Mitglieder zum Periodenende."
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}


