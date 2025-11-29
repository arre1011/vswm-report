
import { useWizard } from "@/stores/WizardStore"
import { ChangeEvent } from "react"


export function GovernanceDisclosuresForm() {
  const { data, updateGovernanceDisclosures } = useWizard()
  const governance = data.governanceDisclosures

  const handleChange =
    (field: keyof typeof governance) => (event: ChangeEvent<HTMLInputElement>) => {
      updateGovernanceDisclosures({ [field]: event.target.value })
    }

  return (
    <>
    </>
  )
}


