import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWizard } from "@/contexts/WizardContext"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export function ConfirmationStep() {
  const { data, submitData, isSubmitting, submitError, resetWizard } = useWizard()
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async () => {
    try {
      await submitData()
      setIsSuccess(true)
    } catch (error) {
      // Error wird bereits im Context behandelt
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-semibold">Erfolgreich abgesendet!</h3>
            <p className="text-muted-foreground">
              Ihre Daten wurden erfolgreich an das Backend gesendet.
            </p>
            <Button onClick={resetWizard} className="mt-4">
              Neues Formular starten
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Bestätigung</CardTitle>
        <CardDescription>
          Bitte überprüfen Sie Ihre Angaben vor dem Absenden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Adressdaten */}
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Adressdaten</h4>
            <div className="bg-muted/50 p-4 rounded-md space-y-2">
              <p>
                <span className="font-medium">Name:</span> {data.address.name || "-"}
              </p>
              <p>
                <span className="font-medium">Adresse:</span>{" "}
                {data.address.street} {data.address.houseNumber}
              </p>
              <p>
                <span className="font-medium">Stadt:</span> {data.address.city || "-"}
              </p>
            </div>
          </div>

          {/* E-Mail-Daten */}
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">E-Mail-Adresse</h4>
            <div className="bg-muted/50 p-4 rounded-md">
              <p>
                <span className="font-medium">E-Mail:</span> {data.email.email || "-"}
              </p>
            </div>
          </div>

          {/* Persönliche Daten */}
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Persönliche Informationen</h4>
            <div className="bg-muted/50 p-4 rounded-md">
              <p>
                <span className="font-medium">Währung:</span> {data.personal.currency}
              </p>
            </div>
          </div>

          {/* Fehlermeldung */}
          {submitError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Fehler beim Senden</p>
                  <p className="text-sm">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full mt-6"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird gesendet...
              </>
            ) : (
              "Daten an Backend senden"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

