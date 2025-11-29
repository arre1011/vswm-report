
import { useWizard} from "@/stores/WizardStore.ts"
import { useI18n } from "@/lib/i18n.tsx"
import { ChangeEvent } from "react"
import { B1XbrlInfo } from "@/components/forms/general-information-form/disclosures/b1-xbrl-info/B1XbrlInfo.tsx"
import { B1BasisPreparation } from "@/components/forms/general-information-form/disclosures/b1-basis-preparation/B1BasisPreparation.tsx"


export function GeneralInformationForm() {
  const { data, updateGeneralInformation } = useWizard()
  const general = data.generalInformation
  const { t } = useI18n()

  const handleInputChange =
    (field: keyof typeof general) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateGeneralInformation({ [field]: event.target.value })
    }

  return (
    <>
      <B1XbrlInfo
        sectionTitle={t("generalInformation.sectionTitle")}
        entityNameLabel={t("generalInformation.entityNameTitle")}
        general={general}
        handleInputChange={handleInputChange}
        updateGeneralInformation={updateGeneralInformation}
      />

      <B1BasisPreparation
        general={general}
        updateGeneralInformation={updateGeneralInformation}
      />


    </>
  )
}
