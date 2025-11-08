import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Max Mustermann"
              value={formData.name}
              onChange={handleChange("name")}
              required
              className="transition-all focus:scale-[1.02]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="street">Straße</Label>
              <Input
                id="street"
                type="text"
                placeholder="Musterstraße"
                value={formData.street}
                onChange={handleChange("street")}
                required
                className="transition-all focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="houseNumber">Hausnummer</Label>
              <Input
                id="houseNumber"
                type="text"
                placeholder="123"
                value={formData.houseNumber}
                onChange={handleChange("houseNumber")}
                required
                className="transition-all focus:scale-[1.02]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Stadt</Label>
            <Input
              id="city"
              type="text"
              placeholder="Berlin"
              value={formData.city}
              onChange={handleChange("city")}
              required
              className="transition-all focus:scale-[1.02]"
            />
          </div>

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

