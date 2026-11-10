---
name: "Nauvi"
description: "De publieke Nauvi-website op route /"
colors:
  accent: "#1768e7"
  accent-tint: "#edf5ff"
  blue-bright: "#d5e6fb"
  label-on-blue: "#545e70"
  espresso: "#160f0c"
  button-hover: "#352923"
  white: "#ffffff"
  linen: "#f7f7f5"
  bone: "#edece7"
  ink: "#0d0d0d"
  muted: "#444444"
  label: "#686663"
  border: "#deddd6"
  border-strong: "#b9b7af"
typography:
  display:
    fontFamily: "Hubot Sans, Inter, sans-serif"
    fontSize: "clamp(44px, 4.4vw, 64px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Hubot Sans, Inter, sans-serif"
    fontSize: "clamp(34px, 3.8vw, 47px)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "Inter, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  compact: "7px"
  button: "9px"
  dialog: "14px"
  pill: "999px"
spacing:
  gutter: "48px"
  gutter-medium: "30px"
  gutter-small: "22px"
  section: "88px"
  section-medium: "72px"
  section-small: "56px"
  content-width: "1248px"
components:
  button-primary:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.compact}"
    padding: "13px 22px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.button-hover}"
  button-outline:
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.compact}"
    padding: "13px 22px"
    height: "50px"
  tool-search:
    backgroundColor: "{colors.linen}"
    textColor: "{colors.ink}"
    rounded: "{rounded.compact}"
    padding: "0 15px"
    height: "47px"
  tool-tile:
    backgroundColor: "{colors.white}"
    textColor: "{colors.label}"
    rounded: "{rounded.compact}"
    height: "79px"
  booking-dialog:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.dialog}"
---

# Nauvi

## Overview

De publieke route `/` volgt het Nauvi Merkboek, versie 3. Witruimte, lichte materialen en regelmatige typografie geven de tekst en productdemonstraties ruimte. De login verwijst naar de zelfstandige Synaps-klantomgeving.

Het woordmerk, de ster en het app-icoon komen ongewijzigd uit de publieke merkbestanden van Nauvi. Houd rondom het woordmerk vrije ruimte ter hoogte van de kleine n. [Woordmerk](https://nauvi.ai/brand/nauvi-logo-primary.svg) · [Ster](https://nauvi.ai/brand/nauvi-star.svg) · [App-icoon](https://nauvi.ai/brand/nauvi-app-icon.png)

## Colors

Wit en linnen dragen de pagina. Lichtblauw draagt het drukraster bij de automatiseringen en markeert geselecteerde categorieën. Been geeft het Company Brain-diagram een warm vlak. Inkt draagt koppen en grafiet de lopende tekst. Espresso is de achtergrond van primaire knoppen.

Nauvi-blauw komt terug in korte kopaccenten, focus en de productvisualisatie. De hero en afsluitende kennismaking hebben een zachte blauwe gloed. De overige hoofdstukken wisselen witte vlakken, papiervezels, een onregelmatige inktlijn en een blauw drukraster af.

## Typography

Gebruik Hubot Sans Regular voor koppen en Inter voor tekst, navigatie en knoppen. Het blauwe kopaccent blijft in Hubot Sans. De lokaal geladen Hubot Sans Regular komt uit versie 1.0.1 onder de SIL Open Font License 1.1. [Hubot Sans](https://github.com/github/hubot-sans/tree/v1.0.1) · [Licentie](public/fonts/hubot-sans-OFL.txt)

## Layout

De hoofdsecties volgen een inhoudsbreedte van 1248 px. Zijmarges lopen van 48 naar 30 en 22 px. Sectieruimte loopt van 88 naar 72 en 56 px. De hero schakelt bij 920 px naar één kolom en de navigatie onder 1024 px naar een uitklapmenu.

## Elevation & Depth

Witte en linnen vlakken, dunne scheidingslijnen en ruimte bepalen de hiërarchie. De compacte navigatie en het afspraakvenster krijgen een zachte schaduw. De twee blauwe lichtvlakken bewegen subtiel mee met scroll, muis of pen en staan stil bij een voorkeur voor minder beweging. De papiervezels en het drukraster zijn procedureel getekend voor Nauvi. Een kleine onderbroken inktlijn opent de werkwijze.

## Shapes

Knoppen, zoekvelden en integratietegels hebben bescheiden afronding. Het afspraakvenster heeft ruimere hoeken en de compacte desktopnavigatie is pilvormig.

## Components

De hoofdknop is espressokleurig met witte tekst. De omrande variant gebruikt inkt en krijgt bij hover een beenkleurige achtergrond. Toetsenbordfocus krijgt een blauwe ring van 3 px.

Het zoekveld heeft een linnen achtergrond en blauwe focusrand. Geselecteerde filters krijgen een lichtblauwe achtergrond en een blauwe rand. Integratietegels tonen het originele toollogo op wit. Het afspraakvenster combineert een linnen introductievlak met een wit agendavlak.

## Do's and Don'ts

- Gebruik het officiële woordmerk en de officiële ster in hun oorspronkelijke verhoudingen en kleuren.
- Houd de publieke typografie bij Hubot Sans en Inter.
- Laat de gidsfiguren buiten deze website.
