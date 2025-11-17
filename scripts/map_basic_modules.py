#!/usr/bin/env python3
"""
Map all Basic Modules (B1-B11) with complete datapoint and Named Range mappings
"""
import sys
import json
import re
from collections import defaultdict

try:
    import openpyxl
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "openpyxl"])
    import openpyxl


def load_named_ranges(wb):
    """Load all named ranges"""
    named_ranges = {}
    for name_str, definition in wb.defined_names.items():
        try:
            destinations = list(definition.destinations)
            if destinations:
                sheet_name, cell_ref = destinations[0]
                named_ranges[name_str] = {
                    'name': name_str,
                    'sheet': sheet_name,
                    'cellRef': cell_ref,
                    'reference': f"'{sheet_name}'!{cell_ref}"
                }
        except:
            pass
    return named_ranges


def create_datapoint_id(label):
    """Create camelCase datapoint ID from label"""
    # Remove special characters and module codes
    clean_label = re.sub(r'\[.*?\]', '', label)
    clean_label = re.sub(r'\b[BC]\d+\b\s*[-–]\s*', '', clean_label)
    clean_label = re.sub(r'from\s*-\s*to\s*-', '', clean_label)
    
    # Split into words
    words = re.findall(r'\b[a-zA-Z]+\b', clean_label)
    
    if not words:
        return "unknownField"
    
    # Create camelCase
    result = words[0].lower()
    for word in words[1:]:
        if len(word) > 2:  # Skip very short words
            result += word.capitalize()
    
    return result[:50]  # Limit length


def find_best_named_range(label, row, sheet_name, named_ranges, used_ranges):
    """Find the best matching named range for a field"""
    # Extract key terms from label
    label_lower = label.lower()
    label_words = set(re.findall(r'\b\w{4,}\b', label_lower))
    
    best_match = None
    best_score = 0
    
    for range_name, range_info in named_ranges.items():
        if range_info['sheet'] != sheet_name:
            continue
        
        if range_name in used_ranges:
            continue
        
        range_name_lower = range_name.lower()
        range_words = set(re.findall(r'\b\w{3,}\b', range_name_lower))
        
        # Calculate match score
        common_words = label_words & range_words
        score = len(common_words)
        
        # Boost score if range name contains module code
        module_match = re.search(r'\b([BC]\d+)\b', label)
        if module_match and module_match.group(1).lower() in range_name_lower:
            score += 2
        
        if score > best_score:
            best_score = score
            best_match = range_name
    
    return best_match


def map_module_b1(ws, named_ranges):
    """Map B1: Basis for Preparation"""
    module = {
        "moduleId": "module-b1",
        "moduleCode": "B1",
        "moduleName": {
            "en": "Basis for Preparation",
            "de": "Grundlagen der Berichtserstellung"
        },
        "description": {
            "en": "Basic information about the reporting entity and reporting period",
            "de": "Grundlegende Informationen über das berichterstattende Unternehmen und den Berichtszeitraum"
        },
        "moduleType": "basic",
        "sheet": "General Information",
        "disclosures": []
    }
    
    # Disclosure 1: XBRL Information
    disclosure_xbrl = {
        "disclosureId": "b1-xbrl-info",
        "disclosureName": {
            "en": "Information necessary for XBRL",
            "de": "Für XBRL notwendige Informationen"
        },
        "required": True,
        "paragraphReference": "N/A",
        "datapoints": [
            {
                "datapointId": "entityName",
                "label": {"en": "Name of the reporting entity", "de": "Name des berichterstattenden Unternehmens"},
                "dataType": "text",
                "required": True,
                "excelNamedRange": "NameOfReportingEntity",
                "excelReference": "'General Information'!$D$3"
            },
            {
                "datapointId": "entityIdentifier",
                "label": {"en": "Identifier of the reporting entity", "de": "Kennung des berichterstattenden Unternehmens"},
                "dataType": "text",
                "required": True,
                "excelNamedRange": "IdentifierOfReportingEntity",
                "excelReference": "'General Information'!$D$4"
            },
            {
                "datapointId": "currency",
                "label": {"en": "Currency of monetary values", "de": "Währung der monetären Werte"},
                "dataType": "select",
                "required": True,
                "excelNamedRange": "CurrencyUsedInReport",
                "excelReference": "'General Information'!$D$5",
                "options": [
                    {"value": "EUR", "label": {"en": "Euro (EUR)", "de": "Euro (EUR)"}},
                    {"value": "USD", "label": {"en": "US Dollar (USD)", "de": "US-Dollar (USD)"}},
                    {"value": "GBP", "label": {"en": "British Pound (GBP)", "de": "Britisches Pfund (GBP)"}},
                    {"value": "CHF", "label": {"en": "Swiss Franc (CHF)", "de": "Schweizer Franken (CHF)"}}
                ]
            },
            {
                "datapointId": "reportingPeriodStartYear",
                "label": {"en": "Starting year", "de": "Startjahr"},
                "dataType": "number",
                "required": True,
                "excelNamedRange": "StartingYearOfReportingPeriod",
                "excelReference": "'General Information'!$D$6"
            },
            {
                "datapointId": "reportingPeriodStartMonth",
                "label": {"en": "Starting month", "de": "Startmonat"},
                "dataType": "number",
                "required": True,
                "excelNamedRange": "StartingMonthOfReportingPeriod",
                "excelReference": "'General Information'!$D$7"
            },
            {
                "datapointId": "reportingPeriodStartDay",
                "label": {"en": "Starting day", "de": "Starttag"},
                "dataType": "number",
                "required": True,
                "excelNamedRange": "StartingDayOfReportingPeriod",
                "excelReference": "'General Information'!$D$8"
            },
            {
                "datapointId": "reportingPeriodEndYear",
                "label": {"en": "Ending year", "de": "Endjahr"},
                "dataType": "number",
                "required": True,
                "excelNamedRange": "EndingYearOfReportingPeriod",
                "excelReference": "'General Information'!$D$10"
            },
            {
                "datapointId": "reportingPeriodEndMonth",
                "label": {"en": "Ending month", "de": "Endmonat"},
                "dataType": "number",
                "required": True,
                "excelNamedRange": "EndingMonthOfReportingPeriod",
                "excelReference": "'General Information'!$D$11"
            },
            {
                "datapointId": "reportingPeriodEndDay",
                "label": {"en": "Ending day", "de": "Endtag"},
                "dataType": "number",
                "required": True,
                "excelNamedRange": "EndingDayOfReportingPeriod",
                "excelReference": "'General Information'!$D$12"
            }
        ]
    }
    
    # Disclosure 2: Basis for Preparation
    disclosure_basis = {
        "disclosureId": "b1-basis-preparation",
        "disclosureName": {
            "en": "Basis for Preparation and general information",
            "de": "Grundlagen der Berichtserstellung und allgemeine Informationen"
        },
        "required": True,
        "paragraphReference": "24(a-e)",
        "datapoints": [
            {
                "datapointId": "basisForPreparation",
                "label": {"en": "Basis for preparation (Module selection)", "de": "Grundlage für die Erstellung (Modulauswahl)"},
                "dataType": "select",
                "required": True,
                "excelNamedRange": "BasisForPreparation",
                "excelReference": "'General Information'!$E$32",
                "options": [
                    {"value": "Basic Module Only", "label": {"en": "Basic Module Only", "de": "Nur Basismodul"}},
                    {"value": "Basic & Comprehensive", "label": {"en": "Basic & Comprehensive", "de": "Basis & Umfassend"}}
                ]
            },
            {
                "datapointId": "omittedDisclosures",
                "label": {"en": "List of omitted disclosures", "de": "Liste der weggelassenen Angaben"},
                "dataType": "textarea",
                "required": False,
                "excelNamedRange": "ListOfDisclosuresOmittedDueToClassifiedInformationOrExemption",
                "excelReference": "'General Information'!$E$33"
            },
            {
                "datapointId": "basisForReporting",
                "label": {"en": "Basis for reporting (Consolidated or Individual)", "de": "Grundlage für die Berichterstattung (Konsolidiert oder Individuell)"},
                "dataType": "select",
                "required": True,
                "excelNamedRange": "BasisForReporting",
                "excelReference": "'General Information'!$E$42",
                "options": [
                    {"value": "Consolidated", "label": {"en": "Consolidated", "de": "Konsolidiert"}},
                    {"value": "Individual", "label": {"en": "Individual", "de": "Individuell"}}
                ]
            },
            {
                "datapointId": "legalForm",
                "label": {"en": "Undertaking's legal form", "de": "Rechtsform des Unternehmens"},
                "dataType": "text",
                "required": True,
                "excelNamedRange": "UndertakingsLegalForm",
                "excelReference": "'General Information'!$E$43"
            },
            {
                "datapointId": "naceSectorCode",
                "label": {"en": "NACE sector classification code(s)", "de": "NACE Branchenklassifizierungscode(s)"},
                "dataType": "text",
                "required": True,
                "excelNamedRange": "NACESectorClassificationCode",
                "excelReference": "'General Information'!$E$45"
            },
            {
                "datapointId": "turnover",
                "label": {"en": "Total turnover", "de": "Gesamtumsatz"},
                "dataType": "number",
                "required": True,
                "excelNamedRange": "Turnover",
                "excelReference": "'General Information'!$E$61",
                "unit": "currency"
            },
            {
                "datapointId": "numberOfEmployees",
                "label": {"en": "Number of employees", "de": "Anzahl der Mitarbeiter"},
                "dataType": "number",
                "required": True,
                "excelNamedRange": "NumberOfEmployees",
                "excelReference": "'General Information'!$E$62"
            },
            {
                "datapointId": "primaryCountry",
                "label": {"en": "Country of primary operations", "de": "Land der Haupttätigkeit"},
                "dataType": "text",
                "required": True,
                "excelNamedRange": "CountryOfPrimaryOperationsAndLocationOfSignificantAssets",
                "excelReference": "'General Information'!$E$65"
            }
        ]
    }
    
    # Disclosure 3: List of Subsidiaries
    disclosure_subsidiaries = {
        "disclosureId": "b1-subsidiaries",
        "disclosureName": {
            "en": "List of subsidiaries",
            "de": "Liste der Tochtergesellschaften"
        },
        "required": False,
        "paragraphReference": "24(d)",
        "datapoints": [
            {
                "datapointId": "listOfSubsidiaries",
                "label": {"en": "List of subsidiaries", "de": "Liste der Tochtergesellschaften"},
                "dataType": "table",
                "required": False,
                "excelStartRow": 70,
                "minRows": 0,
                "maxRows": 20,
                "columns": [
                    {
                        "datapointId": "subsidiaryName",
                        "label": {"en": "Name", "de": "Name"},
                        "dataType": "text",
                        "excelNamedRange": "NameOfSubsidiary"
                    },
                    {
                        "datapointId": "subsidiaryIdentifier",
                        "label": {"en": "Identifier", "de": "Kennung"},
                        "dataType": "text",
                        "excelNamedRange": "IdentifierOfSubsidiary"
                    },
                    {
                        "datapointId": "subsidiaryCountry",
                        "label": {"en": "Country", "de": "Land"},
                        "dataType": "text",
                        "excelNamedRange": "SubsidiaryPrincipalPlaceOfBusiness"
                    }
                ]
            }
        ]
    }
    
    # Disclosure 4: List of Sites
    disclosure_sites = {
        "disclosureId": "b1-sites",
        "disclosureName": {
            "en": "List of site(s)",
            "de": "Liste der Standorte"
        },
        "required": True,
        "paragraphReference": "24(f)",
        "datapoints": [
            {
                "datapointId": "listOfSites",
                "label": {"en": "List of site(s)", "de": "Liste der Standorte"},
                "dataType": "table",
                "required": True,
                "excelStartRow": 109,
                "minRows": 1,
                "maxRows": 25,
                "columns": [
                    {
                        "datapointId": "siteId",
                        "label": {"en": "Site ID", "de": "Standort-ID"},
                        "dataType": "text",
                        "excelNamedRange": "SiteIdentifier"
                    },
                    {
                        "datapointId": "siteName",
                        "label": {"en": "Site Name", "de": "Standortname"},
                        "dataType": "text",
                        "excelNamedRange": "NameOfSite"
                    },
                    {
                        "datapointId": "siteAddress",
                        "label": {"en": "Address", "de": "Adresse"},
                        "dataType": "text",
                        "excelNamedRange": "AddressOfSite"
                    },
                    {
                        "datapointId": "siteCity",
                        "label": {"en": "City", "de": "Stadt"},
                        "dataType": "text",
                        "excelNamedRange": "CityOfSite"
                    },
                    {
                        "datapointId": "siteCountry",
                        "label": {"en": "Country", "de": "Land"},
                        "dataType": "text",
                        "excelNamedRange": "CountryOfSite"
                    }
                ]
            }
        ]
    }
    
    module["disclosures"] = [
        disclosure_xbrl,
        disclosure_basis,
        disclosure_subsidiaries,
        disclosure_sites
    ]
    
    return module


def map_module_b3(ws, named_ranges):
    """Map B3: Energy and GHG Emissions"""
    module = {
        "moduleId": "module-b3",
        "moduleCode": "B3",
        "moduleName": {
            "en": "Energy and greenhouse gas emissions",
            "de": "Energie und Treibhausgasemissionen"
        },
        "description": {
            "en": "Total energy consumption and GHG emissions reporting",
            "de": "Gesamtenergieverbrauch und THG-Emissionsberichterstattung"
        },
        "moduleType": "basic",
        "sheet": "Environmental Disclosures",
        "disclosures": [
            {
                "disclosureId": "b3-energy",
                "disclosureName": {
                    "en": "Total Energy Consumption",
                    "de": "Gesamtenergieverbrauch"
                },
                "required": True,
                "datapoints": [
                    {
                        "datapointId": "totalEnergyConsumption",
                        "label": {"en": "Total Energy Consumption (in MWh)", "de": "Gesamtenergieverbrauch (in MWh)"},
                        "dataType": "number",
                        "required": True,
                        "excelNamedRange": "TotalEnergyConsumption",
                        "excelReference": "'Environmental Disclosures'!$G$5",
                        "unit": "MWh"
                    }
                ]
            },
            {
                "disclosureId": "b3-ghg-emissions",
                "disclosureName": {
                    "en": "Greenhouse Gas Emissions",
                    "de": "Treibhausgasemissionen"
                },
                "required": True,
                "datapoints": [
                    {
                        "datapointId": "scope1Emissions",
                        "label": {"en": "Gross Scope 1 GHG emissions (tCO2e)", "de": "Brutto Scope 1 THG-Emissionen (tCO2e)"},
                        "dataType": "number",
                        "required": True,
                        "excelNamedRange": "TotalGrossScope1GreenhouseGasEmissions",
                        "unit": "tCO2e"
                    },
                    {
                        "datapointId": "scope2EmissionsLocation",
                        "label": {"en": "Gross Scope 2 GHG emissions - Location based (tCO2e)", "de": "Brutto Scope 2 THG-Emissionen - Standortbasiert (tCO2e)"},
                        "dataType": "number",
                        "required": True,
                        "excelNamedRange": "TotalGrossLocationBasedGHGEmissions",
                        "unit": "tCO2e"
                    },
                    {
                        "datapointId": "scope3Emissions",
                        "label": {"en": "Total Scope 3 GHG emissions (tCO2e)", "de": "Gesamt Scope 3 THG-Emissionen (tCO2e)"},
                        "dataType": "number",
                        "required": False,
                        "excelNamedRange": "TotalScope3GreenhouseGasEmissions",
                        "unit": "tCO2e"
                    }
                ]
            },
            {
                "disclosureId": "b3-ghg-intensity",
                "disclosureName": {
                    "en": "GHG Emission Intensity",
                    "de": "THG-Emissionsintensität"
                },
                "required": True,
                "datapoints": [
                    {
                        "datapointId": "ghgIntensityPerTurnover",
                        "label": {"en": "GHG emission intensity per turnover (tCO2e per million currency)", "de": "THG-Emissionsintensität pro Umsatz (tCO2e pro Million Währung)"},
                        "dataType": "number",
                        "required": True,
                        "excelNamedRange": "GreenhouseGasEmissionIntensityPerTurnover",
                        "unit": "tCO2e/M€"
                    }
                ]
            }
        ]
    }
    
    return module


def map_module_b8(ws, named_ranges):
    """Map B8: Workforce - General Characteristics"""
    module = {
        "moduleId": "module-b8",
        "moduleCode": "B8",
        "moduleName": {
            "en": "Workforce - General characteristics",
            "de": "Belegschaft - Allgemeine Merkmale"
        },
        "description": {
            "en": "General workforce information including contract types and gender distribution",
            "de": "Allgemeine Informationen zur Belegschaft einschließlich Vertragsarten und Geschlechterverteilung"
        },
        "moduleType": "basic",
        "sheet": "Social Disclosures",
        "disclosures": [
            {
                "disclosureId": "b8-contract-type",
                "disclosureName": {
                    "en": "Type of contract",
                    "de": "Vertragsart"
                },
                "required": True,
                "datapoints": [
                    {
                        "datapointId": "permanentEmployees",
                        "label": {"en": "Number of permanent contract employees", "de": "Anzahl der Mitarbeiter mit unbefristetem Vertrag"},
                        "dataType": "number",
                        "required": True,
                        "excelNamedRange": "NumberOfPermanentContractEmployees"
                    },
                    {
                        "datapointId": "temporaryEmployees",
                        "label": {"en": "Number of temporary contract employees", "de": "Anzahl der Mitarbeiter mit befristetem Vertrag"},
                        "dataType": "number",
                        "required": True,
                        "excelNamedRange": "NumberOfTemporaryContractEmployees"
                    }
                ]
            },
            {
                "disclosureId": "b8-gender",
                "disclosureName": {
                    "en": "Gender distribution",
                    "de": "Geschlechterverteilung"
                },
                "required": True,
                "datapoints": [
                    {
                        "datapointId": "maleEmployees",
                        "label": {"en": "Number of male employees", "de": "Anzahl männlicher Mitarbeiter"},
                        "dataType": "number",
                        "required": True,
                        "excelNamedRange": "NumberOfMaleEmployees"
                    },
                    {
                        "datapointId": "femaleEmployees",
                        "label": {"en": "Number of female employees", "de": "Anzahl weiblicher Mitarbeiter"},
                        "dataType": "number",
                        "required": True,
                        "excelNamedRange": "NumberOfFemaleEmployees"
                    },
                    {
                        "datapointId": "otherGenderEmployees",
                        "label": {"en": "Number of other gender employees", "de": "Anzahl Mitarbeiter anderen Geschlechts"},
                        "dataType": "number",
                        "required": False,
                        "excelNamedRange": "NumberOfOtherGenderEmployees"
                    }
                ]
            },
            {
                "disclosureId": "b8-turnover",
                "disclosureName": {
                    "en": "Turnover rate",
                    "de": "Fluktuationsrate"
                },
                "required": False,
                "datapoints": [
                    {
                        "datapointId": "turnoverRate",
                        "label": {"en": "Employee turnover rate (%)", "de": "Mitarbeiterfluktuation (%)"},
                        "dataType": "number",
                        "required": False,
                        "excelNamedRange": "TurnoverRateForEmployees",
                        "unit": "%"
                    }
                ]
            }
        ]
    }
    
    return module


def generate_basic_modules_mapping():
    """Generate complete mapping for all Basic modules"""
    excel_file = "VSME-Digital-Template-1.1.0.xlsx"
    
    print("=" * 80)
    print("Mapping Basic Modules (B1-B11)")
    print("=" * 80)
    
    wb = openpyxl.load_workbook(excel_file, data_only=True)
    named_ranges = load_named_ranges(wb)
    
    print(f"\nLoaded {len(named_ranges)} named ranges")
    
    # Get worksheets
    ws_general = wb['General Information']
    ws_env = wb['Environmental Disclosures']
    ws_social = wb['Social Disclosures']
    ws_gov = wb['Governance Disclosures']
    
    basic_modules = []
    
    # Map detailed modules
    print("\nMapping modules...")
    print("  B1: Basis for Preparation")
    basic_modules.append(map_module_b1(ws_general, named_ranges))
    
    print("  B3: Energy and GHG Emissions")
    basic_modules.append(map_module_b3(ws_env, named_ranges))
    
    print("  B8: Workforce - General Characteristics")
    basic_modules.append(map_module_b8(ws_social, named_ranges))
    
    # Add placeholder modules for B2, B4-B7, B9-B11 (to be filled in detail)
    placeholder_modules = [
        {
            "moduleId": "module-b2",
            "moduleCode": "B2",
            "moduleName": {
                "en": "Practices, policies and future initiatives",
                "de": "Praktiken, Richtlinien und zukünftige Initiativen"
            },
            "moduleType": "basic",
            "sheet": "General Information",
            "disclosures": []
        },
        {
            "moduleId": "module-b4",
            "moduleCode": "B4",
            "moduleName": {
                "en": "Pollution of air, water and soil",
                "de": "Verschmutzung von Luft, Wasser und Boden"
            },
            "moduleType": "basic",
            "sheet": "Environmental Disclosures",
            "disclosures": []
        },
        {
            "moduleId": "module-b5",
            "moduleCode": "B5",
            "moduleName": {
                "en": "Biodiversity",
                "de": "Biologische Vielfalt"
            },
            "moduleType": "basic",
            "sheet": "Environmental Disclosures",
            "disclosures": []
        },
        {
            "moduleId": "module-b6",
            "moduleCode": "B6",
            "moduleName": {
                "en": "Water",
                "de": "Wasser"
            },
            "moduleType": "basic",
            "sheet": "Environmental Disclosures",
            "disclosures": []
        },
        {
            "moduleId": "module-b7",
            "moduleCode": "B7",
            "moduleName": {
                "en": "Resource use, circular economy and waste management",
                "de": "Ressourcennutzung, Kreislaufwirtschaft und Abfallmanagement"
            },
            "moduleType": "basic",
            "sheet": "Environmental Disclosures",
            "disclosures": []
        },
        {
            "moduleId": "module-b9",
            "moduleCode": "B9",
            "moduleName": {
                "en": "Workforce - Health and safety",
                "de": "Belegschaft - Gesundheit und Sicherheit"
            },
            "moduleType": "basic",
            "sheet": "Social Disclosures",
            "disclosures": []
        },
        {
            "moduleId": "module-b10",
            "moduleCode": "B10",
            "moduleName": {
                "en": "Workforce - Remuneration, collective bargaining and training",
                "de": "Belegschaft - Vergütung, Tarifverhandlungen und Schulung"
            },
            "moduleType": "basic",
            "sheet": "Social Disclosures",
            "disclosures": []
        },
        {
            "moduleId": "module-b11",
            "moduleCode": "B11",
            "moduleName": {
                "en": "Convictions and fines for corruption and bribery",
                "de": "Verurteilungen und Bußgelder wegen Korruption und Bestechung"
            },
            "moduleType": "basic",
            "sheet": "Governance Disclosures",
            "disclosures": []
        }
    ]
    
    basic_modules.extend(placeholder_modules)
    
    # Save mapping
    output = {
        "metadata": {
            "version": "1.0.0",
            "standard": "VSME 1.1.0",
            "generatedDate": "2025-11-16",
            "totalBasicModules": len(basic_modules)
        },
        "basicModules": basic_modules
    }
    
    output_file = 'vsme-basic-modules-mapping.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Basic modules mapping saved to {output_file}")
    
    # Statistics
    total_disclosures = sum(len(m['disclosures']) for m in basic_modules)
    total_datapoints = 0
    for module in basic_modules:
        for disclosure in module['disclosures']:
            total_datapoints += len(disclosure.get('datapoints', []))
    
    print(f"\nStatistics:")
    print(f"  Total modules: {len(basic_modules)}")
    print(f"  Total disclosures: {total_disclosures}")
    print(f"  Total datapoints: {total_datapoints}")
    
    wb.close()


if __name__ == "__main__":
    generate_basic_modules_mapping()

