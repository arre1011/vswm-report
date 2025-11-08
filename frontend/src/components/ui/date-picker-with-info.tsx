import { useState } from "react"
import { Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface DatePickerWithInfoProps {
  label: string
  date?: Date
  onDateChange: (date: Date | undefined) => void
  placeholder?: string
  infoTitle: string
  infoDescription: string
  containerClassName?: string
  className?: string
  disabled?: (date: Date) => boolean
  id?: string
}

export function DatePickerWithInfo({
  label,
  date,
  onDateChange,
  placeholder = "Datum auswählen",
  infoTitle,
  infoDescription,
  containerClassName,
  className,
  disabled,
  id,
}: DatePickerWithInfoProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <div className="flex items-center gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 h-5 w-5 text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:scale-110"
              aria-label={`Informationen zu ${label}`}
              title={`Informationen zu ${label}`}
            >
              <Info className="h-3 w-3" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{infoTitle}</DialogTitle>
              <DialogDescription className="pt-4 text-base leading-relaxed whitespace-pre-line">
                {infoDescription}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <DatePicker
        date={date}
        onDateChange={onDateChange}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />
    </div>
  )
}

