import {SelectWithInfo} from "@/components/ui/select-with-info.tsx";


const basisForReportingOptions = [
    {value: "Sustainability report prepared on an individual basis", label: "Sustainability report prepared on an individual basis"},
    {value: "Sustainability report prepared on a consolidated basis", label: "Sustainability report prepared on a consolidated basis"},
]

interface BasisForReportingProbs{
    value: string
    onChange: (value: string) => void
}

export function BasisForReporting({value, onChange}: BasisForReportingProbs){
    return(
        <SelectWithInfo
            id="basisForReporting"
            label="Basis for reporting"
            value={value}
            onValueChange={onChange}
            options={basisForReportingOptions}
            placeholder="Feld wählen"
            infoTitle="Basis for reporting (consolidated or individual basis)"
            infoDescription="Basis for reporting (consolidated or individual basis)"
        />
    )
}