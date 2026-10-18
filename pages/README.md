# GitHub Pages demo (demo-pages branch)

This branch retains the original Next.js/Vinext application and styles. GitHub Pages uses a **separate static Vite entry point**, not the Cloudflare Worker.

- `npm ci`
- `npm run build:pages`
- Build output: `dist-pages/`
- Public URL after successful deployment: https://jhy-pj.github.io/projectMVP/
- Navigation uses `#/...` hash routes because GitHub Pages does not handle dynamic Next.js paths.
- All case/demo data remains in the visitor's browser `localStorage`, not the server.
- Account-only routes redirect to the demo. Backend Python chatbot and authentication are not offered by the static build.
- Changing `demo-pages` triggers `.github/workflows/demo-pages.yml`. The workflow builds and **replaces `gh-pages` with the compiled static files** only after a successful build.
- Keep `main` and `demo` untouched. Do not run the standard `npm run build` for Pages: it targets Vinext/Cloudflare.

Note: If GitHub Actions lacks permission to write the `gh-pages` branch, set repository Actions workflow permissions to Read and write. GitHub Pages Source should remain Deploy from a branch → gh-pages → /(root).

The static route adapters live exclusively under `pages/`, and the existing CSS files are imported unchanged.
