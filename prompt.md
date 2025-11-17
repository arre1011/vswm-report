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



---

# weiterer prompt


Ich möchte eine anwendung mit Spec driven development und KI entwicklen. Was für eine Anwendung ich enticklen möchte beschreibt die angehengte Datei vision.md und idea.md

Der follow der anwendung wird sein, dass der User die felder eingibt im React ts (shadcn, tailwind, Zod, i18a,zustand)frontend. Die Daten werden dann an von dem frontend an das backend gesendet wenn der user den Button Excel export triggerd. Die Inputdaten werden dann im Backend in das entsprechende feld in der Excel geschrieben. Dies findet über die Name Range statt. die befüllte Excel wir dann wieder an den User zurück gegeben in das Frontend.

Ich erzähle das dir alles, dass du ein besseres verständnis für die Anwendung entwicklst damit wir die folgende Aufgabe best möglcih lösen können. Es geht darum eine Datenmodell für die Anwendung aufzustellen. hierbei würde ich an der struktur des Efrag VSME Template orientieren, wlelches ich auc angehangte habe. Ich hbae mir auch schon gedanken geamcht, wie das Datenmodel aufgabaut sien soll. dies habe ich in dem folgenden Markdown abschintt beschrieben

---

### Report Struktur
Reporten von wichtigen daten strukturen, hier könnte ich alle wichtigen Daten aus dem Efrag VSME template. Ich möchte die Daten sehr gut aufbereiten. hierfür muss ermittlet werden welche struktur die KI gut lesen kann. Die Daten sollen in einer Baumstruktur sein. Stepper -> module -> card -> inputs die genaue struktur der baum elmente wir im folgenden beschrieben
#### Stepper
Der Stepper soll die einzelnen Reiter der Excel wieder spiegeln, hier soll aber zwischen den Core Steper, was den eigenlichen Repoer wiederspiegelt mit zusatzlichen inforamtionen um den Repoet unterschieden werden
##### Core Report
Der Core Report ist der Bereich in den der User den Input eingibt aus diesem Input wird dann am ende der VSME Report erzeugt. Dies geschieht, in dem die inputdaten des User aus dem frontend an das backend gesendet werden. im Backend werdn die Daten dann in die Excel übertragen. Die befühlte excel wird dann wieder an das frontend gesendet und der kunde kann diese herunterladen
Der Core Report beinhaltet die Module
##### Additional Report Information
Report zusatz information. Dies sind alle Reiter auserhalb des Report Cores, also informationen die nicht für die erstellug des rposrts notwendig sind. Dies sind informationen, Wie beispielsweise Reiter 1 "Introduction" in der VSME Excel Template. Hier werden dem User wichtige Informationen zu dem Report gegeben. Ein weitere wichtiger stepper wird der letzte stepper sein, welches der eine art valudation und Confirmation stepper sien soll. Hier sollen noch einmal alle felder kompakt aufgelistet werden, damit der User siene eingaben noch einemal prüfen kann und dann mit einem button bestätigen kann und beim clicken die befüllte excel downloaded

#### Modul
Die Module sind die VSME Module, also beispielsweise die Basic Module von B1 bis B11 und Comprensive Module von C1 bis C9. In dem VSME Excel Template sind dies sehr gut in dem Zweiten Reiter aufgelistet "Tabel of Content and Valudaion"
Module beinhalten wiederum kategorien/ cards , welche in cards abgebildet werden
#### Cards
Cards kann sind cluster von tatsächlichen User input values. In dem VSME Excel Template sind dies auch sehr gut in dem Zweiten Reiter aufgelistet "Tabel of Content and Valudaion" hier sind dies unterpunkte der Module.
Cards beinhalten Values

#### User Inputs/ Report Values
Dies sind nun die tatsächlichen Wert, welche von dem KMU kommen und ende des Prozesses in der VSME Report stehen, also in der VSME Excel. Der User gibt diese Werte über ein Input formular ein, dies können Inputforms, Inputslects, oder checkboxen sein. hier kommt es darauf an wie es in dem VSME Excel Template dargestellt wurde und so soll es wieder dargestellt werden in der Anwendung, also wenn es in der excel ein normales inputfeld war soll es in der anwendung ein normales inputform sein. Wenn es in der Excel ein dropdownmenu war dann soll es in der Anwendung ein Selct input sein.


---

Ergänze oder korrigrire die idee des Daten models gerne. Wie du vermutlich auch feststellen Kontest, war es auch schwierig eine Saubere Naming struktur zu definieren. Mach dir hier auch über eine Sinnvolle struktur gedanken. Gehe hier auch gerne in die Rechreche, wie einzelnen Variablen eventuelle schon genannt werden in dem VSME Efrag universum, damit wir hier auch fachlich schon die richtige bennungen verwenden, wenn es diese gibt. Was hier ein beispiel ist, ist ads Modul, dies können wir eins zu eins übernehmen.

Was ich mir auch noch für eine Frage stelle, wie stellen wir dem LLM die Daten best möglcih bereit in dem Spec, also beispielswies in einem JSON format, welches Fromat mögen LLMs

Was uch noch gut wäre damit wir das Datenmodel auch noch in einfach menschenleserlcih beispielsweise in einem Mermaid modell in markdown dokumentieren.


Desweitern sollten man sich auch gedanken machen was wird von dem frontend an das backend gesendet, mach dir auch hierrüber gedanken, ob nur die Values mit Namen oder Ids reicht oder was hier am besten wäre und wie natürlcih dann das Backend das Datenmodel auf den Excel Name Range mappt um den wert in die Excel zu schrieben


Geh in eine Gründelich Anlyse dieser Aufgabe und der Excel. Bringe gerne eigene Sinnvolle Ideen ein, welche das Datenmodell Speck verbessern können. 