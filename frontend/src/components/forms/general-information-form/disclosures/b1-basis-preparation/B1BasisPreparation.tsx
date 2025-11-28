import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { SelectWithInfo } from "@/components/ui/select-with-info.tsx"
import {
  BasisModuleOption,
  GeneralInformationData,
  ReportingBasisOption,
} from "@/stores/WizardStore.ts"
import { ChangeEvent } from "react"
import {
    BasisModuleField
} from "@/components/forms/general-information-form/disclosures/b1-basis-preparation/datapoints/BasisModule.tsx";
import {
    BasisForReporting
} from "@/components/forms/general-information-form/disclosures/b1-basis-preparation/datapoints/BasisForReporting.tsx";


const reportingBasisOptions: Array<{ value: ReportingBasisOption; label: string }> = [
  { value: "Consolidated", label: "Konsolidiert" },
  { value: "Individual", label: "Einzelabschluss" },
]

interface B1BasisPreparationProps {
  general: GeneralInformationData
  handleInputChange: (
    field: keyof GeneralInformationData,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  updateGeneralInformation: (data: Partial<GeneralInformationData>) => void
}

export function B1BasisPreparation({
  general,
  handleInputChange,
  updateGeneralInformation,
}: B1BasisPreparationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basis for Preparation (B1)</CardTitle>
        <CardDescription>B1 - Basis for Preparation and other undertaking's general information from 2025-11-05 to 2025-11-19 [Always to be reported]		</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <BasisModuleField
                value={general.basisForPreparation}
                onChange={(value) =>
                    updateGeneralInformation({ basisForPreparation: value as BasisModuleOption })
                }
            />

            <BasisForReporting
              value={general.basisForReporting}
              onChange={(value) =>
                  updateGeneralInformation({ basisForReporting: value as string})}
            />

        </div>
      </CardContent>
    </Card>
  )
}
