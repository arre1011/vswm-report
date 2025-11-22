import {SelectWithInfo} from "@/components/ui/select-with-info.tsx";


const basisModuleOptions = [
    {value: "A", label: "Option A (Basic Module only)" },
    { value: "BasisForPreparation", label: "Option B (Basic Module and Comprehensive Module)"},
]

interface BasisModuleProbs {
    value: string
    onChange: (vlaue: string) => void
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