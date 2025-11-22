import { InputWithInfo } from "@/components/ui/input-with-info.tsx"
import { ChangeEvent } from "react"

interface EntityIdentifierFieldProps {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function EntityIdentifierField({ value, onChange }: EntityIdentifierFieldProps) {
  return (
    <InputWithInfo
      id="entityIdentifier"
      label="Specify identifier of the reporting entity"
      value={value}
      onChange={onChange}
      placeholder="e.g. TestCode1234"
      required
      infoTitle="Identifikator der berichtenden Einheit"
      infoDescription="The entity identifier is a unique ID, that will enable identifying the company that has reported the information. The VSME Standard does not require any specific identifier. An entity identifier is required for the digital reporting."
    />
  )
}
