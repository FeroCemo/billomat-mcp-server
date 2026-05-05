# Billomat MCP Server

Der erste MCP-Server für [Billomat](https://www.billomat.com) – das deutsche Rechnungs- und Buchhaltungstool. Verbinde deinen KI-Assistenten (Claude, Cursor, etc.) direkt mit deinem Billomat-Account.

## Hosted Version (empfohlen)

Der Server läuft bereits fertig auf [MCPize](https://mcpize.com) – kein eigenes Deployment nötig.

**Server-URL:** `https://billomat-mcp-server-production.up.railway.app/mcp`

### Setup in 3 Schritten

**1. Billomat API-Zugriff aktivieren**

In Billomat: **Einstellungen → Nutzer → „bearbeiten" → API Zugriff → „aktivieren?" ✓ → Speichern**

Dann: **„API-Schlüssel anzeigen"** → Key kopieren

**2. Deine Zugangsdaten notieren**

| Wert | Wo zu finden | Beispiel |
|------|-------------|---------|
| Subdomain | Deine Billomat-URL: `[subdomain].billomat.net` | `meinefirma` |
| API Key | Billomat → Einstellungen → Nutzer → bearbeiten | `abc123...` |

**3. MCP-Client konfigurieren**

Trage beim MCP-Client die Server-URL ein und setze diese HTTP-Header:

```
X-Billomat-Api-Key: <dein-api-key>
X-Billomat-Subdomain: <deine-subdomain>
```

Beispiel-Konfiguration (Claude Desktop o.ä. mit HTTP-MCP-Support):
```json
{
  "mcpServers": {
    "billomat": {
      "url": "https://billomat-mcp-server-production.up.railway.app/mcp",
      "headers": {
        "X-Billomat-Api-Key": "dein-api-key",
        "X-Billomat-Subdomain": "deine-subdomain"
      }
    }
  }
}
```

---

## Tools (14)

### Kunden (Clients)
- `list-clients` – Kunden auflisten & filtern
- `get-client` – Kunden-Details abrufen
- `create-client` – Neuen Kunden anlegen
- `update-client` – Kunden aktualisieren

### Rechnungen (Invoices)
- `list-invoices` – Rechnungen auflisten (Filter: Status, Datum, Kunde)
- `get-invoice` – Rechnung im Detail abrufen
- `create-invoice` – Neue Rechnung erstellen (Entwurf)
- `update-invoice` – Rechnung bearbeiten
- `complete-invoice` – Rechnung abschließen (DRAFT → OPEN)
- `send-invoice-email` – Rechnung per E-Mail versenden

### Angebote (Offers)
- `list-offers` – Angebote auflisten
- `get-offer` – Angebot-Details abrufen
- `create-offer` – Neues Angebot erstellen
- `update-offer` – Angebot bearbeiten

---

## Beispiel-Workflow

> „Erstelle eine Rechnung für Kunde Max Muster über 5 Stunden Beratung à 150 €, 19% MwSt, fällig in 14 Tagen."

Der Agent ruft automatisch auf:
1. `list-clients` → findet Kunden-ID
2. `create-invoice` → erstellt Entwurf
3. `complete-invoice` → schließt ab
4. `send-invoice-email` → versendet

---

## Self-Hosting

```bash
git clone https://github.com/FeroCemo/billomat-mcp-server
cd billomat-mcp-server
npm install && npm run build
PORT=3000 node dist/index.js
```

Der Server akzeptiert Credentials pro Request via `X-Billomat-Api-Key` und `X-Billomat-Subdomain` Header – keine festen Credentials nötig (Multi-Tenant).

Optional: Fallback-Credentials via Umgebungsvariablen `BILLOMAT_API_KEY` und `BILLOMAT_SUBDOMAIN` für Single-Tenant-Betrieb.

## Lizenz

MIT
