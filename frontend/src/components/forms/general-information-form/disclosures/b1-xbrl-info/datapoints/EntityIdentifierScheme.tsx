import { SelectWithInfo } from "@/components/ui/select-with-info.tsx"

const contextIdentifierScheme = [
  { value: "LEI", label: "LEI" },
  { value: "DUNS", label: "DUNS" },
  { value: "EU ID", label: "EU ID" },
  { value: "PermID", label: "PermID" },
]

interface EntityIdentifierSchemeFieldProps {
  value: string
  onChange: (value: string) => void
}

export function EntityIdentifierSchemeField({
  value,
  onChange,
}: EntityIdentifierSchemeFieldProps) {
  return (
    <SelectWithInfo
      id="entityIdentifierScheme"
      label="Identifier of the reporting entity"
      value={value}
      onValueChange={onChange}
      options={contextIdentifierScheme}
      infoTitle="Identifier of the reporting entity"
      infoDescription="The entity identifier is a unique ID, that will enable identifying the company that has reported the information. The VSME Standard does not require any specific identifier. An entity identifier is required for the digital reporting."
    />
  )
}
