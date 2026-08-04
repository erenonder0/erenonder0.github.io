---
date: '2026-01-20T00:00:00+03:00'
title: 'URL Guard - AI-Assisted Malicious URL Detection'
draft: false

params:
    button:
        icon: "icon-arrow-right"
        btnText: "See Details"
    tags: ["Machine Learning", "Phishing", "Threat Intelligence", "Python", "Flask"]
    warning: "In development"
    image:
        src: "images/works/url-guard.png"
        scale: 1
---

A self-training, locally hosted phishing and malicious URL detector that combines machine learning, rule-based analysis, threat intelligence and AI into a single decision engine.

## The problem it solves

Most URL checkers either look only at a blocklist — blind to fresh attacks — or return a single black-box score with no stated reasoning. URL Guard does both, and adds the judgement of a SOC analyst on top: it reads every piece of evidence, resolves the contradictions between them, and produces a **reasoned verdict with a confidence score**.

## The decision engine

Evidence is gathered from several independent sources:

- **Machine learning** — A Random Forest trained on 24 lexical and structural features, designed to generalise rather than memorise URL strings.
- **Blocklists** — OpenPhish and URLhaus feeds refreshed automatically every 12 hours. A blocklist hit counts as hard evidence and cannot be overridden by any other source.
- **Brand impersonation** — Levenshtein distance and IDN homograph analysis catch visual look-alikes such as `rnicrosoft` → `microsoft`, or Cyrillic `а` passing as Latin `a`.
- **Domain and certificate trust** — Domain age and registrar via RDAP, certificate validity, TLS version, redirect chain, and cross-domain/downgrade detection.
- **External verification** — A live screenshot and independent engine verdict from URLScan.io, plus IP reputation from AbuseIPDB.

## What sets it apart

- **A model that trains itself** — High-confidence AI verdicts feed back into the Random Forest, retraining it in the background. The large model continuously improves the small one *(knowledge distillation)*.
- **Built against false positives** — Legitimate sites are recognised by learning from the 50,000 most-visited real domains rather than a hardcoded allowlist.
- **IP awareness** — Given a bare IP address, reverse DNS with forward confirmation checks who actually owns it, and the model's overconfidence on unknown IPs is deliberately capped.
- **Hardened from day one** — Rate limiting, SSRF protection, input validation and admin brute-force protection were in place before it ever went live.

## Technical build

Python 3.10+, Flask and scikit-learn, with the AI layer running through OpenRouter. With AI disabled the system degrades gracefully to weighted multi-source fusion and keeps working.

> The project is currently in testing and its source is kept in a private repository.
