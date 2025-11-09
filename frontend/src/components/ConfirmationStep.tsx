import { useState } from "react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWizard } from "@/contexts/WizardContext"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export function ConfirmationStep() {
  const { data, submitData, isSubmitting, submitError, resetWizard } = useWizard()
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async () => {
    try {
      await submitData()
      setIsSuccess(true)
    } catch {
      // Fehlermeldung wird bereits im Context gesetzt
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-semibold">Erfolgreich abgesendet!</h3>
            <p className="text-muted-foreground">
              Ihre Daten wurden erfolgreich an das Backend gesendet.
            </p>
            <Button onClick={resetWizard} className="mt-4">
              Neues Formular starten
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { generalInformation, environmentalDisclosures, socialDisclosures, governanceDisclosures } =
    data

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Bestätigung</CardTitle>
        <CardDescription>
          Überprüfen Sie alle Angaben aus den vorangegangenen Schritten, bevor Sie den Bericht
          generieren.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <h3 className="text-lg font-semibold mb-2">General Information (B1)</h3>
          <div className="bg-muted/50 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Name der Einheit" value={generalInformation.entityName} />
            <InfoRow label="Identifikator" value={generalInformation.entityIdentifier} />
            <InfoRow label="Berichtswährung" value={generalInformation.currency} />
            <InfoRow
              label="Berichtszeitraum"
              value={
                generalInformation.reportingPeriodStart && generalInformation.reportingPeriodEnd
                  ? `${format(generalInformation.reportingPeriodStart, "dd.MM.yyyy", {
                      locale: de,
                    })} – ${format(generalInformation.reportingPeriodEnd, "dd.MM.yyyy", {
                      locale: de,
                    })}`
                  : "-"
              }
            />
            <InfoRow label="Basis for Preparation" value={generalInformation.basisModule} />
            <InfoRow label="Basis for Reporting" value={generalInformation.basisForReporting} />
            <InfoRow label="Umsatz" value={generalInformation.turnover} />
            <InfoRow label="Mitarbeitende" value={generalInformation.employeeCount} />
            <InfoRow
              label="Zählmethode"
              value={generalInformation.employeeCountingMethod || "-"}
            />
            <InfoRow label="Land der Hauptaktivitäten" value={generalInformation.primaryCountry} />
            <InfoRow
              label="Link zum Vorjahresbericht"
              value={generalInformation.previousReportLink}
            />
          </div>
          {generalInformation.omittedDisclosures && (
            <div className="bg-muted/30 p-4 rounded-md mt-4">
              <p className="text-sm font-medium">Ausgelassene Disclosures</p>
              <p className="text-sm text-muted-foreground">
                {generalInformation.omittedDisclosures}
              </p>
            </div>
          )}
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Environmental Disclosures (B3 & C3)</h3>
          <div className="bg-muted/50 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow
              label="Gesamtenergieverbrauch (MWh)"
              value={environmentalDisclosures.totalEnergyConsumption}
            />
            <InfoRow
              label="Scope 1 Emissionen"
              value={environmentalDisclosures.scope1Emissions}
            />
            <InfoRow
              label="Scope 2 Emissionen"
              value={environmentalDisclosures.scope2Emissions}
            />
            <InfoRow
              label="Scope 3 Emissionen"
              value={environmentalDisclosures.scope3Emissions}
            />
            <InfoRow label="THG-Intensität" value={environmentalDisclosures.ghgIntensity} />
            <InfoRow
              label="Transition Plan vorhanden?"
              value={
                environmentalDisclosures.hasTransitionPlan === "yes"
                  ? "Ja"
                  : environmentalDisclosures.hasTransitionPlan === "no"
                  ? "Nein"
                  : "-"
              }
            />
          </div>
          {environmentalDisclosures.transitionPlanDescription && (
            <div className="bg-muted/30 p-4 rounded-md mt-4">
              <p className="text-sm font-medium">Transition Plan</p>
              <p className="text-sm text-muted-foreground">
                {environmentalDisclosures.transitionPlanDescription}
              </p>
            </div>
          )}
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Social Disclosures (B8 – B10)</h3>
          <div className="bg-muted/50 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow
              label="Zählmethode"
              value={socialDisclosures.employeeMethodology || "-"}
            />
            <InfoRow
              label="Gesamtzahl Mitarbeitende"
              value={socialDisclosures.totalEmployees}
            />
            <InfoRow
              label="Unbefristete Verträge"
              value={socialDisclosures.permanentEmployees}
            />
            <InfoRow
              label="Befristete Verträge"
              value={socialDisclosures.temporaryEmployees}
            />
            <InfoRow label="Fluktuationsrate" value={socialDisclosures.turnoverRate} />
            <InfoRow label="Unfallrate" value={socialDisclosures.accidentRate} />
            <InfoRow label="Todesfälle" value={socialDisclosures.fatalities} />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Governance Disclosures (B11 / C8 / C9)</h3>
          <div className="bg-muted/50 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow
              label="Korruptionsverurteilungen?"
              value={
                governanceDisclosures.hasAntiCorruptionConvictions === "yes"
                  ? "Ja"
                  : governanceDisclosures.hasAntiCorruptionConvictions === "no"
                  ? "Nein"
                  : "-"
              }
            />
            <InfoRow
              label="Anzahl Verurteilungen"
              value={governanceDisclosures.convictionsCount}
            />
            <InfoRow
              label="Bußgelder (gesamt)"
              value={governanceDisclosures.antiCorruptionFines}
            />
            <InfoRow
              label="Umsatz fossile Energien"
              value={governanceDisclosures.fossilFuelRevenue}
            />
            <InfoRow
              label="Weibliche Board-Mitglieder"
              value={governanceDisclosures.femaleBoardMembers}
            />
            <InfoRow
              label="Männliche Board-Mitglieder"
              value={governanceDisclosures.maleBoardMembers}
            />
          </div>
        </section>

        {submitError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Fehler beim Senden</p>
                <p className="text-sm">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting} size="lg" className="min-w-[220px]">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird gesendet...
              </>
            ) : (
              "Excel-Bericht generieren"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <p className="text-sm">
      <span className="font-medium">{label}:</span>{" "}
      <span className="text-muted-foreground">{value && value !== "" ? value : "-"}</span>
    </p>
  )
}

