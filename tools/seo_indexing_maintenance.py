#!/usr/bin/env python3
"""Normalize DeutschBloom's static SEO signals without deploying anything."""

from __future__ import annotations

import argparse
import html
import posixpath
import re
from collections import defaultdict
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://deutschbloom.com"
SITEMAP = ROOT / "sitemap.xml"
NETLIFY = ROOT / "netlify.toml"
REDIRECTS = ROOT / "_redirects"

LANG_ORDER = ("pt", "en", "es", "fr", "it", "tr", "ar", "he", "hi", "pl", "id", "ru")
LOCALIZED_SECTIONS = {"blog", "simulado", "podcasts", "teste"}
EXCLUDED_DIRS = {".git", "node_modules", "r2-audios", "r2-audios-blog", "podcast_ru_work"}
AMOSTRA_URL = f"{BASE_URL}/app/amostra.html"

CANONICAL_RE = re.compile(
    r'[ \t]*<link\b(?=[^>]*\brel=["\']canonical["\'])[^>]*>[ \t]*(?:\r?\n)?',
    re.I,
)
HREFLANG_RE = re.compile(
    r'[ \t]*<link\b(?=[^>]*\brel=["\']alternate["\'])(?=[^>]*\bhreflang=["\'][^"\']+["\'])[^>]*>[ \t]*(?:\r?\n)?',
    re.I,
)
HREF_RE = re.compile(r'(\bhref\s*=\s*)(["\'])(.*?)\2', re.I | re.S)
LOC_RE = re.compile(r"<loc>\s*(https://deutschbloom\.com[^<]+?)\s*</loc>", re.I)
URL_BLOCK_RE = re.compile(r"^[ \t]*<url>\s*.*?</url>[ \t]*(?:\r?\n)?", re.I | re.S | re.M)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_if_changed(path: Path, original: str, updated: str, apply: bool) -> bool:
    if updated == original:
        return False
    if apply:
        path.write_text(updated, encoding="utf-8")
    return True


def sitemap_urls(text: str) -> list[str]:
    return [html.unescape(value.strip()) for value in LOC_RE.findall(text)]


def url_to_file(url: str) -> Path:
    path = urlsplit(url).path
    if path == "/":
        return ROOT / "index.html"
    return ROOT / path.lstrip("/")


def localized_identity(url: str) -> tuple[str, str, tuple[str, ...]] | None:
    parts = [part for part in urlsplit(url).path.strip("/").split("/") if part]
    if not parts or parts[0] not in LOCALIZED_SECTIONS:
        return None
    section = parts[0]
    if len(parts) >= 3 and parts[1] in LANG_ORDER:
        language = parts[1]
        identity = tuple(parts[2:])
    else:
        language = "pt"
        identity = tuple(parts[1:])
    return section, language, identity


def insert_before_head_end(text: str, block: str) -> str:
    marker = re.search(r"</head\s*>", text, re.I)
    if not marker:
        raise ValueError("HTML sem </head>")
    return text[: marker.start()] + block.rstrip() + "\n" + text[marker.start() :]


def normalize_head(
    text: str,
    canonical_url: str,
    alternate_urls: dict[str, str] | None,
) -> str:
    text = CANONICAL_RE.sub("", text)
    text = HREFLANG_RE.sub("", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    lines: list[str] = []
    if alternate_urls:
        for language in LANG_ORDER:
            if language in alternate_urls:
                lines.append(
                    f'<link rel="alternate" hreflang="{language}" href="{alternate_urls[language]}">'
                )
        default_url = alternate_urls.get("pt") or next(iter(alternate_urls.values()))
        lines.append(f'<link rel="alternate" hreflang="x-default" href="{default_url}">')
    lines.append(f'<link rel="canonical" href="{canonical_url}">')
    block = "\n".join(lines)

    anchor = re.search(r"^[ \t]*<meta\b[^>]*\bproperty=[\"']og:", text, re.I | re.M)
    if anchor:
        return text[: anchor.start()] + block + "\n" + text[anchor.start() :]
    return insert_before_head_end(text, block)


def build_alias_map(urls: list[str]) -> dict[str, str]:
    aliases: dict[str, str] = {}
    for url in urls:
        path = urlsplit(url).path
        aliases[path] = path
        if path.endswith(".html"):
            aliases[path[:-5]] = path
        if path.endswith("/index.html"):
            parent = path[: -len("index.html")]
            aliases[parent] = path
            aliases[parent.rstrip("/")] = path
    aliases["/index.html"] = "/"
    return aliases


def rewrite_internal_hrefs(text: str, page_url: str, aliases: dict[str, str]) -> str:
    def replacement(match: re.Match[str]) -> str:
        prefix, quote, raw_href = match.groups()
        value = html.unescape(raw_href.strip())
        lowered = value.lower()
        if (
            not value
            or lowered.startswith(("#", "mailto:", "tel:", "javascript:", "data:"))
            or value.startswith("//")
        ):
            return match.group(0)

        resolved = urlsplit(urljoin(page_url, value))
        if resolved.netloc and resolved.netloc != "deutschbloom.com":
            return match.group(0)
        target_path = aliases.get(resolved.path)
        if not target_path or target_path == resolved.path:
            return match.group(0)

        if value.startswith(("http://", "https://")):
            new_value = urlunsplit(("https", "deutschbloom.com", target_path, resolved.query, resolved.fragment))
        else:
            new_value = urlunsplit(("", "", target_path, resolved.query, resolved.fragment))
        return f"{prefix}{quote}{new_value}{quote}"

    return HREF_RE.sub(replacement, text)


def add_noindex_to_amostra(text: str) -> str:
    if re.search(r'<meta\b[^>]*\bname=["\']robots["\']', text, re.I):
        return text
    charset = re.search(r"^[ \t]*<meta\b[^>]*\bcharset=[^>]+>\s*$", text, re.I | re.M)
    tag = '  <meta name="robots" content="noindex,follow">\n'
    if charset:
        return text[: charset.end()] + "\n" + tag + text[charset.end() :].lstrip("\r\n")
    return insert_before_head_end(text, tag)


def normalize_netlify(text: str) -> str:
    if "[build.processing.html]" not in text:
        build_end = re.search(r"(?m)^\s*\[functions\]", text)
        block = '[build.processing.html]\n  pretty_urls = false\n\n'
        if build_end:
            text = text[: build_end.start()] + block + text[build_end.start() :]
        else:
            text = text.rstrip() + "\n\n" + block
    else:
        section = re.compile(
            r"(?ms)^\[build\.processing\.html\]\s*\n(?P<body>.*?)(?=^\[|\Z)"
        )
        match = section.search(text)
        if match and re.search(r"(?m)^\s*pretty_urls\s*=", match.group("body")):
            body = re.sub(
                r"(?m)^\s*pretty_urls\s*=.*$",
                "  pretty_urls = false",
                match.group("body"),
            )
            text = text[: match.start("body")] + body + text[match.end("body") :]

    marker = "# SEO: redirecionamento permanente da amostra"
    if marker not in text:
        block = """

# SEO: redirecionamento permanente da amostra
[[redirects]]
  from = "/app/amostra.html"
  to = "/app/cursos.html"
  status = 301
  force = true

[[redirects]]
  from = "/app/amostra"
  to = "/app/cursos.html"
  status = 301
  force = true
"""
        text = text.rstrip() + block + "\n"
    return text.rstrip() + "\n"


def build_redirects(urls: list[str]) -> str:
    rules = [
        "# Generated by tools/seo_indexing_maintenance.py",
        "# Keep .html as the single canonical URL format.",
        "/index.html  /  301!",
        "/app/amostra  /app/cursos.html  301!",
        "/app/amostra.html  /app/cursos.html  301!",
    ]
    seen = {"/index.html", "/app/amostra", "/app/amostra.html"}
    for url in urls:
        path = urlsplit(url).path
        if not path.endswith(".html") or path == "/app/amostra.html":
            continue
        sources = [path[:-5]]
        if path.endswith("/index.html"):
            parent = path[: -len("index.html")]
            sources.extend([parent, parent.rstrip("/")])
        for source in sources:
            if not source or source == path or source in seen:
                continue
            seen.add(source)
            rules.append(f"{source}  {path}  301!")
    return "\n".join(rules) + "\n"


def audit(urls: list[str], removed_amostra: bool) -> list[str]:
    problems: list[str] = []
    canonical_seen: dict[str, str] = {}
    groups: dict[tuple[str, tuple[str, ...]], dict[str, str]] = defaultdict(dict)
    for url in urls:
        identity = localized_identity(url)
        if identity:
            section, language, key = identity
            groups[(section, key)][language] = url

    for url in urls:
        path = url_to_file(url)
        if not path.exists():
            problems.append(f"arquivo ausente no sitemap: {url}")
            continue
        if path.suffix.lower() != ".html":
            continue
        text = read_text(path)
        canonicals = CANONICAL_RE.findall(text)
        canonical_urls = re.findall(
            r'<link\b(?=[^>]*\brel=["\']canonical["\'])[^>]*\bhref=["\']([^"\']+)["\']',
            text,
            re.I,
        )
        if len(canonical_urls) != 1:
            problems.append(f"canonical inválida ({len(canonical_urls)}): {url}")
        elif canonical_urls[0] != url:
            problems.append(f"canonical divergente: {url} -> {canonical_urls[0]}")
        elif canonical_urls[0] in canonical_seen and canonical_seen[canonical_urls[0]] != url:
            problems.append(f"canonical repetida: {url}")
        else:
            canonical_seen[canonical_urls[0]] = url

        identity = localized_identity(url)
        if identity:
            section, _, key = identity
            expected = groups[(section, key)]
            actual = dict(
                re.findall(
                    r'<link\b(?=[^>]*\brel=["\']alternate["\'])(?=[^>]*\bhreflang=["\']([^"\']+)["\'])[^>]*\bhref=["\']([^"\']+)["\']',
                    text,
                    re.I,
                )
            )
            for language, alternate_url in expected.items():
                if actual.get(language) != alternate_url:
                    problems.append(f"hreflang {language} ausente/divergente: {url}")
            default_url = expected.get("pt") or next(iter(expected.values()))
            if actual.get("x-default") != default_url:
                problems.append(f"hreflang x-default divergente: {url}")

    if AMOSTRA_URL in urls:
        problems.append("amostra.html ainda está no sitemap")
    if not removed_amostra:
        problems.append("amostra.html não foi removida do sitemap")
    return problems


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="grava as correções")
    args = parser.parse_args()

    original_sitemap = read_text(SITEMAP)
    original_urls = sitemap_urls(original_sitemap)

    removed_amostra = AMOSTRA_URL in original_urls
    updated_sitemap = URL_BLOCK_RE.sub(
        lambda match: "" if AMOSTRA_URL in match.group(0) else match.group(0),
        original_sitemap,
    )
    updated_sitemap = re.sub(r"\n{3,}", "\n", updated_sitemap)
    urls = sitemap_urls(updated_sitemap)

    groups: dict[tuple[str, tuple[str, ...]], dict[str, str]] = defaultdict(dict)
    for url in urls:
        identity = localized_identity(url)
        if identity:
            section, language, key = identity
            groups[(section, key)][language] = url

    aliases = build_alias_map(urls)
    changed_html = 0
    missing_files: list[str] = []
    processed_paths: set[Path] = set()

    for url in urls:
        path = url_to_file(url)
        if not path.exists():
            missing_files.append(url)
            continue
        if path.suffix.lower() != ".html":
            continue
        processed_paths.add(path.resolve())
        original = read_text(path)
        identity = localized_identity(url)
        alternates = None
        if identity:
            section, _, key = identity
            alternates = groups[(section, key)]
        updated = normalize_head(original, url, alternates)
        updated = rewrite_internal_hrefs(updated, url, aliases)
        if write_if_changed(path, original, updated, args.apply):
            changed_html += 1

    # Non-indexed/login/admin pages may still create crawlable links. Normalize
    # those hrefs too, without adding them to the sitemap or changing robots rules.
    for path in ROOT.rglob("*.html"):
        if path.resolve() in processed_paths or any(part in EXCLUDED_DIRS for part in path.parts):
            continue
        relative = path.relative_to(ROOT).as_posix()
        page_url = f"{BASE_URL}/{relative}"
        if relative == "index.html":
            page_url = f"{BASE_URL}/"
        original = read_text(path)
        updated = rewrite_internal_hrefs(original, page_url, aliases)
        if write_if_changed(path, original, updated, args.apply):
            changed_html += 1

    amostra_path = ROOT / "app" / "amostra.html"
    if amostra_path.exists():
        original = read_text(amostra_path)
        updated = add_noindex_to_amostra(original)
        if write_if_changed(amostra_path, original, updated, args.apply):
            changed_html += 1

    sitemap_changed = write_if_changed(SITEMAP, original_sitemap, updated_sitemap, args.apply)
    original_netlify = read_text(NETLIFY)
    updated_netlify = normalize_netlify(original_netlify)
    netlify_changed = write_if_changed(NETLIFY, original_netlify, updated_netlify, args.apply)

    redirects_text = build_redirects(urls)
    old_redirects = read_text(REDIRECTS) if REDIRECTS.exists() else ""
    redirects_changed = write_if_changed(REDIRECTS, old_redirects, redirects_text, args.apply)

    mode = "APPLY" if args.apply else "DRY-RUN"
    print(f"mode={mode}")
    print(f"sitemap_urls_before={len(original_urls)}")
    print(f"sitemap_urls_after={len(urls)}")
    print(f"html_files_changed={changed_html}")
    print(f"sitemap_changed={sitemap_changed}")
    print(f"netlify_changed={netlify_changed}")
    print(f"redirects_changed={redirects_changed}")
    print(f"redirect_rules={sum(1 for line in redirects_text.splitlines() if line and not line.startswith('#'))}")
    print(f"missing_files={len(missing_files)}")
    for url in missing_files[:20]:
        print(f"missing: {url}")

    if args.apply:
        final_urls = sitemap_urls(read_text(SITEMAP))
        problems = audit(final_urls, removed_amostra=AMOSTRA_URL not in final_urls)
        print(f"audit_problems={len(problems)}")
        for problem in problems[:100]:
            print(f"problem: {problem}")
        return 1 if problems or missing_files else 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
