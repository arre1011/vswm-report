# VSME Report Implementation Plan

## Excel Structure Analysis

### Basic Report Sheets:

1. **General Information** (B1)
   - Reporting entity information
   - Reporting period
   - Basis for preparation
   - NACE codes
   - Number of employees
   - Turnover
   - List of subsidiaries (optional)
   - List of sites (required)

2. **Environmental Disclosures** (B3, B4, B5, B6)
   - B3: Total Energy Consumption
   - B3: GHG Emissions
   - B3: GHG Emission intensity
   - B4: Pollution (optional)
   - B5: Biodiversity sensitive areas (optional)
   - B6: Water Withdrawal (required)

3. **Social Disclosures** (B8, B9, B10)
   - B8: Workforce - General characteristics
     - Type of contract
     - Gender
     - Country of employment (optional)
     - Turnover rate (optional)
   - B9: Workforce - Health and safety
   - B10: Workforce - Remuneration and training

4. **Governance Disclosures** (B11)
   - B11: Convictions and fines (optional)
   - C8: Revenues from certain activities (optional)
   - C8: Exclusion from EU benchmarks (required)
   - C9: Gender diversity (optional)

## Implementation Steps

### Frontend:
1. Create Wizard Steps based on sheets
2. Create form components for each disclosure
3. Map form data to Excel structure

### Backend:
1. Add Apache POI for Excel generation
2. Create Excel service to read template
3. Map frontend data to Excel cells
4. Generate and return Excel file

## Field Mapping

### General Information Fields:
- Name of reporting entity (Row 3, Col D)
- Entity identifier (Row 4, Col D)
- Currency (Row 5, Col D)
- Reporting period dates (Rows 6-13)
- Basis for preparation (Row 32, Col D)
- NACE codes (Row 45, Col D)
- Number of employees (Row 62, Col D)
- Turnover (Row 61, Col D)
- Sites list (Row 102+)

### Environmental Disclosures Fields:
- Total Energy Consumption (Row 2, Col D)
- Energy breakdown (Row 7+)
- GHG Emissions (Row 16+)
- GHG Intensity (Row 64+)
- Water Withdrawal (Row 166+)

### Social Disclosures Fields:
- Employee counting methodology (Row 2-3)
- Type of contract (Row 6+)
- Gender distribution (Row 14+)
- Country of employment (Row 24+)
- Turnover rate (Row 41+)
- Health and safety (Row 49+)
- Training hours (Row 64+)

### Governance Disclosures Fields:
- Convictions and fines (Row 2+)
- Revenues from activities (Row 9+)
- EU benchmark exclusion (Row 20+)
- Gender diversity (Row 29+)

