import {InputWithInfo} from "@/components/ui/input-with-info.tsx";
import {ChangeEvent} from "react";


interface SizeOfBalanceSheetProbs{
    value: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}


export function SizeOfBalanceSheet({value, onChange}: SizeOfBalanceSheetProbs){
    return (
        <InputWithInfo
            id="sizeOfBalanceSheet"
            label="Size of balance sheet (total assets) in 	"
            value={value}
            onChange={onChange}
            placeholder="choose omitted"
            infoTitle="List of omitted disclosures"
            infoDescription="List of omitted disclosures deemed to be classified or sensitive information"
        />
    )
}