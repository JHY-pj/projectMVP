"""Real Chromium smoke/a11y-layout checks of the GitHub Pages static build."""
import json
import os
import re
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:4173/projectMVP/"
OUT = Path(".pages-audit")
SHOTS = OUT / "screenshots"
SHOTS.mkdir(parents=True, exist_ok=True)

ROUTES = [
    ("home", ""),
    ("about", "#/about"),
    ("guide", "#/guide"),
    ("faq", "#/faq"),
    ("support", "#/support"),
    ("dashboard", "#/app"),
    ("cases", "#/app/cases"),
    ("new-case", "#/app/cases/new"),
    ("case-summary", "#/app/cases/demo-2026"),
    ("report", "#/app/cases/demo-2026/report"),
    ("plan", "#/app/cases/demo-2026/plan"),
    ("status", "#/app/cases/demo-2026/status"),
    ("result", "#/app/cases/demo-2026/result"),
    ("data", "#/app/cases/demo-2026/data"),
]
SCREENSHOT_ROUTES = {"home", "cases", "new-case", "case-summary", "report", "plan", "support"}
results = []
problems = []
page_errors = []


def problem(level, label, detail):
    item = {"level": level, "test": label, "detail": str(detail)}
    problems.append(item)
    print(f"[{level.upper()}] {label}: {detail}", flush=True)


def expect(cond, label, detail):
    if not cond:
        problem("error", label, detail)
    return bool(cond)


def audit_pages(browser, name, viewport, is_mobile):
    context = browser.new_context(viewport=viewport, device_scale_factor=1,
                                  is_mobile=is_mobile, has_touch=is_mobile,
                                  reduced_motion="reduce")
    page = context.new_page()
    console_errors = []
    failed_requests = []
    page.on("pageerror", lambda err: page_errors.append({"device": name, "message": str(err)}))
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
    page.on("requestfailed", lambda request: failed_requests.append(request.url))

    for label, route in ROUTES:
        key = f"{name}/{label}"
        try:
            response = page.goto(BASE + route, wait_until="domcontentloaded", timeout=25000)
            page.wait_for_timeout(550)
            info = page.evaluate("""() => {
              const main = document.querySelector('#main-content');
              const h1 = document.querySelector('h1');
              const root = document.getElementById('root');
              const doc = document.documentElement;
              const footer = document.querySelector('footer');
              const nav = document.querySelector('nav');
              const css = getComputedStyle(document.body);
              return {
                title: document.title,
                url: location.href,
                h1: h1?.innerText || '',
                main: !!main,
                mainHeight: main?.getBoundingClientRect().height || 0,
                rootChildren: root?.children.length || 0,
                viewportWidth: innerWidth,
                documentWidth: doc.scrollWidth,
                bodyBackground: css.backgroundColor,
                footer: !!footer,
                nav: !!nav,
                staticJs: !!document.querySelector('script[type=module]'),
                screenText: (main?.innerText || '').slice(0, 320),
              };
            }""")
            results.append({"test": key, "status": response.status if response else None, **info})
            expect(info["main"], key, "No #main-content.")
            expect(info["mainHeight"] > 4, key, "Main content has zero/near-zero height.")
            expect(info["rootChildren"] > 0, key, "React app did not render.")
            expect(info["footer"], key, "Footer missing.")
            expect("페이지를 찾을 수 없습니다" not in info["screenText"], key, "Route produced not-found screen.")
            if info["documentWidth"] > viewport["width"] + 3:
                problem("error", key + "/overflow", f"Body width {info['documentWidth']} > viewport {viewport['width']}")
            if label in SCREENSHOT_ROUTES:
                page.screenshot(path=str(SHOTS / f"{name}-{label}.png"), full_page=True, animations="disabled")
            print(f"[PAGE] {key} h1={info['h1'][:60]!r} body={info['documentWidth']}/{viewport['width']}", flush=True)
        except Exception as err:
            problem("error", key, str(err).splitlines()[0])
            try:
                page.screenshot(path=str(SHOTS / f"{name}-{label}-error.png"), full_page=True)
            except Exception:
                pass

    # A user's existing demo case must load after a refresh, and tabs must navigate.
    try:
        page.goto(BASE + "#/app/cases/demo-2026", wait_until="domcontentloaded")
        page.get_by_role("tab", name="리포트").click(timeout=6000)
        page.wait_for_timeout(300)
        expect("#/app/cases/demo-2026/report" in page.url, name + "/tab-click", f"Unexpected URL {page.url}")
        page.reload(wait_until="domcontentloaded")
        page.wait_for_timeout(250)
        selected = page.get_by_role("tab", name="리포트").get_attribute("aria-selected")
        expect(selected == "true", name + "/tab-refresh", f"aria-selected={selected}")
        print(f"[FLOW] {name}/tab-click-and-refresh selected={selected}", flush=True)
    except Exception as err:
        problem("error", name + "/tab-navigation", str(err).splitlines()[0])

    # Wizard -> localStorage -> generated route -> direct reload.
    try:
        page.goto(BASE + "#/app/cases/new", wait_until="domcontentloaded")
        for step in range(3):
            page.get_by_role("button", name=re.compile("다음")).click(timeout=6000)
        page.get_by_role("button", name=re.compile("등록 완료")).click(timeout=6000)
        page.wait_for_timeout(350)
        cases = page.evaluate("""() => JSON.parse(localStorage.getItem('mvp-case-drafts') || '[]')""")
        expect(len(cases) > 0, name + "/wizard-storage", "No saved case in localStorage")
        expect("#/app/cases/LOCAL-" in page.url, name + "/wizard-route", f"Unexpected URL: {page.url}")
        page.reload(wait_until="domcontentloaded")
        page.wait_for_timeout(300)
        expect(page.get_by_text("등록되지 않은 사건입니다").count() == 0,
               name + "/wizard-refresh", "Created case missing after refresh")
        print(f"[FLOW] {name}/wizard saved={len(cases)}, url={page.url}", flush=True)
        page.screenshot(path=str(SHOTS / f"{name}-new-case-report.png"), full_page=True)
    except Exception as err:
        problem("error", name + "/wizard", str(err).splitlines()[0])

    if is_mobile:
        try:
            page.goto(BASE, wait_until="domcontentloaded")
            menu = page.locator("[data-mobile-menu]")
            menu.locator("summary").click(timeout=6000)
            expect(menu.get_attribute("open") is not None, "mobile/menu-open", "Mobile menu did not open.")
            page.get_by_role("link", name="집행나침반 홈").first.click(timeout=6000)
            page.wait_for_timeout(100)
            expect(menu.get_attribute("open") is None, "mobile/menu-close", "Mobile menu remained open after outside click.")
            print("[FLOW] mobile/menu-toggle OK", flush=True)
        except Exception as err:
            problem("error", "mobile/menu-toggle", str(err).splitlines()[0])

    # On GitHub Pages no chatbot backend exists; the message must be explicit.
    try:
        page.goto(BASE + "#/support", wait_until="domcontentloaded")
        expect(page.get_by_text("상담 서버 미연결").count() > 0,
               name + "/support-backend-status", "Chatbot appears online without a backend.")
    except Exception as err:
        problem("error", name + "/support-backend-status", str(err).splitlines()[0])

    for message in sorted(set(console_errors)):
        problem("error", name + "/browser-console", message)
    for url in sorted(set(failed_requests)):
        problem("warning", name + "/request-failed", url)
    context.close()


def main():
    OUT.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        try:
            audit_pages(browser, "desktop", {"width": 1440, "height": 900}, False)
            audit_pages(browser, "mobile", {"width": 390, "height": 844}, True)
        finally:
            browser.close()

    for err in page_errors:
        problem("error", err["device"] + "/javascript", err["message"])
    report = {
        "base_url": BASE, "date_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "pages": results, "problems": problems,
        "errors": len([x for x in problems if x["level"] == "error"]),
        "warnings": len([x for x in problems if x["level"] == "warning"]),
    }
    (OUT / "audit.json").write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(f"[SUMMARY] pages={len(results)} errors={report['errors']} warnings={report['warnings']}", flush=True)
    sys.exit(1 if report["errors"] else 0)


if __name__ == "__main__":
    main()
