import { useState } from "react"
import { Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SelectWithInfoProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  infoTitle: string
  infoDescription: string
  containerClassName?: string
  selectClassName?: string
  id?: string
}

export function SelectWithInfo({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Auswählen",
  infoTitle,
  infoDescription,
  containerClassName,
  selectClassName,
  id,
}: SelectWithInfoProps) {
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
      <Select value={value || undefined} onValueChange={onValueChange}>
        <SelectTrigger id={id} className={selectClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

