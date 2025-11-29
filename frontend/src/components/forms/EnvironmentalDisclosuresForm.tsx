
import { useWizard } from "@/stores/WizardStore"
import { ChangeEvent } from "react"


export function EnvironmentalDisclosuresForm() {
  const { data, updateEnvironmentalDisclosures } = useWizard()
  const environmental = data.environmentalDisclosures

  const handleInputChange =
    (field: keyof typeof environmental) => (event: ChangeEvent<HTMLInputElement>) => {
      updateEnvironmentalDisclosures({ [field]: event.target.value })
    }

  return (
    <>
    </>
  )
}


