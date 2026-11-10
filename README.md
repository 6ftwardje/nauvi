# Nauvi Website

Zelfstandig Next.js-project voor de publieke Nauvi-homepage. De eerste versie is overgenomen van `codex/nauvi-website` op Synaps-commit `2b4ce5e`. De interactieve voorbeelden en merkbestanden staan in dit project. Synaps beheert de klantomgeving en haar gegevens.

## Lokaal starten

Gebruik Node 22.14 of hoger binnen de versies die `package.json` ondersteunt.

```sh
npm ci
cp -n .env.example .env.local
npm run dev -- --port 4410
```

Open [de homepage](http://127.0.0.1:4410/). De lokale instelling verwijst naar [de bestaande Synaps-preview](http://localhost:4398/app). Stel `SYNAPS_APP_URL` in op de volledige login-URL van de Synaps-omgeving die je wilt gebruiken. Voor een andere omgeving stel je diezelfde variabele in op de webserver.

De route `/app` stuurt bezoekers door naar Synaps. Bestaande links met `invite` of `token` op de homepage of op `/app` komen daar ook aan.

## Controleren

```sh
npm run build
npm run typecheck
npm run test:browser
```

De browsertests starten hun eigen Nauvi-server op poort 4411. Installeer zo nodig Chromium met `npx playwright install chromium`.
