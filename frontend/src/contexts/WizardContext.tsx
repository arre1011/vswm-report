import { createContext, useContext, useState, ReactNode } from "react"

export type BasisModuleOption = "" | "Basic" | "Basic & Comprehensive"
export type ReportingBasisOption = "" | "Consolidated" | "Individual"
export type EmployeeCountingMethod =
  | ""
  | "Headcount"
  | "Full-time equivalent"
  | "Both"

export interface GeneralInformationData {
  entityName: string
  entityIdentifier: string
  currency: string
  reportingPeriodStart?: Date
  reportingPeriodEnd?: Date
  basisModule: BasisModuleOption
  basisForReporting: ReportingBasisOption
  omittedDisclosures?: string
  turnover?: string
  employeeCount?: string
  employeeCountingMethod: EmployeeCountingMethod
  primaryCountry?: string
  previousReportLink?: string
}

export interface EnvironmentalDisclosuresData {
  totalEnergyConsumption?: string
  scope1Emissions?: string
  scope2Emissions?: string
  scope3Emissions?: string
  ghgIntensity?: string
  hasTransitionPlan: "" | "yes" | "no"
  transitionPlanDescription?: string
}

export interface SocialDisclosuresData {
  employeeMethodology: EmployeeCountingMethod
  totalEmployees?: string
  permanentEmployees?: string
  temporaryEmployees?: string
  turnoverRate?: string
  accidentRate?: string
  fatalities?: string
}

export interface GovernanceDisclosuresData {
  hasAntiCorruptionConvictions: "" | "yes" | "no"
  convictionsCount?: string
  antiCorruptionFines?: string
  fossilFuelRevenue?: string
  femaleBoardMembers?: string
  maleBoardMembers?: string
}

export interface WizardData {
  generalInformation: GeneralInformationData
  environmentalDisclosures: EnvironmentalDisclosuresData
  socialDisclosures: SocialDisclosuresData
  governanceDisclosures: GovernanceDisclosuresData
}

interface WizardContextType {
  data: WizardData
  currentStep: number
  totalSteps: number
  updateGeneralInformation: (data: Partial<GeneralInformationData>) => void
  updateEnvironmentalDisclosures: (data: Partial<EnvironmentalDisclosuresData>) => void
  updateSocialDisclosures: (data: Partial<SocialDisclosuresData>) => void
  updateGovernanceDisclosures: (data: Partial<GovernanceDisclosuresData>) => void
  nextStep: () => void
  previousStep: () => void
  goToStep: (step: number) => void
  resetWizard: () => void
  submitData: () => Promise<void>
  isSubmitting: boolean
  submitError: string | null
}

const initialData: WizardData = {
  generalInformation: {
    entityName: "",
    entityIdentifier: "",
    currency: "",
    reportingPeriodStart: undefined,
    reportingPeriodEnd: undefined,
    basisModule: "",
    basisForReporting: "",
    omittedDisclosures: "",
    turnover: "",
    employeeCount: "",
    employeeCountingMethod: "",
    primaryCountry: "",
    previousReportLink: "",
  },
  environmentalDisclosures: {
    totalEnergyConsumption: "",
    scope1Emissions: "",
    scope2Emissions: "",
    scope3Emissions: "",
    ghgIntensity: "",
    hasTransitionPlan: "",
    transitionPlanDescription: "",
  },
  socialDisclosures: {
    employeeMethodology: "",
    totalEmployees: "",
    permanentEmployees: "",
    temporaryEmployees: "",
    turnoverRate: "",
    accidentRate: "",
    fatalities: "",
  },
  governanceDisclosures: {
    hasAntiCorruptionConvictions: "",
    convictionsCount: "",
    antiCorruptionFines: "",
    fossilFuelRevenue: "",
    femaleBoardMembers: "",
    maleBoardMembers: "",
  },
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WizardData>(initialData)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const totalSteps = 5

  const updateGeneralInformation = (newData: Partial<GeneralInformationData>) => {
    setData((prev) => ({
      ...prev,
      generalInformation: { ...prev.generalInformation, ...newData },
    }))
  }

  const updateEnvironmentalDisclosures = (
    newData: Partial<EnvironmentalDisclosuresData>,
  ) => {
    setData((prev) => ({
      ...prev,
      environmentalDisclosures: { ...prev.environmentalDisclosures, ...newData },
    }))
  }

  const updateSocialDisclosures = (newData: Partial<SocialDisclosuresData>) => {
    setData((prev) => ({
      ...prev,
      socialDisclosures: { ...prev.socialDisclosures, ...newData },
    }))
  }

  const updateGovernanceDisclosures = (
    newData: Partial<GovernanceDisclosuresData>,
  ) => {
    setData((prev) => ({
      ...prev,
      governanceDisclosures: { ...prev.governanceDisclosures, ...newData },
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
          generalInformation: {
            ...data.generalInformation,
            reportingPeriodStart: data.generalInformation.reportingPeriodStart
              ? data.generalInformation.reportingPeriodStart.toISOString().split("T")[0]
              : null,
            reportingPeriodEnd: data.generalInformation.reportingPeriodEnd
              ? data.generalInformation.reportingPeriodEnd.toISOString().split("T")[0]
              : null,
          },
          environmentalDisclosures: {
            ...data.environmentalDisclosures,
          },
          socialDisclosures: {
            ...data.socialDisclosures,
          },
          governanceDisclosures: {
            ...data.governanceDisclosures,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `Server-Fehler: ${response.status} ${response.statusText}`,
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
        errorMessage =
          "Verbindungsfehler: Das Backend ist nicht erreichbar. Stellen Sie sicher, dass der Server auf Port 8080 läuft."
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
        updateGeneralInformation,
        updateEnvironmentalDisclosures,
        updateSocialDisclosures,
        updateGovernanceDisclosures,
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

