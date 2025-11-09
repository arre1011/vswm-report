# Prompt für Cursor AI

> **Ziel:** Erzeuge auf Basis dieses Prompts eine lauffähige Infrastruktur (Terraform) und CI/CD-Pipelines (GitHub Actions) für **Azure Static Web Apps (React-Frontend)** und **Azure App Service (Java-Backend, Always On)** – inklusive Monitoring mit **Application Insights**. Verwende die vorgegebene Ordnerstruktur und liefere produktionsnahe Defaults, die ich später verfeinern kann.

---

## Anforderungen & Architektur

* **Frontend:** React-App als **Azure Static Web App (SWA)**, Build aus `/frontend`.
* **Backend:** Java (Spring Boot, JAR) auf **Azure App Service (Linux)**, **Always On = true**.
* **Monitoring:** **Application Insights** für Backend (Java Agent/Auto-Instrumentation) + optional JS SDK für Frontend.
* **IaC:** **Terraform** im Ordner `/infra`.
* **CI/CD:** **GitHub Actions** Workflows unter `/.github/workflows`.
* **Auth zu Azure in CI:** via **OIDC (azure/login)**, keine Langzeit-Secrets.
* **Environments:** `dev` (Standard) mit leichter Erweiterbarkeit auf `prod`.
* **Region:** `westeurope` (anpassbar via Terraform-Variablen).

---

## Ziel-Ordnerstruktur (zu erzeugen)

```
/infra
  providers.tf
  main.tf
  variables.tf
  outputs.tf
  backend.tf            # Terraform Remote State (Azure Storage)
/frontend               # React-App (bereits vorhanden)
/backend                # Java-App (Maven/Gradle, bereits vorhanden)
/.github/workflows
  infra.yml
  frontend-swa.yml
  backend-appservice.yml
README.md
```


## Akzeptanzkriterien

* `terraform apply` (via CI) erzeugt RG, SWA, App Service Plan, Web App, Application Insights.
* Frontend-Workflow deployt React-Build nach SWA; URL im Job-Log sichtbar.
* Backend-Workflow deployt JAR nach App Service; Healthcheck über Default-Hostname erreichbar.
* Application Insights empfängt Request/Dependency-Telemetrie.

---

## Hinweise für Cursor

* Erzeuge **vollständige** Terraform-Dateien und **funktionierende** YAML-Workflows wie oben beschrieben.
* Nutze sinnvolle Defaults und kommentiere Stellen, die ich anpassen muss (Namen, Pfade, Java-Version, Vite/CRA-Ausgabepfad).
* Achte auf **Idempotenz** (Terraform) und **Monorepo-Trigger** (`paths`).
* Liefere zusätzlich eine kurze **README.md** mit Setup-Schritten (OIDC in Azure, Secrets setzen, erster Deploy).
* Erzeuge auch bitte eine Arc42 doku in der du auch alles wichtige festhälst aus der anwddung nutze auch gerne marmaid diagramme 
