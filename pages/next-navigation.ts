import { useSyncExternalStore } from "react";

// Hash routes work on GitHub Pages even for browser refreshes and locally created case IDs.
const routeFromLocation = () => {
  if (typeof window === "undefined") return "/";
  const raw = window.location.hash.slice(1) || "/";
  const pathname = raw.split("?")[0];
  return pathname.startsWith("/") ? pathname : "/";
};

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}

export function usePathname() {
  return useSyncExternalStore(subscribe, routeFromLocation, () => "/");
}

export function pagesHref(href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const hashIndex = href.indexOf("#");
  if (hashIndex < 0) return `#${href}`;
  const path = href.slice(0, hashIndex);
  const anchor = href.slice(hashIndex + 1);
  return `#${path}${path.includes("?") ? "&" : "?"}__anchor=${encodeURIComponent(anchor)}`;
}

function navigate(href: string, replace = false) {
  const url = pagesHref(href);
  if (!url.startsWith("#/")) {
    window.location.assign(url);
    return;
  }
  if (replace) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${url}`);
    window.dispatchEvent(new Event("hashchange"));
  } else {
    window.location.hash = url;
  }
}

export function replaceDemoRoute(href: string) {
  navigate(href, true);
}

export function useRouter() {
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, true),
    back: () => window.history.back(),
    refresh: () => window.dispatchEvent(new Event("hashchange")),
    forward: () => window.history.forward(),
    prefetch: async (_href: string) => undefined,
  };
}

export function useSearchParams() {
  usePathname();
  if (typeof window === "undefined") return new URLSearchParams();
  const raw = window.location.hash.slice(1);
  return new URLSearchParams(raw.includes("?") ? raw.split("?").slice(1).join("?") : window.location.search);
}

// The entry point resolves demo redirects before RouteScreen renders.
export function redirect(href: string): never {
  navigate(href, true);
  return undefined as never;
}
