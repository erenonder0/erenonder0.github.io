---
date: '2026-01-20T00:00:00+03:00'
title: 'URL Guard - Yapay Zekâ Destekli Zararlı URL Tespit Sistemi'
draft: false

params:
    button:
        icon: "icon-arrow-right"
        btnText: "Detayları Gör"
    tags: ["Makine Öğrenmesi", "Phishing", "Threat Intelligence", "Python", "Flask"]
    warning: "Geliştirme aşamasında"
    image:
        src: "images/works/url-guard.png"
        scale: 1
---

Makine öğrenmesini, kural tabanlı analizi, tehdit istihbaratını ve yapay zekâyı tek bir karar motorunda birleştiren; kendi kendini eğiten, lokal çalışan bir phishing / zararlı URL tespit sistemi tasarladım.

## Çözdüğü problem

Piyasadaki URL kontrol araçlarının çoğu ya yalnızca kara listeye bakar — yeni saldırılara karşı kördür — ya da gerekçesi belli olmayan tek bir kapalı kutu skoru üretir. URL Guard her iki yaklaşımı da kullanır ve üstüne bir SOC analistinin muhakemesini ekler: tüm kanıtları okur, aralarındaki çelişkileri çözer ve **gerekçeli, güven skorlu** bir karar verir.

## Karar motoru

Kanıtlar birden çok bağımsız kaynaktan toplanır:

- **Makine öğrenmesi** — 24 sözcüksel ve yapısal özellik üzerinde eğitilen Random Forest modeli. URL metnini ezberlemek yerine genelleme yapacak şekilde kurgulandı.
- **Kara liste** — OpenPhish ve URLhaus beslemeleri 12 saatte bir otomatik güncellenir. Kara liste kesin kanıt sayılır ve başka hiçbir kaynak tarafından ezilemez.
- **Marka taklidi tespiti** — Levenshtein mesafesi ve IDN homograph analizi ile `rnicrosoft` → `microsoft` veya Kiril `а` ile Latin `a` karışıklığı gibi görsel taklitler yakalanır.
- **Alan adı ve sertifika güvenilirliği** — RDAP üzerinden alan adı yaşı ve registrar bilgisi, sertifika geçerliliği, TLS sürümü, yönlendirme zinciri ve cross-domain/downgrade tespiti.
- **Dış doğrulama** — URLScan.io ile canlı ekran görüntüsü ve bağımsız motor sonucu, AbuseIPDB ile IP itibar skoru.

## Ayırt edici tarafları

- **Kendi kendini eğiten model** — Yapay zekânın yüksek güvenle verdiği kararlar, arka planda Random Forest modelini otomatik olarak yeniden eğitir. Büyük model küçük modeli sürekli geliştirir *(knowledge distillation)*.
- **Yanlış pozitife karşı tasarım** — Meşru siteler ezberden değil, en çok ziyaret edilen 50.000 gerçek alan adından öğrenilerek tanınır.
- **IP farkındalığı** — Çıplak bir IP adresi girildiğinde ters DNS ve ileri doğrulama ile gerçek sahibi kontrol edilir; bilinmeyen IP'lerde modelin aşırı güveni bilinçli olarak sınırlanır.
- **Baştan sertleştirilmiş** — Rate limiting, SSRF koruması, girdi doğrulama ve admin brute-force koruması, canlıya alınmadan önce uygulandı.

## Teknik yapı

Python 3.10+, Flask ve scikit-learn üzerine kurulu; yapay zekâ katmanı OpenRouter üzerinden çalışıyor. Yapay zekâ devre dışı bırakıldığında sistem ağırlıklı çok kaynaklı füzyona düşerek çalışmaya devam eder.

> Proje şu anda test aşamasında ve kaynak kodu özel repoda tutuluyor.
