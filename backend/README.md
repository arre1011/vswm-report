# Backend - VSME Report

Spring Boot Backend mit Kotlin für das VSME Report Projekt.

## Tech Stack

- **Kotlin** - Programmiersprache
- **Spring Boot 3.5.7** - Framework
- **Java 21** - Laufzeitumgebung

## Setup

### Voraussetzungen

- Java 21 oder höher
- Gradle (wird über Wrapper mitgeliefert)

### Backend starten

```bash
cd backend
./gradlew bootRun
```

Das Backend läuft dann auf `http://localhost:8080`

## API Endpoints

### POST /api/submit

Sendet die Wizard-Daten an das Backend.

**Request Body:**
```json
{
  "address": {
    "name": "Max Mustermann",
    "street": "Musterstraße",
    "houseNumber": "123",
    "city": "Berlin"
  },
  "email": {
    "email": "max@example.com",
    "confirmEmail": "max@example.com"
  },
  "personal": {
    "currency": "EUR"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Daten erfolgreich empfangen und verarbeitet",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## CORS

Das Backend ist für folgende Frontend-URLs konfiguriert:
- `http://localhost:5173` (Vite Dev Server)
- `http://localhost:3000` (Alternative Frontend Port)

## Projektstruktur

```
backend/
├── src/
│   ├── main/
│   │   ├── kotlin/
│   │   │   └── org/example/backend/
│   │   │       ├── BackendApplication.kt
│   │   │       ├── controller/
│   │   │       │   └── SubmissionController.kt
│   │   │       └── dto/
│   │   │           └── WizardDataDto.kt
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── build.gradle.kts
```

