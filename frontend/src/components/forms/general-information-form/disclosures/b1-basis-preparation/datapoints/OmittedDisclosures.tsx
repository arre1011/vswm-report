import {SelectWithInfo} from "@/components/ui/select-with-info.tsx";



const omittedDisclosuresOptions = [
    {value:"None", label: "None"},
    {value:"B1 – Basis for preparation", label: "B1 – Basis for preparation"},
    {value:"B2 – Practices, policies and future initiatives for transitioning towards a more sustainable economy", label: "B2 – Practices, policies and future initiatives for transitioning towards a more sustainable economy"},
    {value:"B3 – Energy and greenhouse gas emissions", label: "B3 – Energy and greenhouse gas emissions"},
    {value:"B4 – Pollution of air, water and soil", label: "B4 – Pollution of air, water and soil"},
    {value:"B5 – Biodiversity", label: "B5 – Biodiversity"},
    {value:"B6 – Water", label: "B6 – Water"},
    {value:"B7 – Resource use, circular economy and waste management", label: "B7 – Resource use, circular economy and waste management"},
    {value:"B8 – Workforce – General characteristics", label: "B8 – Workforce – General characteristics"},
    {value:"B9 – Workforce – Health and safety", label: "B9 – Workforce – Health and safety"},
    {value:"B10 – Workforce – Remuneration, collective bargaining and training", label: "B10 – Workforce – Remuneration, collective bargaining and training"},
    {value:"B11 – Convictions and fines for corruption and bribery", label: "B11 – Convictions and fines for corruption and bribery"},
]

interface OmittedDisclosuresProbs{
    value: string
    onChange: (value: string) => void
}

export function OmittedDisclosures({value, onChange}: OmittedDisclosuresProbs){
    return(
    <SelectWithInfo
        id="omittedDisclosures"
        label="List of omitted disclosures"
        value={value}
        onValueChange={onChange}
        options={omittedDisclosuresOptions}
        placeholder="choose omitted"
        infoTitle="List of omitted disclosures"
        infoDescription="List of omitted disclosures deemed to be classified or sensitive information"
    />
    )
}