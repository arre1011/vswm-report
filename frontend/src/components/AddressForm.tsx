import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputWithInfo } from "@/components/ui/input-with-info"
import { Button } from "@/components/ui/button"

interface FormData {
  name: string
  street: string
  houseNumber: string
  city: string
}

export function AddressForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    street: "",
    houseNumber: "",
    city: "",
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Formular abgesendet:", formData)
    // Hier können Sie die Daten weiterverarbeiten
  }

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Adressformular</CardTitle>
        <CardDescription>
          Bitte füllen Sie alle Felder aus, um fortzufahren.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputWithInfo
            id="name"
            label="Name"
            type="text"
            placeholder="Max Mustermann"
            value={formData.name}
            onChange={handleChange("name")}
            required
            infoTitle="Informationen zum Namensfeld"
            infoDescription="Geben Sie in dieses Feld zuerst Ihren Vornamen und dann Ihren Nachnamen ein. Falls Sie einen Mittelnamen haben, können Sie diesen ebenfalls angeben. Bitte verwenden Sie keine Abkürzungen und achten Sie auf die korrekte Schreibweise."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <InputWithInfo
                id="street"
                label="Straße"
                type="text"
                placeholder="Musterstraße"
                value={formData.street}
                onChange={handleChange("street")}
                required
                infoTitle="Informationen zum Straßenfeld"
                infoDescription="Geben Sie hier den Namen Ihrer Straße ohne Hausnummer ein. Verwenden Sie die vollständige Schreibweise der Straße (z.B. 'Hauptstraße' statt 'Hauptstr.'). Bei Straßen mit Zusätzen wie 'Am', 'Zur', 'An der' etc., geben Sie diese bitte ebenfalls an."
              />
            </div>
            <div>
              <InputWithInfo
                id="houseNumber"
                label="Hausnummer"
                type="text"
                placeholder="123"
                value={formData.houseNumber}
                onChange={handleChange("houseNumber")}
                required
                infoTitle="Informationen zur Hausnummer"
                infoDescription="Geben Sie hier Ihre Hausnummer ein. Falls Ihre Adresse eine Hausnummer mit Buchstaben enthält (z.B. '12a' oder '45B'), geben Sie diese bitte vollständig an. Bei Hausnummern mit Bindestrich (z.B. '12-14') geben Sie diese bitte ebenfalls vollständig ein."
              />
            </div>
          </div>

          <InputWithInfo
            id="city"
            label="Stadt"
            type="text"
            placeholder="Berlin"
            value={formData.city}
            onChange={handleChange("city")}
            required
            infoTitle="Informationen zum Stadtfeld"
            infoDescription="Geben Sie hier den Namen Ihrer Stadt oder Gemeinde ein. Verwenden Sie bitte den offiziellen Namen der Stadt. Falls Sie in einem Ortsteil wohnen, können Sie diesen nach dem Stadtnamen durch ein Komma getrennt angeben (z.B. 'Berlin, Charlottenburg'). Bei kleineren Orten genügt der Ortsname."
          />

          <Button
            type="submit"
            className="w-full mt-6 hover:scale-105 transition-transform"
          >
            Absenden
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

