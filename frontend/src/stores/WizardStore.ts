import { create, StoreApi } from "zustand"

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

interface WizardState {
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

const TOTAL_STEPS = 5

const createInitialWizardData = (): WizardData => ({
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
})

type WizardStoreSet = StoreApi<WizardState>["setState"]
type WizardStoreGet = StoreApi<WizardState>["getState"]

const createWizardStore = (set: WizardStoreSet, get: WizardStoreGet): WizardState => ({
  data: createInitialWizardData(),
  currentStep: 1,
  totalSteps: TOTAL_STEPS,
  isSubmitting: false,
  submitError: null,
  updateGeneralInformation: (newData: Partial<GeneralInformationData>) =>
    set((state: WizardState) => ({
      data: {
        ...state.data,
        generalInformation: { ...state.data.generalInformation, ...newData },
      },
    })),
  updateEnvironmentalDisclosures: (newData: Partial<EnvironmentalDisclosuresData>) =>
    set((state: WizardState) => ({
      data: {
        ...state.data,
        environmentalDisclosures: { ...state.data.environmentalDisclosures, ...newData },
      },
    })),
  updateSocialDisclosures: (newData: Partial<SocialDisclosuresData>) =>
    set((state: WizardState) => ({
      data: {
        ...state.data,
        socialDisclosures: { ...state.data.socialDisclosures, ...newData },
      },
    })),
  updateGovernanceDisclosures: (newData: Partial<GovernanceDisclosuresData>) =>
    set((state: WizardState) => ({
      data: {
        ...state.data,
        governanceDisclosures: { ...state.data.governanceDisclosures, ...newData },
      },
    })),
  nextStep: () =>
    set((state: WizardState) =>
      state.currentStep < state.totalSteps ? { currentStep: state.currentStep + 1 } : state,
    ),
  previousStep: () =>
    set((state: WizardState) =>
      state.currentStep > 1 ? { currentStep: state.currentStep - 1 } : state,
    ),
  goToStep: (step: number) =>
    set((state: WizardState) =>
      step >= 1 && step <= state.totalSteps ? { currentStep: step } : state,
    ),
  resetWizard: () =>
    set({
      data: createInitialWizardData(),
      currentStep: 1,
      submitError: null,
    }),
  submitData: async () => {
    set({ isSubmitting: true, submitError: null })
    const { data } = get()

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

      set({ submitError: errorMessage })
      throw error
    } finally {
      set({ isSubmitting: false })
    }
  },
})

export const useWizard = create<WizardState>(createWizardStore)

