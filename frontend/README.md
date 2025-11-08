# Frontend - VSME Report

Frontend-Anwendung mit React, TypeScript, Vite, Tailwind CSS und shadcn/ui.

## Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components

## Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` verfügbar.

## Verfügbare Scripts

- `npm run dev` - Startet den Entwicklungsserver
- `npm run build` - Erstellt einen Production Build
- `npm run preview` - Vorschau des Production Builds
- `npm run lint` - Führt ESLint aus

## Projektstruktur

```
frontend/
├── public/           # Öffentliche Dateien
├── src/
│   ├── components/   # React Komponenten
│   │   └── ui/       # shadcn/ui Komponenten
│   ├── lib/          # Utility Funktionen
│   ├── App.tsx       # Hauptkomponente
│   ├── main.tsx      # Entry Point
│   └── index.css     # Globale Styles
├── components.json   # shadcn/ui Konfiguration
├── tailwind.config.js # Tailwind Konfiguration
├── tsconfig.json     # TypeScript Konfiguration
└── vite.config.ts    # Vite Konfiguration
```

## shadcn/ui Komponenten hinzufügen

Um neue shadcn/ui Komponenten hinzuzufügen, verwenden Sie:

```bash
npx shadcn-ui@latest add [component-name]
```

Beispiel:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

## Path Aliases

Das Projekt verwendet Path Aliases für einfachere Imports:

```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

## Tailwind CSS

Tailwind CSS ist vollständig konfiguriert mit:
- Custom Color Scheme (unterstützt Dark Mode)
- shadcn/ui Theme Variablen
- Responsive Design Utilities

## TypeScript

Das Projekt verwendet TypeScript mit strikten Einstellungen für maximale Type Safety.
