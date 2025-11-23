import {SelectWithInfo} from "@/components/ui/select-with-info.tsx";


const basisModuleOptions = [
    {value: "Option A (Basic Module only)", label: "Option A (Basic Module only)" },
    {value: "Option B (Basic Module and Comprehensive Module)", label: "Option B (Basic Module and Comprehensive Module)"},
]

interface BasisModuleProbs {
    value: string
    onChange: (value: string) => void
}


export function BasisModuleField({value, onChange}: BasisModuleProbs) {
    return (
        <SelectWithInfo
            id="basisForPreparation"
            label="Basis for preparation (Module selection)"
            value={value}
            onValueChange={onChange}
            options={basisModuleOptions}
            placeholder="Modul wählen"
            infoTitle="Basis for Preparation"
            infoDescription="Basis for preparation (Basic Module Only or Basic & Comprehensive Module)	"
        />
    )
}