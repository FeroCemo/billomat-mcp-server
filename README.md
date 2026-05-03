# Billomat MCP Server

Der erste MCP-Server für [Billomat](https://www.billomat.com) – das deutsche Rechnungs- und Buchhaltungstool.

## Features

**12 Tools in 3 Kategorien:**

### Kunden (Clients)
- `billomat_list_clients` – Kunden auflisten & filtern
- `billomat_get_client` – Kunden-Details abrufen
- `billomat_create_client` – Neuen Kunden anlegen
- `billomat_update_client` – Kunden aktualisieren
- `billomat_delete_client` – Kunden löschen

### Rechnungen (Invoices)
- `billomat_list_invoices` – Rechnungen auflisten (Filter: Status, Datum, Kunde)
- `billomat_get_invoice` – Rechnung im Detail abrufen
- `billomat_create_invoice` – Neue Rechnung erstellen (Entwurf)
- `billomat_add_invoice_item` – Rechnungsposition hinzufügen
- `billomat_complete_invoice` – Rechnung abschließen (DRAFT → OPEN)
- `billomat_cancel_invoice` – Rechnung stornieren

### Angebote (Offers)
- `billomat_list_offers` – Angebote auflisten
- `billomat_create_offer` – Neues Angebot erstellen
- `billomat_win_offer` – Angebot als gewonnen markieren

## Installation

```bash
npm install
npm run build
```

## Konfiguration

Zwei Umgebungsvariablen sind nötig:

| Variable | Beschreibung | Beispiel |
|----------|-------------|---------|
| `BILLOMAT_ID` | Deine Billomat-Subdomain | `meinefirma` |
| `BILLOMAT_API_KEY` | API-Key aus Billomat-Einstellungen | `abc123...` |

Den API-Key findest du in Billomat unter: **Einstellungen → API**

## Nutzung

### stdio (für Claude Desktop, Cursor, etc.)

```bash
BILLOMAT_ID=meinefirma BILLOMAT_API_KEY=abc123 node dist/index.js
```

**Claude Desktop (`claude_desktop_config.json`):**
```json
{
  "mcpServers": {
    "billomat": {
      "command": "node",
      "args": ["/pfad/zu/billomat-mcp-server/dist/index.js"],
      "env": {
        "BILLOMAT_ID": "meinefirma",
        "BILLOMAT_API_KEY": "abc123"
      }
    }
  }
}
```

### HTTP (für Remote-Deployment)

```bash
TRANSPORT=http BILLOMAT_ID=meinefirma BILLOMAT_API_KEY=abc123 node dist/index.js
```

## Beispiel-Workflow

> „Erstelle eine Rechnung für Kunde Max Muster über 5 Stunden Beratung à 150 €, 19% MwSt, fällig in 14 Tagen."

Der Agent ruft automatisch auf:
1. `billomat_list_clients` → findet Kunden-ID
2. `billomat_create_invoice` → erstellt Entwurf
3. `billomat_add_invoice_item` → fügt Position hinzu
4. `billomat_complete_invoice` → schließt ab

## Lizenz

MIT
