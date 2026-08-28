# ASDEV Personal Brand + Content Platform V3 Design System

This guide supplements the approved product specs. The specs and existing semantic design tokens remain authoritative.

## Direction

- Minimal technical editorial style with high contrast and generous whitespace.
- Personal identity first on Home; search first on Discover; task clarity first in Admin; reading clarity first on Blog.
- Preserve the existing local font and semantic color-token system. Do not add external font requests.
- Use Lucide consistently for interface icons. Do not use emoji as structural icons.
- Avoid glassmorphism, scroll-driven storytelling, decorative parallax, carousels, and heavyweight animation libraries.

## Layout

- Validate at 375, 768, 1024, and 1440 CSS pixels.
- Use mobile-first composition, bounded text measure, and a consistent 4/8px spacing rhythm.
- Keep body text at least 16px on mobile and prevent horizontal page overflow.
- Reserve media dimensions to prevent layout shift.

## Interaction

- Keep one primary action per screen or section; secondary actions must be visually subordinate.
- Use visible labels, visible focus states, semantic controls, and URL-backed navigation/filter state where specified.
- Interactive targets should be at least 44x44px where practical and never rely on hover alone.
- Use subtle opacity/color transitions only; respect `prefers-reduced-motion` and avoid layout-shifting animation.

## Accessibility

- Target WCAG 2.2 AA: normal text contrast at least 4.5:1, non-text UI contrast at least 3:1.
- Preserve one H1 per page, sequential headings, landmarks, keyboard order, and descriptive alternatives for meaningful images.
- Sticky UI must not fully obscure focused controls.
- Form errors remain inline and programmatically associated; multi-error forms also expose a focusable summary.
- Status must never be conveyed by color alone.

## Surface Rules

### Home

- Static/server-rendered two-column hero on desktop; portrait first on mobile.
- Exactly two dominant hero actions.
- Exactly three core services and at most three evidence-backed selected projects.

### Admin

- Desktop sidebar and accessible mobile navigation; active route is visible and announced.
- Tables convert to labeled stacked rows/cards when columns cannot fit.
- Destructive actions use an explicit accessible confirmation dialog.

### Discover

- Strong search affordance, compact filters, consistent media ratio, one internal primary card action.
- Featured resources are bounded and never presented as fake popularity.

### Blog

- Long-form reading measure stays approximately 60-75 characters on desktop.
- Code and tables remain operable on narrow screens without breaking page width.
- Raw HTML stays disabled in Markdown.

## Pre-delivery Checks

- Responsive widths: 375/768/1024/1440.
- Keyboard navigation and visible focus.
- Reduced-motion behavior.
- FA RTL and EN LTR text/layout.
- Light and dark contrast checked independently.
- No horizontal overflow, hidden focused controls, external font requests, fabricated proof, or unapproved portrait media.
