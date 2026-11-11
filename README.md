# Nauvi Website

Zelfstandig Next.js-project voor de publieke Nauvi-homepage. De eerste versie is overgenomen van `codex/nauvi-website` op Synaps-commit `2b4ce5e`. De interactieve voorbeelden en merkbestanden staan in dit project. Synaps beheert de klantomgeving en haar gegevens.

## Lokaal starten

Gebruik Node 22.14 of hoger binnen de versies die `package.json` ondersteunt.

```sh
npm ci
cp -n .env.example .env.local
npm run dev -- --port 4410
```

Open [de homepage](http://127.0.0.1:4410/). De lokale instelling verwijst naar [de bestaande Synaps-preview](http://localhost:4398/app). Stel `SYNAPS_APP_URL` in op de volledige login-URL van de Synaps-omgeving die je wilt gebruiken. Voor een andere omgeving stel je diezelfde variabele in op de webserver. Zonder die variabele blijft de homepage werken; `/app` antwoordt dan met een korte melding.

### Subpad en reverse proxy

De dev-server bindt standaard op `127.0.0.1`. Zet `NAUVI_DEV_HOST=0.0.0.0` als een proxy op een andere machine moet verbinden. Een vreemde `Host`-header blokkeert de HTML-pagina niet. Requests naar `/_next` wel, tenzij de host in `allowedDevOrigins` staat. `yariks-mac-mini.tail1a5e76.ts.net` en `*.tail1a5e76.ts.net` staan daar al in. Extra hosts komen via `ALLOWED_DEV_ORIGINS` (kommagescheiden).

Voor een URL-subpad zoals `/alt-branded-look/` zet je `NEXT_PUBLIC_BASE_PATH` vóór `dev` of `build`. Next.js leest die waarde bij het opstarten.

```sh
NAUVI_DEV_HOST=0.0.0.0 NEXT_PUBLIC_BASE_PATH=/alt-branded-look npm run dev -- --port 4410
```

De site staat dan op `http://127.0.0.1:4410/alt-branded-look/`. De proxy moet het subpad laten staan; Next.js zet het zelf voor links, `/_next` en bestanden in `public/`.

De route `/app` stuurt bezoekers door naar Synaps. Bestaande links met `invite` of `token` op de homepage of op `/app` komen daar ook aan.

## Controleren

```sh
npm run build
npm run typecheck
npm run test:browser
```

De browsertests starten hun eigen Nauvi-server op poort 4411. Installeer zo nodig Chromium met `npx playwright install chromium`.
