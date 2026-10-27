---
layout: home

hero:
  name: "Print Buddy"
  text: "Prepare and manage 3D prints from Discord"
  tagline: "Share a MakerWorld or Printables link, or upload an STL or 3MF — Print Buddy guides you through preparation, filament choices and slicing, with an explicit confirmation before anything starts printing."
  image:
    src: /logo.png
    alt: Print Buddy
  actions:
    - theme: brand
      text: Get Started
      link: /docker
    - theme: alt
      text: View on GitHub
      link: https://github.com/catduckgnaf/print-buddy

features:
  - icon: 📥
    title: Guided intake
    details: Take a MakerWorld or Printables link, or an uploaded STL or 3MF, through guided choices for colours, fit and supported layouts.
  - icon: ✂️
    title: Slicing built in
    details: Slice with OrcaSlicer, or Bambu Studio for Bambu Lab printers, using the correct printer, process and filament profiles.
  - icon: 🧵
    title: Spoolman filament matching
    details: Match loaded spools from Spoolman and keep spool identity, material and colour information consistent from intake to print.
  - icon: ✅
    title: Confirmation before printing
    details: Nothing prints on its own. Confirm bed clearance and approve the exact sliced job before Print Buddy submits it to the printer.
  - icon: 📷
    title: Camera watch & timelapses
    details: While a print runs, the camera watchdog checks frames for spaghetti and other failures and posts an alert with Pause and It's fine buttons, alongside printer events and timelapses.
  - icon: 💬
    title: Discord, Telegram & Matrix
    details: Run the same standalone bot on Discord, Telegram or Matrix — a pure bot with no LLM required in the print path.
---

[![CI](https://github.com/catduckgnaf/print-buddy/actions/workflows/ci.yml/badge.svg)](https://github.com/catduckgnaf/print-buddy/actions/workflows/ci.yml)
[![GitHub releases](https://img.shields.io/github/v/release/catduckgnaf/print-buddy)](https://github.com/catduckgnaf/print-buddy/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/catduckgnaf/print-buddy/blob/main/LICENSE)

## Start here

- [Introduction](/guide) — the documentation index and how to find the right guide.
- [Docker](/docker) — the single-container install: bot, listener and bundled Spoolman in one image.
- [Discord bot setup](/discord-bot-setup) — create your Discord application and bot, and hand Print Buddy the token and IDs safely.
- [Printer profiles](/printer-profiles) — supported printers, delivery methods and verification limits.
- [Troubleshooting](/troubleshooting) — troubleshoot by symptom.
