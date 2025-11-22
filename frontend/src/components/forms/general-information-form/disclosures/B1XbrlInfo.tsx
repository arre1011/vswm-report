import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { InputWithInfo } from "@/components/ui/input-with-info.tsx"
import { DatePickerWithInfo } from "@/components/ui/date-picker-with-info.tsx"
import { SelectWithInfo } from "@/components/ui/select-with-info.tsx"
import { GeneralInformationData } from "@/stores/WizardStore.ts"
import { ChangeEvent, FocusEvent, useEffect } from "react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

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

const entityNameSchema = z
  .string({
    required_error:
      "Please provide the legal entity name so we can reference a concrete reporting entity inside the XBRL contexts.",
    invalid_type_error:
      "Entity name must be text. Numbers or structured data would not be a valid legal name and could break the XBRL output.",
  })
  .trim()
  .min(3, {
    message:
      "Please enter at least three readable characters so the reporting entity can be uniquely identified.",
  })
  .max(120, {
    message:
      "Please stay under 120 characters. This keeps the exported disclosure compact and prevents denial-of-service style inputs.",
  })
  .regex(/^[\p{L}\p{N}\s.,'()&/-]+$/u, {
    message:
      "Only use letters, digits, spaces and safe punctuation such as . , ' ( ) & / -. This prevents script injection in Excel/XBRL.",
  })

interface B1XbrlInfoProps {
  sectionTitle: string
  entityNameLabel: string
  general: GeneralInformationData
  handleInputChange: (
    field: keyof GeneralInformationData,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  updateGeneralInformation: (data: Partial<GeneralInformationData>) => void
}

export function B1XbrlInfo({
  sectionTitle,
  entityNameLabel,
  general,
  handleInputChange,
  updateGeneralInformation,
}: B1XbrlInfoProps) {
  const generalInfoForm = useForm({
    defaultValues: { entityName: general.entityName },
    onSubmit: async () => {},
  })

  useEffect(() => {
    const currentValue = generalInfoForm.getFieldValue("entityName")
    if (general.entityName !== currentValue) {
      generalInfoForm.setFieldValue("entityName", general.entityName, { dontUpdateMeta: true })
    }
  }, [general.entityName, generalInfoForm])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{sectionTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <generalInfoForm.Field
            name="entityName"
            validators={{
              onChange: entityNameSchema,
              onBlur: entityNameSchema,
            }}
          >
            {(field) => {
              const shouldDisplayError = field.state.meta.isTouched || field.state.meta.isBlurred
              const firstError = field.state.meta.errors?.[0]
              const entityNameError = shouldDisplayError ? extractErrorMessage(firstError) : undefined

              const handleEntityNameChange = (event: ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.value
                field.handleChange(newValue)
                updateGeneralInformation({ entityName: newValue })
              }

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
                  label={entityNameLabel}
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
            onValueChange={(value) => updateGeneralInformation({ entityIdentifierScheme: value })}
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
            onValueChange={(value) => updateGeneralInformation({ currency: value })}
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
              placeholder="Choose an end Date"
              infoTitle="Reporting period end date"
              infoDescription="If VALUE not Valid, please ensure that the reporting period end date is greater than the reporting period start date."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
