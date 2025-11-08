import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddressForm } from "@/components/AddressForm"
import { EmailForm } from "@/components/EmailForm"
import { PersonalInformationForm } from "@/components/PersonalInformationForm"
import { ConfirmationStep } from "@/components/ConfirmationStep"
import { useWizard } from "@/contexts/WizardContext"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Wizard() {
  const { currentStep, totalSteps, nextStep, previousStep } = useWizard()

  const steps = [
    { number: 1, title: "Adresse & E-Mail", description: "Grundinformationen" },
    { number: 2, title: "Persönliche Daten", description: "Währung & Einstellungen" },
    { number: 3, title: "Bestätigung", description: "Überprüfung & Absenden" },
  ]

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <AddressForm />
            <EmailForm />
          </div>
        )
      case 2:
        return <PersonalInformationForm />
      case 3:
        return <ConfirmationStep />
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stepper */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.number
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 transition-all ${
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="mb-8">{renderStep()}</div>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Zurück
            </Button>
            {currentStep < totalSteps && (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Weiter
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

