
import { useWizard} from "@/stores/WizardStore"
import { ChangeEvent } from "react"


export function SocialDisclosuresForm() {
  const { data, updateSocialDisclosures } = useWizard()
  const social = data.socialDisclosures

  const handleInputChange =
    (field: keyof typeof social) => (event: ChangeEvent<HTMLInputElement>) => {
      updateSocialDisclosures({ [field]: event.target.value })
    }

  return (
    <>

    </>
  )
}


