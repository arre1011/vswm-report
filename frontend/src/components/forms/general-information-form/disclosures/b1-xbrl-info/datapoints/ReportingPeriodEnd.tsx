import { DatePickerWithInfo } from "@/components/ui/date-picker-with-info.tsx"

interface ReportingPeriodFieldProps {
  date?: Date
  onChange: (date?: Date) => void
}

export function ReportingPeriodEndField({ date, onChange }: ReportingPeriodFieldProps) {
  return (
    <DatePickerWithInfo
      id="reportingPeriodEnd"
      label="Reporting end date"
      date={date}
      onDateChange={onChange}
      placeholder="Choose an end Date"
      infoTitle="Reporting period end date"
      infoDescription="If VALUE not Valid, please ensure that the reporting period end date is greater than the reporting period start date."
    />
  )
}
