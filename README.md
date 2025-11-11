## Infrastructure & CI/CD Overview

Dieses Repository stellt eine vollständige Infrastruktur- und Deployment-Pipeline für das VSME-Projekt bereit:

- **Frontend**: React-Anwendung als Azure Static Web App  
- **Backend**: Java (Spring Boot) auf Azure App Service (Linux, Always On)  
- **Monitoring**: Application Insights mit Java Auto-Instrumentation  
- **IaC**: Terraform unter `infra/`  
- **CI/CD**: GitHub Actions Workflows unter `.github/workflows/`  
- **Architektur**: Siehe `docs/arc42.md` (Arc42 Template inkl. Diagrammen)

---

## Quickstart

1. **Azure Ressourcen für Terraform-State anlegen**  
   - Resource Group, Storage Account (Standard LRS) und Container für Terraform-States erstellen  
   - Optional: `infra/backend.hcl` mit Backend-Konfiguration anlegen

2. **GitHub Repository/Environment Variablen & Secrets setzen**

   | Typ        | Name                          | Beschreibung |
   |------------|------------------------------|--------------|
   | Secret     | `AZURE_CLIENT_ID`            | Client-ID der Azure AD App Registration (Federated Credential für GitHub OIDC) |
   | Secret     | `AZURE_TENANT_ID`            | Azure AD Tenant ID |
   | Secret     | `AZURE_SUBSCRIPTION_ID`      | Azure Subscription ID |
   | Variable   | `TFSTATE_RESOURCE_GROUP`     | RG des Terraform-State Storage |
   | Variable   | `TFSTATE_STORAGE_ACCOUNT`    | Storage Account Name |
   | Variable   | `TFSTATE_CONTAINER`          | Container Name (z. B. `tfstate`) |
   | Variable   | `TFSTATE_KEY`                | (Optional) Dateiname für State, z. B. `vsme-report-dev.tfstate` |
   | Variable   | `AZURE_RESOURCE_GROUP`       | RG der durch Terraform erzeugten Ressourcen |
   | Variable   | `AZURE_STATIC_WEB_APPS_NAME` | Name der Static Web App (Terraform Output) |
   | Variable   | `AZURE_WEBAPP_NAME`          | Name des App Service (Terraform Output) |
   | Variable   | `FRONTEND_OUTPUT_LOCATION`   | Build-Ordner, Standard `frontend/dist` (bei CRA auf `frontend/build` ändern) |
   | Variable   | `BACKEND_ARTIFACT_PATH`      | JAR-Pfad nach Build, Standard `backend/target/*.jar` |
   | Optional   | `FRONTEND_BUILD_COMMAND`, `FRONTEND_INSTALL_COMMAND`, `BACKEND_BUILD_COMMAND`, etc. | Zur Anpassung der Workflows |

3. **Azure AD App Registration für OIDC einrichten**
   - Neue App Registration (Single Tenant)  
   - Federated Credential für GitHub Actions: Repository, Branch (= `refs/heads/main`), Subject `repo:{owner}/{repo}:ref:refs/heads/main`  
   - Rolle `Contributor` (oder granularer) auf Subscription/Resource Group zuweisen

4. **Terraform ausführen**
   ```bash
   cd infra
   terraform init \
     -backend-config="resource_group_name=<tfstate-rg>" \
     -backend-config="storage_account_name=<tfstate-storage>" \
     -backend-config="container_name=tfstate" \
     -backend-config="key=vsme-report-dev.tfstate"
   terraform plan
   terraform apply
   ```

5. **CI/CD Workflows**
   - `infra.yml`: Terraform Plan/Apply bei Änderungen unter `infra/**`
   - `frontend-swa.yml`: Build & Deploy der React-App nach SWA  
   - `backend-appservice.yml`: Build & Deploy des Spring Boot JAR nach App Service  
   - Manuelle Ausführung über `workflow_dispatch` möglich

6. **Monitoring**
   - Application Insights Connection String wird in App Service App Settings geschrieben  
   - Auto-Instrumentation via `APPLICATIONINSIGHTS_AGENT_VERSION = latest`  
   - In Application Insights können Request-/Dependency-Telemetrie, Logs und Metrics analysiert werden

---

## Lokale Entwicklung

- **Frontend**  
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

- **Backend**  
  ```bash
  cd backend
  ./mvnw spring-boot:run
  ```

---

## Erweiterungen / TODO

- Weitere Environments (z. B. `prod`) über Terraform-Variablen und GitHub Environments  
- DNS, benutzerdefinierte Domains und TLS-Zertifikate für SWA & App Service  
- Azure Key Vault Integration für Secrets  
- Skalierungsregeln / Autoscaling für App Service Plan  
- Dashboard-Erstellung in Application Insights / Azure Monitor

---

Weitere Architekturdetails siehe [`docs/arc42.md`](docs/arc42-Azure-Infrastruktur-setup.md).
# VSME Report

Ein Projekt mit Backend und Frontend.

## Projektstruktur

```
vsme-report/
├── backend/          # Backend-Code
├── frontend/         # Frontend-Code
├── .gitignore        # Git Ignore Datei
└── README.md         # Diese Datei
```

## Setup

### Backend

Weitere Informationen finden Sie im `backend/README.md`.

### Frontend

Weitere Informationen finden Sie im `frontend/README.md`.

## Installation

1. Repository klonen
2. Backend-Dependencies installieren
3. Frontend-Dependencies installieren
4. Projekt starten

## Entwicklung

- Backend: Siehe `backend/README.md`
- Frontend: Siehe `frontend/README.md`

## Lizenz

[Ihre Lizenz hier]
