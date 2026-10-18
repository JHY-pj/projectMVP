import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const file = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  base: "/projectMVP/",
  plugins: [react()],
  resolve: {
    alias: [
      { find: "next/link", replacement: file("./pages/next-link.tsx") },
      { find: "next/navigation", replacement: file("./pages/next-navigation.ts") },
      { find: "@", replacement: file("./") },
    ],
  },
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
    target: "es2022",
  },
});
