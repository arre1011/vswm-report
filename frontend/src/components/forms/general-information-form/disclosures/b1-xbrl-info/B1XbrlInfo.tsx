import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { GeneralInformationData } from "@/stores/WizardStore.ts"
import { ChangeEvent } from "react"
import { EntityNameField } from "@/components/forms/general-information-form/disclosures/b1-xbrl-info/datapoints/EntityName.tsx"
import { EntityIdentifierSchemeField } from "@/components/forms/general-information-form/disclosures/b1-xbrl-info/datapoints/EntityIdentifierScheme.tsx"
import { EntityIdentifierField } from "@/components/forms/general-information-form/disclosures/b1-xbrl-info/datapoints/EntityIdentifier.tsx"
import { CurrencyField } from "@/components/forms/general-information-form/disclosures/b1-xbrl-info/datapoints/Currency.tsx"
import { ReportingPeriodStartField } from "@/components/forms/general-information-form/disclosures/b1-xbrl-info/datapoints/ReportingPeriodStart.tsx"
import { ReportingPeriodEndField } from "@/components/forms/general-information-form/disclosures/b1-xbrl-info/datapoints/ReportingPeriodEnd.tsx"

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>{sectionTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EntityNameField
            label={entityNameLabel}
            value={general.entityName}
            onUpdate={(value) => updateGeneralInformation({ entityName: value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EntityIdentifierSchemeField
            value={general.entityIdentifierScheme}
            onChange={(value) => updateGeneralInformation({ entityIdentifierScheme: value })}
          />
          <EntityIdentifierField value={general.entityIdentifier} onChange={handleInputChange("entityIdentifier")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyField value={general.currency} onChange={(value) => updateGeneralInformation({ currency: value })} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReportingPeriodStartField
              date={general.reportingPeriodStart}
              onChange={(date) => updateGeneralInformation({ reportingPeriodStart: date })}
            />
            <ReportingPeriodEndField
              date={general.reportingPeriodEnd}
              onChange={(date) => updateGeneralInformation({ reportingPeriodEnd: date })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
