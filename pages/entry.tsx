import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@/app/globals.css";
import { RouteScreen } from "@/components/route-screen";
import { Toaster } from "@/components/ui/sonner";
import { demoRedirectFor } from "@/lib/demo-routing";
import { replaceDemoRoute, usePathname } from "./next-navigation";

function DemoPagesApp() {
  const pathname = usePathname();
  const redirectTo = demoRedirectFor(pathname);
  const effectivePath = redirectTo ?? pathname;

  useEffect(() => {
    if (redirectTo) replaceDemoRoute(redirectTo);
  }, [redirectTo]);

  useEffect(() => {
    document.title = "집행나침반 | 데모";
    const hashQuery = window.location.hash.split("?").slice(1).join("?");
    const target = new URLSearchParams(hashQuery).get("__anchor");
    if (!target) return;
    const scroll = () => {
      const element = document.getElementById(target);
      if (!element) return false;
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    };
    if (scroll()) return;
    const observer = new MutationObserver(() => {
      if (scroll()) observer.disconnect();
    });
    observer.observe(document.getElementById("root")!, { subtree: true, childList: true });
    const timer = window.setTimeout(() => observer.disconnect(), 3000);
    return () => { observer.disconnect(); window.clearTimeout(timer); };
  }, [effectivePath]);

  return (
    <>
      <RouteScreen segments={effectivePath.split("/").filter(Boolean)} />
      <Toaster position="top-center" richColors />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<DemoPagesApp />);

// Preserve the skip-to-content behavior without changing the SPA hash route.
document.getElementById("skip-to-main")?.addEventListener("click", () => {
  const main = document.getElementById("main-content");
  if (!main) return;
  main.setAttribute("tabindex", "-1");
  main.focus();
});
