import { createContext, useContext, useState, ReactNode } from "react"

export interface AddressData {
  name: string
  street: string
  houseNumber: string
  city: string
}

export interface EmailData {
  email: string
  confirmEmail: string
}

export interface PersonalData {
  currency: "EUR" | "USD" | "GBP" | "JPY"
  dateOfBirth?: Date
}

export interface WizardData {
  address: AddressData
  email: EmailData
  personal: PersonalData
}

interface WizardContextType {
  data: WizardData
  currentStep: number
  totalSteps: number
  updateAddressData: (data: Partial<AddressData>) => void
  updateEmailData: (data: Partial<EmailData>) => void
  updatePersonalData: (data: Partial<PersonalData>) => void
  nextStep: () => void
  previousStep: () => void
  goToStep: (step: number) => void
  resetWizard: () => void
  submitData: () => Promise<void>
  isSubmitting: boolean
  submitError: string | null
}

const initialData: WizardData = {
  address: {
    name: "",
    street: "",
    houseNumber: "",
    city: "",
  },
  email: {
    email: "",
    confirmEmail: "",
  },
  personal: {
    currency: "EUR",
    dateOfBirth: undefined,
  },
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WizardData>(initialData)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const totalSteps = 3

  const updateAddressData = (newData: Partial<AddressData>) => {
    setData((prev) => ({
      ...prev,
      address: { ...prev.address, ...newData },
    }))
  }

  const updateEmailData = (newData: Partial<EmailData>) => {
    setData((prev) => ({
      ...prev,
      email: { ...prev.email, ...newData },
    }))
  }

  const updatePersonalData = (newData: Partial<PersonalData>) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...newData },
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }

  const resetWizard = () => {
    setData(initialData)
    setCurrentStep(1)
    setSubmitError(null)
  }

  const submitData = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("http://localhost:8080/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          personal: {
            ...data.personal,
            dateOfBirth: data.personal.dateOfBirth
              ? data.personal.dateOfBirth.toISOString().split("T")[0]
              : null,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `Server-Fehler: ${response.status} ${response.statusText}`
        )
      }

      const result = await response.json()
      console.log("Daten erfolgreich gesendet:", result)
      
      if (!result.success) {
        throw new Error(result.message || "Fehler beim Verarbeiten der Daten")
      }
    } catch (error) {
      let errorMessage = "Backend ist nicht erreichbar. Bitte versuchen Sie es später erneut."
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "Verbindungsfehler: Das Backend ist nicht erreichbar. Stellen Sie sicher, dass der Server auf Port 8080 läuft."
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      setSubmitError(errorMessage)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <WizardContext.Provider
      value={{
        data,
        currentStep,
        totalSteps,
        updateAddressData,
        updateEmailData,
        updatePersonalData,
        nextStep,
        previousStep,
        goToStep,
        resetWizard,
        submitData,
        isSubmitting,
        submitError,
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider")
  }
  return context
}

