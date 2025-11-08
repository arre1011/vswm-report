import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useWizard } from "@/contexts/WizardContext"

export function PersonalInformationForm() {
  const { data, updatePersonalData } = useWizard()

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Persönliche Informationen</CardTitle>
        <CardDescription>
          Bitte wählen Sie Ihre bevorzugte Währung aus.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currency">Währung</Label>
            <Select
              value={data.personal.currency}
              onValueChange={(value: "EUR" | "USD" | "GBP" | "JPY") =>
                updatePersonalData({ currency: value })
              }
            >
              <SelectTrigger id="currency" className="w-full">
                <SelectValue placeholder="Währung auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="GBP">GBP - Britisches Pfund</SelectItem>
                <SelectItem value="JPY">JPY - Japanischer Yen</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Diese Währung wird für alle Transaktionen verwendet.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

