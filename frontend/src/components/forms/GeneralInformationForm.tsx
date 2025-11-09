import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputWithInfo } from "@/components/ui/input-with-info"
import { DatePickerWithInfo } from "@/components/ui/date-picker-with-info"
import { SelectWithInfo } from "@/components/ui/select-with-info"
import {
  useWizard,
  BasisModuleOption,
  ReportingBasisOption,
  EmployeeCountingMethod,
} from "@/contexts/WizardContext"
import { ChangeEvent } from "react"

const currencyOptions = [
  { value: "EUR", label: "EUR – Euro" },
  { value: "USD", label: "USD – US Dollar" },
  { value: "GBP", label: "GBP – Britisches Pfund" },
  { value: "JPY", label: "JPY – Japanischer Yen" },
]

const basisModuleOptions: Array<{ value: BasisModuleOption; label: string }> = [
  { value: "Basic", label: "Basic Module Only" },
  { value: "Basic & Comprehensive", label: "Basic & Comprehensive" },
]

const reportingBasisOptions: Array<{ value: ReportingBasisOption; label: string }> = [
  { value: "Consolidated", label: "Konsolidiert" },
  { value: "Individual", label: "Einzelabschluss" },
]

const employeeCountingMethodOptions: Array<{ value: EmployeeCountingMethod; label: string }> = [
  { value: "Headcount", label: "Headcount (Anzahl Personen)" },
  { value: "Full-time equivalent", label: "FTE (Full-time equivalent)" },
  { value: "Both", label: "Beides / gemischt" },
]

export function GeneralInformationForm() {
  const { data, updateGeneralInformation } = useWizard()
  const general = data.generalInformation

  const handleInputChange =
    (field: keyof typeof general) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateGeneralInformation({ [field]: event.target.value })
    }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Berichtsdetails</CardTitle>
          <CardDescription>Stammdaten des Unternehmens und Berichtszeitraum.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWithInfo
              id="entityName"
              label="Name der berichtenden Einheit"
              value={general.entityName}
              onChange={handleInputChange("entityName")}
              required
              infoTitle="Name der berichtenden Einheit"
              infoDescription="Geben Sie den offiziellen Namen der berichtenden Einheit an, wie er im Handelsregister oder offiziellen Dokumenten geführt wird."
            />
            <InputWithInfo
              id="entityIdentifier"
              label="Identifikator der Einheit"
              value={general.entityIdentifier}
              onChange={handleInputChange("entityIdentifier")}
              required
              infoTitle="Identifikator der berichtenden Einheit"
              infoDescription="Beispiel: LEI, Handelsregisternummer oder eine andere eindeutige Kennung. Dieser Wert wird für XBRL-Metadaten benötigt."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectWithInfo
              id="currency"
              label="Berichtswährung"
              value={general.currency}
              onValueChange={(value) =>
                updateGeneralInformation({ currency: value })
              }
              options={currencyOptions}
              placeholder="Währung wählen"
              infoTitle="Währung der monetären Werte"
              infoDescription="Wählen Sie die Währung, in der finanzielle Kennzahlen im Bericht angegeben werden. Für den Basic Report sind z. B. EUR, USD, GBP oder JPY zulässig."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DatePickerWithInfo
                id="reportingPeriodStart"
                label="Berichtsbeginn"
                date={general.reportingPeriodStart}
                onDateChange={(date) => updateGeneralInformation({ reportingPeriodStart: date })}
                placeholder="Startdatum wählen"
                infoTitle="Startdatum des Berichtszeitraums"
                infoDescription="Der Bericht deckt einen bestimmten Zeitraum ab. Wählen Sie das Anfangsdatum, das in der General Information Tabelle (Zeile 9) eingetragen wird."
              />
              <DatePickerWithInfo
                id="reportingPeriodEnd"
                label="Berichtsende"
                date={general.reportingPeriodEnd}
                onDateChange={(date) => updateGeneralInformation({ reportingPeriodEnd: date })}
                placeholder="Enddatum wählen"
                infoTitle="Enddatum des Berichtszeitraums"
                infoDescription="Wählen Sie das Enddatum des Berichtszeitraums (siehe Zeile 13 des Excel-Templates). Achten Sie auf Konsistenz mit dem Startdatum."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basis for Preparation (B1)</CardTitle>
          <CardDescription>Angaben zur Berichtsgrundlage und Methodik.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectWithInfo
              id="basisModule"
              label="Basis für Vorbereitung"
              value={general.basisModule}
              onValueChange={(value) =>
                updateGeneralInformation({ basisModule: value as BasisModuleOption })
              }
              options={basisModuleOptions}
              placeholder="Modul wählen"
              infoTitle="Basis for Preparation"
              infoDescription="Wählen Sie, ob der Bericht nur das Basic Module oder zusätzlich das Comprehensive Module abdeckt (Zeile 32 im Template)."
            />

            <SelectWithInfo
              id="basisForReporting"
              label="Berichtsgrundlage"
              value={general.basisForReporting}
              onValueChange={(value) =>
                updateGeneralInformation({ basisForReporting: value as ReportingBasisOption })
              }
              options={reportingBasisOptions}
              placeholder="Basis wählen"
              infoTitle="Basis for reporting"
              infoDescription="Wählen Sie, ob der Bericht konsolidierte Daten oder Einzelabschlussdaten enthält (Zeile 42)."
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="omittedDisclosures"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Ausgelassene Disclosures
            </label>
            <textarea
              id="omittedDisclosures"
              value={general.omittedDisclosures ?? ""}
              onChange={handleInputChange("omittedDisclosures")}
              rows={4}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Optional: Liste der ausgelassenen Disclosures oder Begründungen"
            />
            <p className="text-sm text-muted-foreground">
              Dokumentieren Sie ausgelassene oder vertrauliche Angaben (Zeile 33). Diese Information unterstützt den Audit-Trail.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organisation & Mitarbeitende</CardTitle>
          <CardDescription>Unternehmenskennzahlen für B1 und Workforce.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWithInfo
              id="turnover"
              label="Umsatz (Berichtszeitraum)"
              value={general.turnover ?? ""}
              onChange={handleInputChange("turnover")}
              type="number"
              min="0"
              infoTitle="Turnover"
              infoDescription="Geben Sie den Umsatz im gewählten Berichtszeitraum an (Zeile 61). Bitte nutzen Sie die oben gewählte Währung."
            />
            <InputWithInfo
              id="employeeCount"
              label="Anzahl Mitarbeitende"
              value={general.employeeCount ?? ""}
              onChange={handleInputChange("employeeCount")}
              type="number"
              min="0"
              infoTitle="Number of employees"
              infoDescription="Gesamtzahl der Mitarbeitenden (Zeile 62). Der Wert muss mit den Social-Disclosure-Angaben konsistent sein."
            />
          </div>

          <SelectWithInfo
            id="employeeCountingMethod"
            label="Zählmethode Mitarbeitende"
            value={general.employeeCountingMethod}
            onValueChange={(value) =>
              updateGeneralInformation({
                employeeCountingMethod: value as EmployeeCountingMethod,
              })
            }
            options={employeeCountingMethodOptions}
            placeholder="Methodik wählen"
            infoTitle="Employee counting methodology"
            infoDescription="Wählen Sie die angewandte Methode für die Mitarbeiterzählung (Zeilen 63-64). Diese Wahl wirkt sich auf Social Disclosures aus."
          />

          <InputWithInfo
            id="primaryCountry"
            label="Hauptland der Aktivitäten"
            value={general.primaryCountry ?? ""}
            onChange={handleInputChange("primaryCountry")}
            infoTitle="Country of primary operations"
            infoDescription="Land der wesentlichen Vermögenswerte bzw. der Hauptsitz (Zeile 65)."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vorherige Berichte & Referenzen</CardTitle>
          <CardDescription>Links und Kontext zu früheren Offenlegungen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <InputWithInfo
            id="previousReportLink"
            label="Link zum vorherigen Bericht"
            value={general.previousReportLink ?? ""}
            onChange={handleInputChange("previousReportLink")}
            infoTitle="Link zu früheren Offenlegungen"
            infoDescription="Wenn Sie auf unveränderte Disclosures verweisen, geben Sie hier den Link zum Vorjahresbericht an (Zeile 29)."
          />
        </CardContent>
      </Card>
    </>
  )
}


