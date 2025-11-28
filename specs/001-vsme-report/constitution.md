# VSME Easy Report Constitution

## Vision & Mission

### Vision Statement
**Making sustainability reporting accessible, understandable, and affordable for SMEs.**

Climate change is one of the greatest global challenges of our time. Companies of all sizes play an important role in limiting human-induced climate change. Small and medium-sized enterprises (SMEs) are increasingly required to disclose sustainability data - whether to be selected as suppliers for larger corporations or to obtain financing benefits from banks.

The **VSME standard** (Voluntary Sustainability Reporting Standard for SME) was created by EFRAG to provide a modular, simplified framework for CSRD-compliant sustainability reporting tailored to SME needs.

**Our vision:** With modern technology, we empower SMEs to create their VSME sustainability report **quickly, comprehensively, and cost-effectively** - thereby contributing to the fight against climate change through broader sustainability reporting.

> *"SMEs should be able to complete their VSME report within a few hours - without Excel skills, without translation problems, without consultants."*

👉 **Full Vision Document**: [`docs/vision.md`](../../docs/vision.md)

---

### Mission
Enable SMEs to create professional, compliant VSME sustainability reports through:

1. **🦯 Guided Wizard**: Step-by-step assistant with explanations, examples, and selection aids
2. **🗂️ Smart Forms**: Intuitive input masks that automatically show only relevant fields (Basic or Comprehensive)
3. **🇩🇪 Multilingual Support**: English primary, German secondary - removing language barriers
4. **✅ Real-time Validation**: Traffic light logic and hints for missing or contradictory information
5. **📦 Automated Excel Generation**: Correctly filled VSME Excel file (official format) ready for submission
6. **💾 Auto-Save**: Local storage with optional cloud backup, data reusable for following years
7. **📚 Integrated Help**: Short descriptions for every field, links to VSME standard

**Result**: SMEs complete their sustainability report in hours instead of weeks, at a fraction of the cost of traditional consulting.

👉 **Product Idea Document**: [`docs/Idea.md`](../../docs/Idea.md)

---

### Problem Statement

**Current Situation:**
The official VSME Excel template from EFRAG is comprehensive, technical, and predominantly in English - a significant barrier for many SMEs. Many input fields are unclear or irrelevant for the Basic Report. Often, expensive external consultants must be hired, or extensive internal expertise must be built up.

**Problems We Solve:**

| Problem | Our Solution |
|---------|-------------|
| ❌ **Complexity** | Simplified wizard, only relevant fields shown |
| ❌ **Language Barrier** | German translations, tooltips, plain language explanations |
| ❌ **Relevance** | Filter Basic vs. Comprehensive, hide unnecessary modules |
| ❌ **Cost** | Affordable SaaS (freemium model), no expensive all-in-one ESG tools |
| ❌ **Excel Skills Required** | No Excel knowledge needed, intuitive web forms |
| ❌ **Time-Consuming** | Hours instead of weeks, guided process |


---

## Core Principles

### I. Domain-Driven Design (DDD)
The application follows Domain-Driven Design principles at the moment there is only one Domain this is report.


### III. Save Early, Save Quietly (NON-NEGOTIABLE)
User data must be persisted immediately to prevent data loss:
- **onBlur**: Trigger validation + save for every field
- **onChange**: Debounced save (900ms delay) for text inputs
- **LocalStorage**: All data persisted via Zustand Persist Middleware
- **Auto-hydration**: State automatically restored on page reload


**Reusable Form Components:**
- `input-with-info.tsx` - Text input with tooltip
- `select-with-info.tsx` - Dropdown with tooltip
- `date-picker-with-info.tsx` - Date picker with tooltip

### Backend
- **Framework**: Spring Boot 3.x with Java
- **Architecture**: 3 Layer Architecture. PresentationLayer -> Business logic -> Thired party exec layer other services or DB 
- **Excel Library**: Apache POI
- **Build Tool**: Gradle with Kotlin DSL
- **JDK**: 21 or higher


**Named Range Mapping:** 
All 797 Named Ranges from the Excel template are mapped to datapoints in `docs/data-model/vsme-data-model-spec.json`. Backend writes values using Named Range resolution.

## Data Model

### Single Source of Truth
`docs/data-model/vsme-data-model-spec.json` contains:
- All 11 Basic Modules (B1-B11)
- All 9 Comprehensive Modules (C1-C9)
- All 797 Excel Named Ranges
- 10 Repeating Data Patterns
- Stepper configuration (6 steps)
- Complete type definitions

### Hierarchical Structure
The VSME data model follows a 4-level hierarchy that maps directly to both the **Excel template** and the **UI components**:

```
Sheet → Module → Disclosure → Datapoint
  ↓        ↓         ↓           ↓
Stepper → Area → Card → Input Field
```

**Detailed Mapping**:

| Data Model Level | Excel Structure | UI Component | Example |
|------------------|----------------|--------------|---------|
| **Sheet** | Excel Tab | **Stepper** (Wizard Step) | "General Information" sheet → Stepper #2 |
| **Module** | Module Section | **Area/Section** in Stepper | B1, B3 modules → Grouped in same stepper |
| **Disclosure** | Disclosure Block | **Card** Component | "Entity Details" → Card with fields |
| **Datapoint** | Named Range Cell | **Input Field** | `entityName` → Text input |

**Configuration**: `docs/data-model/vsme-stepper-config.json` defines the 6 wizard steppers and their module mappings.

#### Stepper Structure

The wizard consists of 6 steppers as defined in `vsme-stepper-config.json`:

1. **Introduction** (Informational)
   - Welcome, VSME explanation, what user needs

2. **General Information** (Core Report)
   - Modules: B1, B2 (Basic)
   - Modules: C1, C2 (Comprehensive, conditional)

3. **Environmental Disclosures** (Core Report)
   - Modules: B3, B4, B5, B6, B7 (Basic)
   - Modules: C3, C4 (Comprehensive, conditional)

4. **Social Disclosures** (Core Report)
   - Modules: B8, B9, B10 (Basic)
   - Modules: C5, C6, C7 (Comprehensive, conditional)

5. **Governance Disclosures** (Core Report)
   - Modules: B11 (Basic)
   - Modules: C8, C9 (Comprehensive, conditional)

6. **Review & Export** (Validation)
   - Summary, validation results, export button

**Conditional Display**: Comprehensive modules (C1-C9) only shown if user selects "Basic & Comprehensive" mode.


## Development Workflow

### Spec-Driven Development (SDD)
1. **Write Spec**: Define feature in `.specify/specs/`
2. **Generate Code**: Use scripts or AI to generate boilerplate
3. **Implement**: Fill in business logic
4. **Test**: Validate against spec
5. **Commit**: One feature per commit

### Commit Strategy
- One task = one commit
- Conventional Commits format: `feat:`, `fix:`, `docs:`, `refactor:`
- Reference task ID in commit message
- Each commit must pass linting and type checking

### Testing Strategy
- **Frontend**: Vitest for unit tests, Playwright for E2E
- **Backend**: JUnit 5 with Kotlin
- **Storybook**: For component documentation and testing
- Generated Excel files validated against VSME standard



## References & Key Documents

### Vision & Product Documents
- 📄 **[`docs/vision.md`](../../docs/vision.md)**: Full vision statement, problem analysis, and strategic positioning
- 💡 **[`docs/Idea.md`](../../docs/Idea.md)**: Product idea, features, target audience, and business model
- 📊 **[`docs/data-model/`](../../docs/data-model/)**: Complete VSME data model and analysis

### Specifications
All feature specifications follow requirements-based format (WHAT & WHY, not HOW):

### Excel Template
- 📊 **[`VSME-Digital-Template-1.1.0.xlsx`](../../VSME-Digital-Template-1.1.0.xlsx)**: Official EFRAG template
  - 13 sheets
  - 797 Named Ranges
  - Used as template for report generation

---

## Governance

### Constitution Authority
This constitution supersedes all other development practices and guidelines. All code must comply with these principles. Violations require documented justification and approval.

### Spec-First Development
All new features must follow this workflow:
1. **Spec First**: Write requirements specification in `.specify/specs/`
2. **Review**: Team reviews and approves spec
3. **Implement**: Develop according to spec (with implementation freedom)
4. **Verify**: Validate against acceptance criteria
5. **Document**: Update references if needed

### Spec Updates
When requirements change:
1. Update specs first (`.specify/specs/`)
2. Update data model if needed (`docs/data-model/`)
3. Regenerate code (schemas, types, i18n)
4. Implement changes
5. Update documentation

---

**Version**: 1.1.0 | **Ratified**: 2025-11-17 | **Last Amended**: 2025-11-17
