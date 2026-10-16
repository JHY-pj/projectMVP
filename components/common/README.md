# UI and style ownership

- `primitives.tsx`: page width, surfaces, responsive grids, form fields, native inputs, information lists and action sections.
- `screen-kit.tsx`: page header, breadcrumb navigation and notices.
- `ui/`: controls, badges, tabs, progress and dialogs. Each component owns its appearance and states through CSS Modules.
- `DialogBody`: the only scrolling body of a modal; headers and footers remain outside it.
- `app/globals.css`: tokens, resets, basic typography and the shared content-width utility.
- Screen styles: unique composition and positioning only. Shared components must not have their colors, fonts, padding, borders or heights overridden through screen selectors.

Use component props (`size`, `variant`, `width`, `density`, `balance`, `layout`) for supported differences. Add a reusable option when another screen needs the same difference. Keep a one-off composition local.

`npm test` checks types, control semantics, style ownership, case rules and the production build. Browser visual checks are still required for layout changes.

## Component ownership

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

Feature parts are exported render functions that reference their CSS Module inside the function. Do not export factory-generated components with module classes captured at module scope: the development server omitted those stylesheets from server-rendered routes. Native elements, refs, form events and ARIA attributes remain forwarded. Stateful shared controls use props (`selected`, `active`, message `role`, step `current`), rather than page-authored state class recipes. A CSS class without any declarations was removed rather than retained as a misleading styling hook. DOM behaviour uses stable data attributes; animation utilities remain global.

### Deliberate feature-specific styling

- Home compass, orbits and decorative shapes are an illustration, so their geometry remains in `public-ui.module.css`.
- Case list columns, wizard sections and record layouts describe those features' content, so they remain in `case-ui.module.css`.
- Chat bubble tails and scrolling message heights are chat-specific, so they remain in `chat-ui.module.css`.
- Auth aside and admin document-preview geometry remain with those feature parts.
- There is no remaining page CSS exception file. Future exceptions must be documented here and must not override shared controls.

### Verification limits

`test:styles` rejects global component stylesheets, missing part styles, shared-control appearance overrides, unmanaged radii, empty selectors and baseline rules placed after responsive rules. It renders actual feature parts to check native semantics and active/selected/message states. `test:rules` renders report/plan integration using the actual case parts. These checks do not replace browser checks for visual appearance or pointer/keyboard interaction.


## Additional repeated UI ownership

| Component | Replaces |
| --- | --- |
| `InfoRow` | Label/value rows in registration review, case summary and data management |
| `SummaryChip` | Case counts by status |
| `IconListItem` | Check-icon lists in public pages, auth and eligibility (default/inverse/boxed) |
| `MetricCard` | Admin queue and outcome metrics |
| `ActivityEntry` | Recent records and progress history entries |
| `SettingRow`, `ConsentHistoryRow`, `NotificationCard` | Repeated settings, consent and notification structures |
| `ProcessCard`, `PrivacyItem`, `GuideStep`, `SecurityCheck` | Repeated content cards and feature list rows |

Text-only lists, table cell contents and form labels remain ordinary content inside their shared list/table/field components. Unique compass geometry, wizard compositions and record editor layouts remain feature-owned. Reuse is determined by behavior and visual responsibility, not merely the presence of a `div` or `span`.

## Verification performed in this pass

- `npm test`: lint, types, control checks, style ownership, assessment/view integration, production build and HTTP stylesheet delivery.
- `test:style-delivery` starts the development server and checks 19 public/demo routes. Every scoped class in the returned HTML must exist in a stylesheet served with HTTP 200 and a CSS content type.
- Case detail pages initially render a loading state; the HTTP test additionally checks delivery of the CSS needed by the later detail/form/modal views. It does not execute hydration or interact with those views.
- Auth, account settings, notifications and admin screens are not exposed by this demo router. Their authored components are included in source/type checks; this pass does not claim live route or browser coverage for them.
- PC/mobile visual appearance, tab gestures, focus interaction and hydrated modal scrolling still require a browser. HTTP and CSS checks are not a substitute for that verification.
