---
date: '2026-02-01T00:00:00+03:00'
title: 'Vardia - Cyber Threat Intelligence Platform'
draft: false

params:
    button:
        icon: "icon-arrow-right"
        btnText: "See Details"
    tags: ["Threat Intelligence", "CVE", "Darkweb Monitoring", "Next.js", "PostgreSQL"]
    warning: "In development"
    image:
        src: "images/works/vardia.png"
        scale: 1
---

A cyber threat intelligence platform that pulls CVEs, zero-days, ransomware leaks, darkweb postings and security news into a single feed, then deduplicates, prioritises and matches them against the technology stack an organisation actually runs.

## The problem it solves

A security team starts the day checking five different places: NVD for CVEs, ransomware.live for leaks, BleepingComputer for news, plus forums and Telegram channels to see whose data is being sold. Vardia merges those into one feed and answers the question that actually matters: **"Does this affect me?"**

## Key capabilities

- **Stack matching with version resolution** — You declare the products and versions you run, and each incoming vulnerability is resolved against them. Where a verdict cannot be reached, the system says so explicitly rather than guessing; a wrong "you are not affected" is more dangerous than no answer at all.
- **Darkweb and Telegram monitoring** — Leak announcements have largely moved from forums to Telegram. The platform watches 24 public channels and clearnet forums, catching keyword matches in real time and pushing instant alerts. This measurably shortens the time it takes a SOC team to learn about a breach.
- **Ransomware cases and vendor advisories** — Ransomware victim postings and vendor security bulletins land in the same prioritised feed.
- **AI-assisted summarisation** — Long advisories and technical postings are condensed for fast triage.

## Technical build

Built on TypeScript and Next.js 15 with PostgreSQL 17. The correctness of the decision logic is covered by 240 automated tests.

> The project is currently in testing and its source is kept in a private repository.
