import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputWithInfo } from "@/components/ui/input-with-info"
import { SelectWithInfo } from "@/components/ui/select-with-info"
import { useWizard } from "@/contexts/WizardContext"
import { ChangeEvent } from "react"

const yesNoOptions = [
  { value: "yes", label: "Ja" },
  { value: "no", label: "Nein" },
]

export function EnvironmentalDisclosuresForm() {
  const { data, updateEnvironmentalDisclosures } = useWizard()
  const environmental = data.environmentalDisclosures

  const handleInputChange =
    (field: keyof typeof environmental) => (event: ChangeEvent<HTMLInputElement>) => {
      updateEnvironmentalDisclosures({ [field]: event.target.value })
    }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Energieverbrauch (B3)</CardTitle>
          <CardDescription>
            Pflichtfelder zum gesamten Energieverbrauch und zur Berechnung von Intensitäten.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <InputWithInfo
            id="totalEnergyConsumption"
            label="Gesamter Energieverbrauch (MWh)"
            value={environmental.totalEnergyConsumption ?? ""}
            onChange={handleInputChange("totalEnergyConsumption")}
            type="number"
            min="0"
            infoTitle="Total Energy Consumption (Zeile 5)"
            infoDescription="Tragen Sie den aggregierten Energieverbrauch des Unternehmens im Berichtszeitraum ein. Grundlage für ESRS E1 B3."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>THG-Emissionen (B3 & B4)</CardTitle>
          <CardDescription>
            Emissionen nach Scope sowie Emissionsintensitäten gemäß ESRS E1.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWithInfo
              id="scope1Emissions"
              label="Scope 1 Emissionen (tCO₂e)"
              value={environmental.scope1Emissions ?? ""}
              onChange={handleInputChange("scope1Emissions")}
              type="number"
              min="0"
              infoTitle="Scope 1 Emissions"
              infoDescription="Direkte Treibhausgasemissionen (Zeile 22)."
            />
            <InputWithInfo
              id="scope2Emissions"
              label="Scope 2 Emissionen (tCO₂e)"
              value={environmental.scope2Emissions ?? ""}
              onChange={handleInputChange("scope2Emissions")}
              type="number"
              min="0"
              infoTitle="Scope 2 Emissions"
              infoDescription="Indirekte Emissionen aus eingekaufter Energie (Zeile 23/24)."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWithInfo
              id="scope3Emissions"
              label="Scope 3 Emissionen (tCO₂e)"
              value={environmental.scope3Emissions ?? ""}
              onChange={handleInputChange("scope3Emissions")}
              type="number"
              min="0"
              infoTitle="Scope 3 Emissions"
              infoDescription="Wesentliche vorgelagerte und nachgelagerte Emissionen (Zeile 45)."
            />
            <InputWithInfo
              id="ghgIntensity"
              label="THG-Intensität (tCO₂e / Umsatz)"
              value={environmental.ghgIntensity ?? ""}
              onChange={handleInputChange("ghgIntensity")}
              infoTitle="Emission Intensity"
              infoDescription="Intensität nach ESRS E1 B3 (Zeile 64). Grundlage für Vergleichbarkeit."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transition Plan (C3)</CardTitle>
          <CardDescription>Angaben zu Übergangsplan und geplanten Maßnahmen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SelectWithInfo
            id="hasTransitionPlan"
            label="Transition Plan vorhanden?"
            value={environmental.hasTransitionPlan}
            onValueChange={(value) =>
              updateEnvironmentalDisclosures({ hasTransitionPlan: value as "yes" | "no" | "" })
            }
            options={yesNoOptions}
            placeholder="Auswahl treffen"
            infoTitle="Transition Plan"
            infoDescription="Geben Sie an, ob ein Klimatransformationsplan besteht (Zeile 56)."
          />

          <div className="space-y-2">
            <label
              htmlFor="transitionPlanDescription"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Beschreibung des Transition Plans
            </label>
            <textarea
              id="transitionPlanDescription"
              value={environmental.transitionPlanDescription ?? ""}
              onChange={(event) =>
                updateEnvironmentalDisclosures({ transitionPlanDescription: event.target.value })
              }
              rows={4}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Optional: Maßnahmen, Zeitplan, Governance"
            />
            <p className="text-sm text-muted-foreground">
              Beschreiben Sie zentrale Maßnahmen, Zielkennzahlen und Governance-Strukturen Ihres Transition Plans (Zeilen 58-59).
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}


