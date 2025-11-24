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
  entityIdentifierScheme: string
  currency: string
  reportingPeriodStart?: Date
  reportingPeriodEnd?: Date
  basisForPreparation: string
  basisForReporting: string
  omittedDisclosures: string
    sizeOfBalanceSheet:string
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

interface ExcelDatapointPayload {
  datapointId: string
  values: string
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
    entityIdentifierScheme: "",
    currency: "",
    reportingPeriodStart: undefined,
    reportingPeriodEnd: undefined,
    basisForPreparation: "",
    basisForReporting: "",
    omittedDisclosures: "",
      sizeOfBalanceSheet: "",
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

type PrimitiveInput = string | number | boolean | Date | null | undefined

const buildDatapointsFromWizard = (wizardData: WizardData): ExcelDatapointPayload[] => {
  const datapoints: ExcelDatapointPayload[] = []

  const addValue = (datapointId: string, value?: PrimitiveInput) => {
    if (value === undefined || value === null) {
      return
    }
    if (typeof value === "string" && value.trim() === "") {
      return
    }
    if (typeof value === "number" && Number.isNaN(value)) {
      return
    }

    const normalizedValue =
      value instanceof Date
        ? value.toISOString().split("T")[0]
        : typeof value === "boolean"
        ? value
          ? "true"
          : "false"
        : value

    datapoints.push({
      datapointId,
      values: String(normalizedValue),
    })
  }

  const addSectionValues = (
    section: Record<string, PrimitiveInput>,
    options: { skip?: string[] } = {},
  ) => {
    Object.entries(section).forEach(([key, value]) => {
      if (options.skip?.includes(key)) {
        return
      }
      addValue(key, value)
    })
  }

  const addDateParts = (baseId: string, date?: Date) => {
    if (!date) {
      return
    }
    addValue(baseId, date)
    addValue(`${baseId}Year`, date.getFullYear())
    addValue(`${baseId}Month`, date.getMonth() + 1)
    addValue(`${baseId}Day`, date.getDate())
  }

  const { generalInformation, environmentalDisclosures, socialDisclosures, governanceDisclosures } =
    wizardData

  addSectionValues(generalInformation as unknown as Record<string, PrimitiveInput>, {
    skip: ["reportingPeriodStart", "reportingPeriodEnd"],
  })
  addSectionValues(environmentalDisclosures as unknown as Record<string, PrimitiveInput>)
  addSectionValues(socialDisclosures as unknown as Record<string, PrimitiveInput>)
  addSectionValues(governanceDisclosures as unknown as Record<string, PrimitiveInput>)

  addDateParts("reportingPeriodStart", generalInformation.reportingPeriodStart)
  addDateParts("reportingPeriodEnd", generalInformation.reportingPeriodEnd)

  return datapoints
}

const extractFilename = (contentDisposition: string | null): string | null => {
  if (!contentDisposition) {
    return null
  }

  const utf8FilenameMatch = contentDisposition.match(/filename\\*=UTF-8''(?<filename>[^;]+)/i)
  if (utf8FilenameMatch?.groups?.filename) {
    return decodeURIComponent(utf8FilenameMatch.groups.filename)
  }

  const asciiFilenameMatch = contentDisposition.match(/filename=\"?(?<filename>[^\";]+)\"?/i)
  return asciiFilenameMatch?.groups?.filename ?? null
}

const triggerExcelDownload = (blob: Blob, fallbackFilename?: string) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download =
    fallbackFilename && fallbackFilename.trim().length > 0
      ? fallbackFilename
      : `VSME_Report_${new Date().toISOString().split("T")[0]}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

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

    const datapoints = buildDatapointsFromWizard(data)
    if (datapoints.length === 0) {
      const errorMessage = "Keine Eingaben gefunden. Bitte füllen Sie mindestens ein Feld aus."
      set({ submitError: errorMessage, isSubmitting: false })
      throw new Error(errorMessage)
    }

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"
      const response = await fetch(`${apiBaseUrl}/excel-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        body: JSON.stringify(datapoints),
      })

      if (!response.ok) {
        let errorMessage = `Server-Fehler: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          if (errorData?.message) {
            errorMessage = errorData.message
          }
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(errorMessage)
      }

      const blob = await response.blob()
      const filename = extractFilename(response.headers.get("Content-Disposition"))
      triggerExcelDownload(blob, filename ?? undefined)
    } catch (error) {
      let errorMessage = "Backend ist nicht erreichbar. Bitte versuchen Sie es später erneut."

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage =
          "Verbindungsfehler: Das Backend ist nicht erreichbar. Stellen Sie sicher, dass der Server läuft."
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
