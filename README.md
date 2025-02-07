# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Headless CMS AI Chat Widget

## Projektübersicht
Ein KI-gestütztes Chat-Widget für Headless CMS Websites (initial für cosphera.net), das Besuchern hilft, Informationen auf der Website zu finden.

## Aktuelle Version (v0.1)
Wir starten mit einer einfachen Version:
- Reines Frontend mit React
- Gehostet auf GitHub Pages
- Mock-Antworten (noch keine echte KI-Integration)
- Einfaches Chat-Interface

## Geplanter Technischer Stack (Finale Version)
- Frontend: React.js
- CMS: WordPress (Headless)
- Backend: Node.js mit Express
- API: OpenAI GPT-4
- Hosting: 
  - Backend: Vercel
  - Static Files: Cloudflare CDN

## Entwicklungsphasen

### Phase 1: Basis-Version
- [ ] Einfaches Chat-Interface
- [ ] Basis Styling
- [ ] Einfache Test-Antworten (ohne KI)
- [ ] GitHub Pages Deployment

### Phase 2: Backend-Integration
- [ ] Express-Server Setup
- [ ] OpenAI API Integration
- [ ] Basis-Endpoint für Chat-Anfragen
- [ ] CORS und Sicherheitseinstellungen

### Phase 3: Content-Integration
- [ ] API-Integration (REST/GraphQL)
- [ ] Route-Change-Detection
- [ ] Content-Extraktion
- [ ] Context-Management

### Phase 4: KI-Integration
- [ ] OpenAI API Anbindung
- [ ] Context-Aufbereitung
- [ ] Antwort-Generierung
- [ ] Error-Handling

### Phase 5: Deployment
- [ ] Backend auf Vercel
- [ ] Frontend auf Cloudflare
- [ ] Produktions-Konfiguration
- [ ] Performance-Optimierung

## Installation

### Backend (Spätere Phase)
```bash
cd backend
npm init -y
npm install express cors openai dotenv
```

### Frontend
```bash
npm install
npm run dev
```

### Umgebungsvariablen (Spätere Phase)
Erstellen Sie eine `.env` Datei im Backend-Verzeichnis:
```
OPENAI_API_KEY=ihr_api_key
ALLOWED_ORIGIN=https://cosphera.net
```

## Entwicklung

### Lokaler Test
```bash
npm run dev
```

## Sicherheitshinweise
- API-Keys nur im Backend verwenden
- CORS richtig konfigurieren
- Rate Limiting implementieren
- Nutzereingaben validieren
- Content-Security-Policy (CSP) beachten

## Besonderheiten für Headless CMS
1. Content-Erfassung:
   - Zugriff über API oder DOM-Selektoren
   - Berücksichtigung von React-Routing
   - Dynamische Content-Updates

2. API-Integration:
   - WordPress REST API / GraphQL
   - Caching-Strategien
   - Error-Handling

3. React-Spezifika:
   - Route-Change-Detection
   - DOM-Mutations-Beobachtung
   - Dynamische Context-Aktualisierung

## Deployment-Checkliste
- [ ] Umgebungsvariablen setzen
- [ ] CORS-Einstellungen prüfen
- [ ] SSL/HTTPS aktivieren
- [ ] Domain-Einstellungen anpassen
- [ ] API-Endpoints konfigurieren
- [ ] Caching einrichten
- [ ] Performance-Tests durchführen
- [ ] Error-Monitoring einrichten

## Wartung und Updates
- Regelmäßige API-Updates
- Content-Synchronisation prüfen
- Performance-Monitoring
- Error-Logging
- User-Feedback-Analyse

## Erweiterungsmöglichkeiten
1. Mehrsprachenunterstützung
2. Benutzerdefinierte Themes
3. Analytics-Integration
4. Alternative KI-Provider
5. Erweiterte Content-Quellen

## Support
Bei Fragen oder Problemen:
- GitHub Issues
- Dokumentation
- Support-Email

## Lizenz
MIT License

## GitHub Pages Setup
- Repository auf GitHub erstellen
- In package.json hinzufügen:
```json
{
  "homepage": "https://wmittermair.github.io/ai-blog-agent"
}
```
- In vite.config.js konfigurieren:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/ai-blog-agent/',
  build: {
    outDir: 'docs'
  }
})
```

# AI Blog Agent

Ein interaktiver Blog mit KI-Chat-Funktionalität, entwickelt mit React und Vite.

## Features

- Responsive Blog-Layout
- Integriertes Chat-Widget
- Echtzeit-Interaktion mit Nutzern
- Moderne UI mit optimierter UX

## Technologien

- React 18
- Vite
- CSS3
- JavaScript (ES6+)

## Installation

1. Repository klonen:
```bash
git clone [repository-url]
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Entwicklungsserver starten:
```bash
npm run dev
```

## Entwicklung

Das Projekt verwendet:
- Vite als Build-Tool
- React für die UI-Komponenten
- CSS Modules für das Styling

## Lizenz

MIT
