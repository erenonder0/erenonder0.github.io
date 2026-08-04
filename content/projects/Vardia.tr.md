---
date: '2026-02-01T00:00:00+03:00'
title: 'Vardia - Siber Tehdit İstihbaratı Platformu'
draft: false

params:
    button:
        icon: "icon-arrow-right"
        btnText: "Detayları Gör"
    tags: ["Tehdit İstihbaratı", "CVE", "Darkweb İzleme", "Next.js", "PostgreSQL"]
    warning: "Geliştirme aşamasında"
    image:
        src: "images/works/vardia.png"
        scale: 1
---

CVE'leri, zero-day'leri, fidye yazılımı sızıntılarını, darkweb duyurularını ve güvenlik haberlerini tek bir akışta toplayan; bunları tekilleştirip önceliklendiren ve kurumun kullandığı teknolojilerle eşleştiren bir siber tehdit istihbaratı platformu geliştirdim.

## Çözdüğü problem

Bir güvenlik ekibi sabah beş ayrı yere bakmak zorunda kalıyor: CVE için NVD'ye, sızıntılar için ransomware.live'a, habere BleepingComputer'a, kimin verisinin satıldığını görmek için forumlara ve Telegram kanallarına. Vardia bunları tek akışta birleştirir ve asıl soruyu cevaplar: **"Bu beni ilgilendiriyor mu?"**

## Öne çıkan yetenekler

- **Stack eşleştirme ve sürüm kararı** — Kullandığınız ürünleri ve sürümleri tanımlarsınız; gelen zafiyetin sizi etkileyip etkilemediği sürüm karşılaştırmasıyla belirlenir. Karar verilemeyen durumlarda sistem bunu açıkça "karar verilemedi" olarak işaretler; yanlış bir "etkilenmiyorsunuz" cevabı, cevapsız kalmaktan daha tehlikelidir.
- **Darkweb ve Telegram izleme** — Sızıntı duyurularının ağırlığı forumlardan Telegram'a kaydı. Platform 24 herkese açık kanalı ve clearnet forumlarını izleyerek belirlenen anahtar kelimelerle eşleşen duyuruları gerçek zamanlı yakalar ve anlık bildirim gönderir. Bu, SOC ekiplerinin bir sızıntıdan haberdar olma süresini belirgin şekilde kısaltır.
- **Fidye vakaları ve üretici bültenleri** — Fidye gruplarının kurban duyuruları ile üretici güvenlik bültenleri aynı akışta toplanır.
- **Türkçe arayüz ve yapay zekâ destekli özetleme** — Uzun bültenler ve teknik duyurular, hızlı triyaj için özetlenir.

## Teknik yapı

TypeScript ve Next.js 15 üzerine kurulu, PostgreSQL 17 ile çalışan bir uygulama. Karar mantığının doğruluğu 240 otomatik testle güvence altına alınmış durumda.

> Proje şu anda test aşamasında ve kaynak kodu özel repoda tutuluyor.
