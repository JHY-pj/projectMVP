# UI and style ownership

- `primitives.tsx`: page width, surfaces, responsive grids, form fields, native inputs, information lists and action sections.
- `screen-kit.tsx`: page header, breadcrumb navigation and notices.
- `ui/`: controls, badges, tabs, progress and dialogs. Each component owns its appearance and states through CSS Modules.
- `DialogBody`: the only scrolling body of a modal; headers and footers remain outside it.
- `app/globals.css`: tokens, resets, basic typography and the shared content-width utility.
- Screen styles: unique composition and positioning only. Shared components must not have their colors, fonts, padding, borders or heights overridden through screen selectors.

Use component props (`size`, `variant`, `width`, `density`, `balance`, `layout`) for supported differences. Add a reusable option when another screen needs the same difference. Keep a one-off composition local.

`npm test` checks types, control semantics, style ownership, case rules and the production build. Browser visual checks are still required for layout changes.

## Completed ownership migration

Screen composition files no longer import global screen CSS. Every component stylesheet is a CSS Module, imported by its owner. Shared appearance is not overridden from feature selectors.

| Owner | Responsibility |
| --- | --- |
| `common/primitives` | Page/panel geometry, top spacing, fields, input/action alignment, checkbox rows and action sections |
| `common/selection-card` | Radio/checkbox card geometry, selected and focus states |
| `common/summary-chips` | Compact summary labels and values |
| `common/step-progress` | Step labels, active/completed states and responsive connectors |
| `common/icon-tile` | Status icon size, circle and tone |
| `common/search-input` | Search icon placement; delegates input appearance to `Input` |
| `shell/shell-ui` | Brand, active links, mobile menu, bottom navigation and footer |
| `member/case-ui`, `member/case-list-card` | Case card composition, wizard sections, report/checklist, records and settings parts |
| `public/home-sections`, `public/public-ui` | Home sections and public-page composition |
| `auth/auth-ui` | Auth composition, password action placement and consent rows |
| `admin/admin-ui` | Queue metrics, review workspace and document placeholder |
| `support/chat-ui` | Chat panel, role/loading states, message viewport and composer |
| `legal/legal-ui` | Legal section numbering and consent warning |

Feature parts use `styledPart` to preserve the original native element, ref, form events and ARIA attributes. Stateful shared controls use props (`selected`, `active`, message `role`, step `current`), rather than page-authored state class recipes. A CSS class without any declarations was removed rather than retained as a misleading styling hook. DOM behaviour uses stable data attributes; animation utilities remain global.

### Deliberate feature-specific styling

- Home compass, orbits and decorative shapes are an illustration, so their geometry remains in `public-ui.module.css`.
- Case list columns, wizard sections and record layouts describe those features' content, so they remain in `case-ui.module.css`.
- Chat bubble tails and scrolling message heights are chat-specific, so they remain in `chat-ui.module.css`.
- Auth aside and admin document-preview geometry remain with those feature parts.
- There is no remaining page CSS exception file. Future exceptions must be documented here and must not override shared controls.

### Verification limits

`test:styles` rejects global component stylesheets, missing part styles, shared-control appearance overrides, unmanaged radii, empty selectors and baseline rules placed after responsive rules. It renders actual feature parts to check native semantics and active/selected/message states. `test:rules` renders report/plan integration using the actual case parts. These checks do not replace browser checks for visual appearance or pointer/keyboard interaction.
