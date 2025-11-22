import { DatePickerWithInfo } from "@/components/ui/date-picker-with-info.tsx"

interface ReportingPeriodFieldProps {
  date?: Date
  onChange: (date?: Date) => void
}

export function ReportingPeriodStartField({ date, onChange }: ReportingPeriodFieldProps) {
  return (
    <DatePickerWithInfo
      id="reportingPeriodStart"
      label="Reporting start date"
      date={date}
      onDateChange={onChange}
      placeholder="Choose a start Date"
      infoTitle="Reporting period start date"
      infoDescription="If VALUE not Valid, please ensure that the reporting period end date is greater than the reporting period start date."
    />
  )
}
