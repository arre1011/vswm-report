import { SelectWithInfo } from "@/components/ui/select-with-info.tsx"

const currencyOptions = [
  { value: "EUR", label: "EUR – Euro" },
  { value: "USD", label: "USD – US Dollar" },
  { value: "GBP", label: "GBP – Britisches Pfund" },
  { value: "JPY", label: "JPY – Japanischer Yen" },
]

interface CurrencyFieldProps {
  value: string
  onChange: (value: string) => void
}

export function CurrencyField({ value, onChange }: CurrencyFieldProps) {
  return (
    <SelectWithInfo
      id="currency"
      label="Berichtswährung"
      value={value}
      onValueChange={onChange}
      options={currencyOptions}
      placeholder="Währung wählen"
      infoTitle="Währung der monetären Werte"
      infoDescription="Wählen Sie die Währung, in der finanzielle Kennzahlen im Bericht angegeben werden. Für den Basic Report sind z. B. EUR, USD, GBP oder JPY zulässig."
    />
  )
}
