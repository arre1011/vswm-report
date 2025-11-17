#!/usr/bin/env python3
"""
Map all Comprehensive Modules (C1-C9) with complete datapoint and Named Range mappings
"""
import sys
import json

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


def map_module_c1():
    """Map C1: Strategy and Business Model"""
    return {
        "moduleId": "module-c1",
        "moduleCode": "C1",
        "moduleName": {
            "en": "Strategy: Business Model and Sustainability-Related Initiatives",
            "de": "Strategie: Geschäftsmodell und nachhaltigkeitsbezogene Initiativen"
        },
        "description": {
            "en": "Description of the business model and sustainability-related initiatives",
            "de": "Beschreibung des Geschäftsmodells und nachhaltigkeitsbezogener Initiativen"
        },
        "moduleType": "comprehensive",
        "sheet": "General Information",
        "disclosures": [
            {
                "disclosureId": "c1-business-model",
                "disclosureName": {
                    "en": "Description of key elements of strategy",
                    "de": "Beschreibung der Schlüsselelemente der Strategie"
                },
                "required": True,
                "datapoints": [
                    {
                        "datapointId": "strategyDescription",
                        "label": {
                            "en": "Description of key elements of strategy that relate to or affect sustainability issues",
                            "de": "Beschreibung der Schlüsselelemente der Strategie in Bezug auf Nachhaltigkeitsthemen"
                        },
                        "dataType": "textarea",
                        "required": True,
                        "excelNamedRange": "DescriptionOfKeyElementsOfStrategyThatRelatesToOrAffectsSustainabilityIssues"
                    },
                    {
                        "datapointId": "productsAndServices",
                        "label": {
                            "en": "Description of significant groups of products and/or services offered",
                            "de": "Beschreibung wichtiger Produkt- und/oder Dienstleistungsgruppen"
                        },
                        "dataType": "textarea",
                        "required": True,
                        "excelNamedRange": "DescriptionOfSignificantGroupsOfProductsAndOrServicesOffered"
                    },
                    {
                        "datapointId": "significantMarkets",
                        "label": {
                            "en": "Description of significant markets the undertaking operates in",
                            "de": "Beschreibung wichtiger Märkte, in denen das Unternehmen tätig ist"
                        },
                        "dataType": "textarea",
                        "required": True,
                        "excelNamedRange": "DescriptionOfSignificantMarketsTheUndertakingOperatesIn"
                    },
                    {
                        "datapointId": "businessRelationships",
                        "label": {
                            "en": "Description of main business relationships",
                            "de": "Beschreibung der Hauptgeschäftsbeziehungen"
                        },
                        "dataType": "textarea",
                        "required": True,
                        "excelNamedRange": "DescriptionOfMainBusinessRelationships"
                    }
                ]
            }
        ]
    }


def map_module_c2():
    """Map C2: Detailed Practices and Policies"""
    return {
        "moduleId": "module-c2",
        "moduleCode": "C2",
        "moduleName": {
            "en": "Description of practices, policies and future initiatives",
            "de": "Beschreibung von Praktiken, Richtlinien und zukünftigen Initiativen"
        },
        "description": {
            "en": "Detailed description of practices, policies and future initiatives for transitioning towards a more sustainable economy",
            "de": "Detaillierte Beschreibung von Praktiken, Richtlinien und zukünftigen Initiativen für den Übergang zu einer nachhaltigeren Wirtschaft"
        },
        "moduleType": "comprehensive",
        "sheet": "General Information",
        "disclosures": [
            {
                "disclosureId": "c2-practices-policies",
                "disclosureName": {
                    "en": "Practices, policies and future initiatives",
                    "de": "Praktiken, Richtlinien und zukünftige Initiativen"
                },
                "required": False,
                "datapoints": [
                    {
                        "datapointId": "practicesPoliciesDescription",
                        "label": {
                            "en": "Description of practices, policies and/or future initiatives",
                            "de": "Beschreibung von Praktiken, Richtlinien und/oder zukünftigen Initiativen"
                        },
                        "dataType": "textarea",
                        "required": False,
                        "excelNamedRange": "DescriptionOfPracticesPoliciesAndOrFutureInitiatives"
                    },
                    {
                        "datapointId": "targetDescription",
                        "label": {
                            "en": "Description of a target related to a policy",
                            "de": "Beschreibung eines Ziels in Bezug auf eine Richtlinie"
                        },
                        "dataType": "textarea",
                        "required": False,
                        "excelNamedRange": "DescriptionOfATargetRelatedToAPolicy"
                    }
                ]
            }
        ]
    }


def map_module_c3():
    """Map C3: GHG Reduction Targets and Climate Transition"""
    return {
        "moduleId": "module-c3",
        "moduleCode": "C3",
        "moduleName": {
            "en": "GHG reduction targets and climate transition",
            "de": "THG-Reduktionsziele und Klimatransition"
        },
        "description": {
            "en": "Greenhouse gas reduction targets and transition plan for climate change mitigation",
            "de": "Treibhausgasreduktionsziele und Übergangsplan zur Eindämmung des Klimawandels"
        },
        "moduleType": "comprehensive",
        "sheet": "Environmental Disclosures",
        "disclosures": [
            {
                "disclosureId": "c3-ghg-targets",
                "disclosureName": {
                    "en": "GHG reduction targets",
                    "de": "THG-Reduktionsziele"
                },
                "required": False,
                "datapoints": [
                    {
                        "datapointId": "ghgTargetBaselineYear",
                        "label": {
                            "en": "Baseline year for GHG reduction target",
                            "de": "Basisjahr für THG-Reduktionsziel"
                        },
                        "dataType": "number",
                        "required": False,
                        "excelNamedRange": "BaselineYearMember"
                    },
                    {
                        "datapointId": "ghgTargetYear",
                        "label": {
                            "en": "Target year for GHG reduction",
                            "de": "Zieljahr für THG-Reduktion"
                        },
                        "dataType": "number",
                        "required": False,
                        "excelNamedRange": "TargetYearMember"
                    },
                    {
                        "datapointId": "ghgReductionPercentage",
                        "label": {
                            "en": "GHG reduction percentage target",
                            "de": "THG-Reduktionsziel in Prozent"
                        },
                        "dataType": "number",
                        "required": False,
                        "unit": "%"
                    }
                ]
            },
            {
                "disclosureId": "c3-transition-plan",
                "disclosureName": {
                    "en": "Transition plan for climate change mitigation",
                    "de": "Übergangsplan zur Eindämmung des Klimawandels"
                },
                "required": False,
                "datapoints": [
                    {
                        "datapointId": "transitionPlanDescription",
                        "label": {
                            "en": "Description of transition plan for climate change mitigation",
                            "de": "Beschreibung des Übergangsplans zur Eindämmung des Klimawandels"
                        },
                        "dataType": "textarea",
                        "required": False,
                        "excelNamedRange": "DescriptionOfATransitionPlanForClimateChangeMitigationIncludingAnExplanationOfHowItIsContributingToReduceGhgEmissions"
                    },
                    {
                        "datapointId": "adoptionDateTransitionPlan",
                        "label": {
                            "en": "Date of adoption of transition plan (if not yet adopted)",
                            "de": "Datum der Verabschiedung des Übergangsplans (falls noch nicht verabschiedet)"
                        },
                        "dataType": "date",
                        "required": False,
                        "excelNamedRange": "DateOfAdoptionOfTransitionPlanForUndertakingNotHavingAdoptedTransitionPlanYet"
                    }
                ]
            },
            {
                "disclosureId": "c3-main-actions",
                "disclosureName": {
                    "en": "Main actions to achieve targets",
                    "de": "Hauptmaßnahmen zur Zielerreichung"
                },
                "required": False,
                "datapoints": [
                    {
                        "datapointId": "mainActionsList",
                        "label": {
                            "en": "List of main actions to achieve GHG reduction targets",
                            "de": "Liste der Hauptmaßnahmen zur Erreichung der THG-Reduktionsziele"
                        },
                        "dataType": "table",
                        "required": False,
                        "minRows": 0,
                        "maxRows": 10,
                        "columns": [
                            {
                                "datapointId": "actionDescription",
                                "label": {
                                    "en": "Description of action",
                                    "de": "Beschreibung der Maßnahme"
                                },
                                "dataType": "textarea"
                            },
                            {
                                "datapointId": "expectedImpact",
                                "label": {
                                    "en": "Expected GHG reduction impact (tCO2e)",
                                    "de": "Erwartete THG-Reduktionswirkung (tCO2e)"
                                },
                                "dataType": "number",
                                "unit": "tCO2e"
                            }
                        ]
                    }
                ]
            }
        ]
    }


def map_module_c4():
    """Map C4: Climate Risks"""
    return {
        "moduleId": "module-c4",
        "moduleCode": "C4",
        "moduleName": {
            "en": "Climate risks",
            "de": "Klimarisiken"
        },
        "description": {
            "en": "Description of climate-related risks and their potential impacts",
            "de": "Beschreibung klimabezogener Risiken und ihrer potenziellen Auswirkungen"
        },
        "moduleType": "comprehensive",
        "sheet": "Environmental Disclosures",
        "disclosures": [
            {
                "disclosureId": "c4-climate-risks",
                "disclosureName": {
                    "en": "Climate-related hazards and transition events",
                    "de": "Klimabezogene Gefahren und Übergangsereignisse"
                },
                "required": False,
                "datapoints": [
                    {
                        "datapointId": "climateHazardsDescription",
                        "label": {
                            "en": "Description of climate-related hazards and climate-related transition events",
                            "de": "Beschreibung klimabezogener Gefahren und klimabezogener Übergangsereignisse"
                        },
                        "dataType": "textarea",
                        "required": False,
                        "excelNamedRange": "DescriptionOfClimateRelatedHazardsAndClimateRelatedTransitionEvents"
                    }
                ]
            }
        ]
    }


def map_module_c5():
    """Map C5: Additional Workforce Characteristics"""
    return {
        "moduleId": "module-c5",
        "moduleCode": "C5",
        "moduleName": {
            "en": "Additional (general) workforce characteristics",
            "de": "Zusätzliche (allgemeine) Merkmale der Belegschaft"
        },
        "description": {
            "en": "Additional detailed workforce information beyond basic module requirements",
            "de": "Zusätzliche detaillierte Informationen zur Belegschaft über die Basismodulanforderungen hinaus"
        },
        "moduleType": "comprehensive",
        "sheet": "Social Disclosures",
        "disclosures": []
    }


def map_module_c6():
    """Map C6: Human Rights Policies"""
    return {
        "moduleId": "module-c6",
        "moduleCode": "C6",
        "moduleName": {
            "en": "Additional own workforce information - Human rights policies and processes",
            "de": "Zusätzliche Informationen zur eigenen Belegschaft - Menschenrechtsrichtlinien und -prozesse"
        },
        "description": {
            "en": "Human rights policies and processes related to own workforce",
            "de": "Menschenrechtsrichtlinien und -prozesse in Bezug auf die eigene Belegschaft"
        },
        "moduleType": "comprehensive",
        "sheet": "Social Disclosures",
        "disclosures": [
            {
                "disclosureId": "c6-human-rights",
                "disclosureName": {
                    "en": "Human rights policies and processes",
                    "de": "Menschenrechtsrichtlinien und -prozesse"
                },
                "required": True,
                "datapoints": [
                    {
                        "datapointId": "humanRightsPoliciesDescription",
                        "label": {
                            "en": "Description of human rights policies and processes",
                            "de": "Beschreibung der Menschenrechtsrichtlinien und -prozesse"
                        },
                        "dataType": "textarea",
                        "required": True
                    }
                ]
            }
        ]
    }


def map_module_c7():
    """Map C7: Human Rights Incidents"""
    return {
        "moduleId": "module-c7",
        "moduleCode": "C7",
        "moduleName": {
            "en": "Severe negative human rights incidents",
            "de": "Schwerwiegende negative Menschenrechtsvorfälle"
        },
        "description": {
            "en": "Reporting of severe negative human rights incidents and actions taken",
            "de": "Berichterstattung über schwerwiegende negative Menschenrechtsvorfälle und ergriffene Maßnahmen"
        },
        "moduleType": "comprehensive",
        "sheet": "Social Disclosures",
        "disclosures": [
            {
                "disclosureId": "c7-incidents",
                "disclosureName": {
                    "en": "Human rights incidents and actions taken",
                    "de": "Menschenrechtsvorfälle und ergriffene Maßnahmen"
                },
                "required": True,
                "datapoints": [
                    {
                        "datapointId": "numberOfIncidents",
                        "label": {
                            "en": "Number of severe negative human rights incidents",
                            "de": "Anzahl schwerwiegender negativer Menschenrechtsvorfälle"
                        },
                        "dataType": "number",
                        "required": True
                    },
                    {
                        "datapointId": "actionsDescription",
                        "label": {
                            "en": "Description of actions taken to address the confirmed incidents",
                            "de": "Beschreibung der Maßnahmen zur Bewältigung der bestätigten Vorfälle"
                        },
                        "dataType": "textarea",
                        "required": True,
                        "excelNamedRange": "DescriptionOfActionsTakeToAddressTheConfirmedIncidents"
                    }
                ]
            }
        ]
    }


def map_module_c8():
    """Map C8: Revenue Disclosures"""
    return {
        "moduleId": "module-c8",
        "moduleCode": "C8",
        "moduleName": {
            "en": "Revenues from certain activities and exclusion from EU reference benchmarks",
            "de": "Einnahmen aus bestimmten Aktivitäten und Ausschluss von EU-Referenzbenchmarks"
        },
        "description": {
            "en": "Disclosure of revenues from controversial activities and EU benchmark exclusions",
            "de": "Offenlegung von Einnahmen aus kontroversen Aktivitäten und EU-Benchmark-Ausschlüssen"
        },
        "moduleType": "comprehensive",
        "sheet": "Governance Disclosures",
        "disclosures": [
            {
                "disclosureId": "c8-revenues",
                "disclosureName": {
                    "en": "Revenues from certain activities",
                    "de": "Einnahmen aus bestimmten Aktivitäten"
                },
                "required": False,
                "datapoints": [
                    {
                        "datapointId": "fossilFuelRevenue",
                        "label": {
                            "en": "Revenue from fossil fuel activities",
                            "de": "Einnahmen aus fossilen Brennstoffaktivitäten"
                        },
                        "dataType": "number",
                        "required": False,
                        "unit": "currency"
                    },
                    {
                        "datapointId": "controversialWeaponsRevenue",
                        "label": {
                            "en": "Revenue from controversial weapons",
                            "de": "Einnahmen aus umstrittenen Waffen"
                        },
                        "dataType": "number",
                        "required": False,
                        "unit": "currency"
                    }
                ]
            },
            {
                "disclosureId": "c8-eu-benchmarks",
                "disclosureName": {
                    "en": "Exclusion from EU reference benchmarks",
                    "de": "Ausschluss von EU-Referenzbenchmarks"
                },
                "required": True,
                "datapoints": [
                    {
                        "datapointId": "excludedFromEUBenchmarks",
                        "label": {
                            "en": "Undertaking excluded from EU reference benchmarks",
                            "de": "Unternehmen von EU-Referenzbenchmarks ausgeschlossen"
                        },
                        "dataType": "boolean",
                        "required": True
                    }
                ]
            }
        ]
    }


def map_module_c9():
    """Map C9: Gender Diversity in Governance"""
    return {
        "moduleId": "module-c9",
        "moduleCode": "C9",
        "moduleName": {
            "en": "Gender diversity ratio in the governance body",
            "de": "Geschlechterverhältnis im Leitungsorgan"
        },
        "description": {
            "en": "Gender diversity information for the undertaking's governance body",
            "de": "Informationen zur Geschlechtervielfalt im Leitungsorgan des Unternehmens"
        },
        "moduleType": "comprehensive",
        "sheet": "Governance Disclosures",
        "disclosures": [
            {
                "disclosureId": "c9-gender-diversity",
                "disclosureName": {
                    "en": "Gender diversity in governance body",
                    "de": "Geschlechtervielfalt im Leitungsorgan"
                },
                "required": False,
                "datapoints": [
                    {
                        "datapointId": "maleGovernanceMembers",
                        "label": {
                            "en": "Number of male members in governance body",
                            "de": "Anzahl männlicher Mitglieder im Leitungsorgan"
                        },
                        "dataType": "number",
                        "required": False
                    },
                    {
                        "datapointId": "femaleGovernanceMembers",
                        "label": {
                            "en": "Number of female members in governance body",
                            "de": "Anzahl weiblicher Mitglieder im Leitungsorgan"
                        },
                        "dataType": "number",
                        "required": False
                    },
                    {
                        "datapointId": "genderDiversityRatio",
                        "label": {
                            "en": "Gender diversity ratio (%)",
                            "de": "Geschlechterverhältnis (%)"
                        },
                        "dataType": "number",
                        "required": False,
                        "unit": "%"
                    }
                ]
            }
        ]
    }


def generate_comprehensive_modules_mapping():
    """Generate complete mapping for all Comprehensive modules"""
    print("=" * 80)
    print("Mapping Comprehensive Modules (C1-C9)")
    print("=" * 80)
    
    comprehensive_modules = []
    
    # Map all comprehensive modules
    print("\nMapping modules...")
    print("  C1: Strategy and Business Model")
    comprehensive_modules.append(map_module_c1())
    
    print("  C2: Detailed Practices and Policies")
    comprehensive_modules.append(map_module_c2())
    
    print("  C3: GHG Reduction Targets")
    comprehensive_modules.append(map_module_c3())
    
    print("  C4: Climate Risks")
    comprehensive_modules.append(map_module_c4())
    
    print("  C5: Additional Workforce Characteristics")
    comprehensive_modules.append(map_module_c5())
    
    print("  C6: Human Rights Policies")
    comprehensive_modules.append(map_module_c6())
    
    print("  C7: Human Rights Incidents")
    comprehensive_modules.append(map_module_c7())
    
    print("  C8: Revenue Disclosures")
    comprehensive_modules.append(map_module_c8())
    
    print("  C9: Gender Diversity in Governance")
    comprehensive_modules.append(map_module_c9())
    
    # Save mapping
    output = {
        "metadata": {
            "version": "1.0.0",
            "standard": "VSME 1.1.0",
            "generatedDate": "2025-11-16",
            "totalComprehensiveModules": len(comprehensive_modules)
        },
        "comprehensiveModules": comprehensive_modules
    }
    
    output_file = 'vsme-comprehensive-modules-mapping.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Comprehensive modules mapping saved to {output_file}")
    
    # Statistics
    total_disclosures = sum(len(m['disclosures']) for m in comprehensive_modules)
    total_datapoints = 0
    for module in comprehensive_modules:
        for disclosure in module['disclosures']:
            total_datapoints += len(disclosure.get('datapoints', []))
    
    print(f"\nStatistics:")
    print(f"  Total modules: {len(comprehensive_modules)}")
    print(f"  Total disclosures: {total_disclosures}")
    print(f"  Total datapoints: {total_datapoints}")


if __name__ == "__main__":
    generate_comprehensive_modules_mapping()

