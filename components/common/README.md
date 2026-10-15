# UI and style ownership

- `primitives.tsx`: page width, surfaces, responsive grids, form fields, native inputs, information lists and action sections.
- `screen-kit.tsx`: page header, breadcrumb navigation and notices.
- `ui/`: controls, badges, tabs, progress and dialogs. Each component owns its appearance and states through CSS Modules.
- `DialogBody`: the only scrolling body of a modal; headers and footers remain outside it.
- `app/globals.css`: tokens, resets, basic typography and the shared content-width utility.
- Screen styles: unique composition and positioning only. Shared components must not have their colors, fonts, padding, borders or heights overridden through screen selectors.

Use component props (`size`, `variant`, `width`, `density`, `balance`, `layout`) for supported differences. Add a reusable option when another screen needs the same difference. Keep a one-off composition local.

`npm test` checks types, control semantics, style ownership, case rules and the production build. Browser visual checks are still required for layout changes.
