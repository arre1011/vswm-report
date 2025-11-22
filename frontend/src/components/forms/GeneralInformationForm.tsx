import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputWithInfo } from "@/components/ui/input-with-info"
import { DatePickerWithInfo } from "@/components/ui/date-picker-with-info"
import { SelectWithInfo } from "@/components/ui/select-with-info"
import {
  useWizard,
  BasisModuleOption,
  ReportingBasisOption,
  EmployeeCountingMethod,
} from "@/stores/WizardStore"
import { useI18n } from "@/lib/i18n"
import { ChangeEvent, FocusEvent, useEffect } from "react"
import { z } from "zod"
import { useForm } from "@tanstack/react-form"

const currencyOptions = [
  { value: "EUR", label: "EUR – Euro" },
  { value: "USD", label: "USD – US Dollar" },
  { value: "GBP", label: "GBP – Britisches Pfund" },
  { value: "JPY", label: "JPY – Japanischer Yen" },
]

const contextIdentifierScheme = [
    { value: "LEI", label: "LEI" },
    { value: "DUNS", label: "DUNS" },
    { value: "EU ID", label: "EU ID" },
    { value: "PermID", label: "PermID" },
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

/**
 * TanStack Form returns rich error objects (e.g., Zod issues) so we translate them into plain strings for our UI.
 * That way React never tries to render the complex object directly (which would throw) and beginners can read a simple message.
 */
const extractErrorMessage = (error: unknown): string | undefined => {
  if (!error) {
    return undefined
  }
  if (typeof error === "string") {
    return error
  }
  if (typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message
    return typeof message === "string" ? message : undefined
  }
  return undefined
}

/**
 * We keep this schema close to the form component so it is obvious which business rules currently govern the
 * `entityName` field. The inline comments explain _why_ every single constraint is in place, which is extra helpful
 * while we onboard strict validation to more inputs later on.
 */
const entityNameSchema = z
  .string({
    /**
     * Requiring a string type (with a helpful error message) makes sure TanStack Form refuses everything that is not plain
     * text (for example, numbers or JSON objects injected through developer tools). This protects against tampering before
     * the data can reach our Excel/XBRL export.
     */
    required_error:
      "Please provide the legal entity name so we can reference a concrete reporting entity inside the XBRL contexts.",
    invalid_type_error:
      "Entity name must be text. Numbers or structured data would not be a valid legal name and could break the XBRL output.",
  })
/**
 * `.trim()` removes leading and trailing whitespace. Without stripping invisible characters a user could accidentally
 * create names like `"ACME<space><space><space>"` that look fine in the UI but turn into different identifiers once exported.
 * Trimming up-front therefore keeps the stored value deterministic and prevents confusing duplicates.
 */
.trim()
  /**
   * `.min(3)` enforces that the user enters more than a couple of random letters.
   * Two characters are usually not enough to uniquely describe a company, so we push for at least 3 readable characters.
   */
  .min(3, {
    message:
      "Please enter at least three readable characters so the reporting entity can be uniquely identified.",
  })
  /**
   * `.max(120)` blocks extremely long names that could be used in denial-of-service attempts (by slowing Excel down) or
   * create unwieldy disclosure tables. 120 characters still allows descriptive names but caps potential abuse.
   */
  .max(120, {
    message:
      "Please stay under 120 characters. This keeps the exported disclosure compact and prevents denial-of-service style inputs.",
  })
  /**
   * The regex whitelists common characters found in legal names (letters from every language, digits, whitespace, and a
   * few safe punctuation marks). By rejecting `<`, `>`, backticks, etc. we lower the risk of script or formula injection
   * when the name is later rendered inside HTML or Excel.
   */
  .regex(/^[\p{L}\p{N}\s.,'()&/-]+$/u, {
    message:
      "Only use letters, digits, spaces and safe punctuation such as . , ' ( ) & / -. This prevents script injection in Excel/XBRL.",
  })

export function GeneralInformationForm() {
  const { data, updateGeneralInformation } = useWizard()
  const general = data.generalInformation
  const { t } = useI18n()
  const generalInfoForm = useForm({
    defaultValues: { entityName: general.entityName },
    onSubmit: async () => {
      /**
       * We are not triggering a full submit yet, but `useForm` requires an `onSubmit` handler.
       * Keeping it here avoids runtime errors once we start validating additional inputs.
       */
    },
  })
  /**
   * Whenever the global wizard store resets (for example after finishing the wizard) we want the form field
   * to mirror that external change. Syncing it manually keeps the TanStack form state and our Zustand store aligned.
   */
  useEffect(() => {
    const currentFormValue = generalInfoForm.getFieldValue("entityName")
    if (general.entityName !== currentFormValue) {
      generalInfoForm.setFieldValue("entityName", general.entityName, { dontUpdateMeta: true })
    }
  }, [general.entityName, generalInfoForm])

  const handleInputChange =
    (field: keyof typeof general) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateGeneralInformation({ [field]: event.target.value })
    }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("generalInformation.sectionTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <generalInfoForm.Field
              name="entityName"
              validators={{
                /**
                 * By validating on every change _and_ blur we give immediate feedback and still re-check once the user leaves the field.
                 * This combination catches mistakes early without waiting for a form submission.
                 */
                onChange: entityNameSchema,
                onBlur: entityNameSchema,
              }}
            >
              {(field) => {
                const shouldDisplayError = field.state.meta.isTouched || field.state.meta.isBlurred
                const firstFieldError = field.state.meta.errors?.[0]
                const entityNameError = shouldDisplayError ? extractErrorMessage(firstFieldError) : undefined

                const handleEntityNameChange = (event: ChangeEvent<HTMLInputElement>) => {
                  const newValue = event.target.value
                  field.handleChange(newValue)
                  updateGeneralInformation({ entityName: newValue })
                }

                /**
                 * On blur we additionally normalize whitespace (collapsing long runs of spaces and trimming again) to avoid storing
                 * invisible characters that attackers could use to hide data. The sanitized value then flows into both TanStack Form
                 * and our Zustand store to keep every layer clean.
                 */
                const handleEntityNameBlur = (event: FocusEvent<HTMLInputElement>) => {
                  const normalizedValue = event.target.value.replace(/\s{2,}/g, " ").trim()
                  if (normalizedValue !== event.target.value) {
                    field.handleChange(normalizedValue)
                    updateGeneralInformation({ entityName: normalizedValue })
                  }
                  field.handleBlur()
                }

                return (
                  <InputWithInfo
                    id="entityName"
                    label={t("generalInformation.entityNameTitle")}
                    value={field.state.value ?? ""}
                    onChange={handleEntityNameChange}
                    onBlur={handleEntityNameBlur}
                    required
                    placeholder="e.g. Company XYZ"
                    infoTitle="N/A"
                    infoDescription="N/A at the moment"
                    error={entityNameError}
                  />
                )
              }}
            </generalInfoForm.Field>




          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectWithInfo
                  id="entityIdentifierScheme"
                  label="Identifier of the reporting entity"
                  value={general.entityIdentifierScheme}
                  onValueChange={(value) =>
                      updateGeneralInformation({ entityIdentifierScheme: value })
                  }
                  options={contextIdentifierScheme}
                  infoTitle="Identifier of the reporting entity"
                  infoDescription="The entity identifier is a unique ID, that will enable identifying the company that has reported the information. The VSME Standard does not require any specific identifier. An entity identifier is required for the digital reporting."
              />
              <InputWithInfo
                  id="entityIdentifier"
                  label="Specify identifier of the reporting entity"
                  value={general.entityIdentifier}
                  onChange={handleInputChange("entityIdentifier")}
                  placeholder="e.g. TestCode1234"
                  required
                  infoTitle="Identifikator der berichtenden Einheit"
                  infoDescription="The entity identifier is a unique ID, that will enable identifying the company that has reported the information. The VSME Standard does not require any specific identifier. An entity identifier is required for the digital reporting."
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
                        label="Reporting start date"
                        date={general.reportingPeriodStart}
                        onDateChange={(date) => updateGeneralInformation({ reportingPeriodStart: date })}
                        placeholder="Choose a start Date"
                        infoTitle="Reporting period start date"
                        infoDescription="If VALUE not Valid, please ensure that the reporting period end date is greater than the reporting period start date."
                    />
                    <DatePickerWithInfo
                        id="reportingPeriodEnd"
                        label="Reporting end date"
                        date={general.reportingPeriodEnd}
                        onDateChange={(date) => updateGeneralInformation({ reportingPeriodEnd: date })}
                        placeholder="Choose a end Date"
                        infoTitle="Reporting period end date"
                        infoDescription="If VALUE not Valid, please ensure that the reporting period end date is greater than the reporting period start date."
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
