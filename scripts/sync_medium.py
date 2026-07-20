#!/usr/bin/env python3
"""
Medium -> Hugo senkronizasyonu.

medium.com/feed/@erenonder0 adresindeki RSS'i okur ve her yaziyi
content/blog/ altina Hugo markdown dosyasi olarak yazar.

Medium RSS yalnizca son 10 yaziyi dondurur; bu script dosyalari repoya
yazdigi icin feed'den dusen eski yazilar sitede kalmaya devam eder.

Kullanim:  python scripts/sync_medium.py
"""

import html
import json
import os
import re
import sys
import unicodedata
import urllib.request
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

FEED_URL = "https://medium.com/feed/@erenonder0"
OUT_DIR = os.path.join("content", "blog")

# Yazilar hem Ingilizce hem Turkce site surumunde gorunsun diye iki dosya yazilir.
LANG_SUFFIXES = ["", ".tr"]

TR_MAP = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")


def slugify(text):
    text = text.translate(TR_MAP)
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return re.sub(r"-{2,}", "-", text)[:70] or "post"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (hugo-medium-sync)"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def cdata(block, tag):
    """<tag><![CDATA[..]]></tag> veya <tag>..</tag> icerigini dondurur."""
    m = re.search(r"<%s[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</%s>" % (tag, tag), block, re.S)
    return m.group(1).strip() if m else ""


def clean_html(body):
    """Medium'a ozgu takip pikselini ve kaynak parametrelerini temizler."""
    # Gorunmez takip pikseli (medium.com/_/stat?event=post.clientViewed...)
    body = re.sub(r'<img[^>]*medium\.com/_/stat[^>]*>', "", body)
    # Link ve gorsellerdeki ?source=rss------ parametreleri
    body = re.sub(r'([?&])source=rss[^"&\']*', r"\1", body)
    body = re.sub(r'[?&](?=["\'])', "", body)
    return body.strip()


def first_image(body):
    m = re.search(r'<img[^>]+src="([^"]+)"', body)
    return m.group(1) if m else ""


def excerpt(body, limit=200):
    text = re.sub(r"<[^>]+>", " ", body)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    return text[:limit].rsplit(" ", 1)[0] + "..."


def yaml_str(value):
    """YAML icin guvenli tirnakli string (baslikta : veya \" olabilir)."""
    return json.dumps(value, ensure_ascii=False)


def parse_items(xml):
    posts = []
    for block in re.findall(r"<item>(.*?)</item>", xml, re.S):
        title = html.unescape(cdata(block, "title"))
        link = cdata(block, "link").split("?")[0]
        body = clean_html(cdata(block, "content:encoded"))
        if not title or not link:
            continue

        raw_date = cdata(block, "pubDate")
        try:
            date = parsedate_to_datetime(raw_date)
        except (TypeError, ValueError):
            date = datetime.now(timezone.utc)

        tags = [html.unescape(t) for t in re.findall(
            r"<category>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</category>", block, re.S)]

        posts.append({
            "title": title,
            "link": link,
            "date": date,
            "tags": sorted({t.strip() for t in tags if t.strip()}),
            "body": body,
            "slug": slugify(title),
            "image": first_image(body),
            "excerpt": excerpt(body),
        })
    return posts


def render(post):
    fm = [
        "---",
        "title: %s" % yaml_str(post["title"]),
        "date: %s" % post["date"].isoformat(),
        "draft: false",
        'type: "blog"',
        "summary: %s" % yaml_str(post["excerpt"]),
        "medium_url: %s" % yaml_str(post["link"]),
        "canonical_url: %s" % yaml_str(post["link"]),
        "source: medium",
    ]
    if post["tags"]:
        fm.append("tags:")
        fm.extend("  - %s" % yaml_str(t) for t in post["tags"])
    if post["image"]:
        fm.append("images:")
        fm.append("  featured_image: %s" % yaml_str(post["image"]))
    fm.append("---")
    return "\n".join(fm) + "\n\n" + post["body"] + "\n"


def main():
    try:
        xml = fetch(FEED_URL)
    except Exception as exc:
        print("HATA: Medium feed'i alinamadi: %s" % exc, file=sys.stderr)
        return 1

    posts = parse_items(xml)
    if not posts:
        print("HATA: Feed'de yazi bulunamadi (yapisi degismis olabilir).", file=sys.stderr)
        return 1

    os.makedirs(OUT_DIR, exist_ok=True)
    written = 0

    for post in posts:
        content = render(post)
        for suffix in LANG_SUFFIXES:
            path = os.path.join(OUT_DIR, "%s%s.md" % (post["slug"], suffix))
            old = None
            if os.path.exists(path):
                with open(path, encoding="utf-8") as fh:
                    old = fh.read()
            if old == content:
                continue
            with open(path, "w", encoding="utf-8", newline="\n") as fh:
                fh.write(content)
            written += 1
            print("%s %s" % ("guncellendi:" if old else "eklendi:    ", path))

    print("\n%d yazi islendi, %d dosya yazildi." % (len(posts), written))
    return 0


if __name__ == "__main__":
    sys.exit(main())
