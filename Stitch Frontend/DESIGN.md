---
name: Kinetic Telemetry
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#2fd9f4'
  on-tertiary: '#00363e'
  tertiary-container: '#00b7cf'
  on-tertiary-container: '#00434d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#a2eeff'
  tertiary-fixed-dim: '#2fd9f4'
  on-tertiary-fixed: '#001f25'
  on-tertiary-fixed-variant: '#004e5a'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.01em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: '0'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-xs:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 0.75rem
  gutter-mobile: 0.5rem
  margin: 1.5rem
  margin-tablet: 1rem
  margin-mobile: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a high-density, command-center aesthetic tailored for engineering leadership, system architects, and staff engineers navigating complex topological codebases. The tone is utilitarian, precise, and hyper-focused—evoking the confidence of mission-critical developer infrastructure like low-level observability consoles, high-end IDEs, and topological compute engines.

The design movement synthesizes **Technical Minimalism** with **Instrument Glassmorphism**:
- Ultra-dark, layered graphite canvases that reduce optical fatigue during intensive code & architecture exploration.
- Sub-pixel hairline boundaries (`rgba(255, 255, 255, 0.08)`) and high-density information architecture.
- Luminescent data channels—utilizing electric cyan and energetic violet to signify active node dependencies, distributed tracing routes, and topological relationships without visual clutter.
- Utilitarian telemetry surfaces prioritizing fast scanning, semantic state clarity, and keyboard-first accessibility.

## Colors

The color system functions on a layered dark scale to create spatial stratification for microservices, entity nodes, and call-graphs.

### Palette Mechanics
- **Base Canvas (`#0B0F17`):** The foundational viewport floor. Keeps OLED screens power-efficient and high-contrast.
- **Surface Elevation 1 (`#0F172A`):** Navbars, side docks, and contextual graph canvases.
- **Surface Elevation 2 (`#111827` / `#1E293B`):** Floating inspector panels, flyouts, contextual entity sheets, and metadata cards.
- **Primary Accent (`#06B6D4` / `#22D3EE`):** Electric Cyan. Designates ingress points, active selected nodes, positive call flows, and primary navigational states.
- **Secondary Accent (`#8B5CF6` / `#A855F7`):** Deep to Radiant Violet. Designates downstream dependencies, asynchronous workers, schema mutations, and message buses.
- **Neutral Boundaries (`#334155` and `rgba(255, 255, 255, 0.08)`):** Structural hairline separators maintaining structure without stark, distracting lines.
- **Typography Matrix:** 
  - Pure High-Contrast White (`#F8FAFC`) for structural labels and headers.
  - Slate Muted (`#94A3B8`) for body metrics, schema types, and descriptors.
  - Darkened Slate (`#64748B`) for disabled states, structural glyphs, and line numbers.

## Typography

The typography strategy couples high-performance sans-serifs with an analytical monospace foundation.

- **Geist (Display & Headings):** Provides geometric crispness and tight tracking, suited for high-density dashboards, graph inspector heads, and modal titles.
- **Inter (Body Text & Documentation):** Deployed for descriptions, multi-line architectural decision records (ADRs), and pull-request synthesis.
- **JetBrains Mono (Metadata, Nodes, Badges & Code Snippets):** Renders micro-tags, cryptographic commit hashes, node coordinates, schema definitions, and system metrics.

Tracking is deliberately tightened on display tiers for a compact, engineered stance, while monospace labels use positive tracking to maximize glanceability at micro sizes (10–12px).

## Layout & Spacing

This design system uses a strict **8pt / 4pt sub-grid system** optimized for high-density technical workspaces, split pane IDE layouts, and infinite node-graph canvases.

### Canvas & Structural Layout
- **The Graph Canvas:** Full-bleed fluid viewport (`100vw`, `100vh`) overlaid with docked telemetry sidebars, an omnipresent top command bar, and floating context-sensitive mini-maps.
- **Data Workspaces:** Multi-column dashboard layouts using a fluid 12-column grid with compact `1rem` gutters to pack technical metrics efficiently.
- **Breakpoints:**
  - `Desktop (>= 1280px)`: Simultaneous graph canvas, multi-level lineage tree, and full 420px inspector drawer.
  - `Laptop / Tablet Landscape (768px - 1279px)`: Collapsible left navigation dock into an icon rail; inspector drawer transitions to an overlay sheet.
  - `Mobile (< 768px)`: Stacked linear flow with switchable view tabs (Graph View, Inspector, Query Console) and docked command triggers.

## Elevation & Depth

Depth is established via **Tonal Stratification and Luminescent Outlines**, eliminating heavy muddy drop shadows in favor of precise contrast boundaries.

### Elevation Levels
- **Floor (Canvas Space - Level 0):** `#0B0F17`. The deep infinite void where graph vectors, dependency lines, and background grid dots (`rgba(255, 255, 255, 0.04)`) live.
- **Surface Level 1 (Docked Containers & Toolbars):** `#0F172A` with a 1px bottom/right border of `rgba(255, 255, 255, 0.06)`.
- **Surface Level 2 (Cards & Graph Node Shells):** `#111827` backdrop with a structural border of `rgba(255, 255, 255, 0.08)`. Hovering transitions the border to `rgba(6, 182, 212, 0.4)` accompanied by a subtle 12px outer glow (`rgba(6, 182, 212, 0.12)`).
- **Surface Level 3 (Inspector Drawers, Modals & Floating Menus):** `#1E293B` combined with `backdrop-filter: blur(16px)` and a directional top rim-light border of `rgba(255, 255, 255, 0.12)`.
- **Topological Edge Glows:** Graph connection lines utilize dynamic SVG dropshadow filters (`feDropShadow` / `box-shadow: 0 0 8px rgba(6, 182, 212, 0.5)`) indicating data flow volume and throughput velocity.

## Shapes

The design system uses a disciplined, tight **Soft geometry (0.25rem / 4px base)** to retain an engineered, low-latency instrumentation appearance.

- **Base Components (Inputs, Buttons, Badges):** `rounded` (4px). Clean, precise, and compact.
- **Containers, Panels & Cards:** `rounded-lg` (8px). Delivers subtle visual relief while maximizing usable pixel area.
- **Floating Modals & Command Palettes:** `rounded-xl` (12px). Softens dominant overlays over the angular graph scene.
- **Graph Nodes:** Hexagonal or 6px rounded rects with 1px internal bounding strokes to maintain terminal-like sharpness.

## Components

### Buttons
- **Primary:** Electric cyan background (`#06B6D4`), solid black text (`#020617`), font weight `500` (Inter), border-radius `4px`. Subtle `box-shadow: 0 0 16px rgba(6, 182, 212, 0.35)` on hover.
- **Secondary / Outline:** Background `rgba(255, 255, 255, 0.03)`, 1px border `rgba(255, 255, 255, 0.12)`, text `#F8FAFC`. On hover: border `#06B6D4`, text `#22D3EE`, background `rgba(6, 182, 212, 0.05)`.
- **Ghost / Tool Action:** No border, text `#94A3B8`. On hover: background `rgba(255, 255, 255, 0.06)`, text `#F8FAFC`.

### Chips & Micro-Badges
- Micro-tags built with `JetBrains Mono` at `10px` or `11px`.
- **Service Node Badge:** Dark base (`rgba(6, 182, 212, 0.1)`), 1px solid border (`rgba(6, 182, 212, 0.3)`), text `#22D3EE`, uppercase with `0.05em` letter-spacing.
- **Mutation / Async Queue Badge:** Dark violet base (`rgba(139, 92, 246, 0.1)`), border (`rgba(139, 92, 246, 0.3)`), text `#A855F7`.

### Inputs & Command Bars
- **Command Palette (`Cmd+K`):** Floating centered overlay, background `#0F172A` with `80%` opacity and `20px` backdrop-blur. 1px border `rgba(255, 255, 255, 0.15)`.
- **Field Inputs:** Height `32px` (compact) or `36px`, background `#0B0F17`, border `1px solid rgba(255, 255, 255, 0.1)`. Focus state: border `#06B6D4`, outline none, subtle ambient cyan focus ring (`0 0 0 1px #06B6D4`). Font: `JetBrains Mono` for queries, regex, and identifiers.

### Lists & Tree Views
- Nested dependency trees feature 1px guide lines (`#1E293B`).
- List items have zero horizontal margin, padding `6px 10px`, hover background `rgba(255, 255, 255, 0.04)`.
- Active selected entity receives a solid left accent border indicator (2px wide, `#06B6D4`) and background `rgba(6, 182, 212, 0.08)`.

### Cards & Inspector Panels
- Header block: 1px bottom border `rgba(255, 255, 255, 0.06)`, padding `12px 16px`. Title in `Geist` (`14px`, weight `600`).
- Body: Slate-900 surface (`#111827`) with dark graphite gradation down to `#0F172A`.

### Graph Nodes & Connectors (Domain Specific)
- **Node Shell:** Rounded 6px container, background `#111827`, border `1px solid #334155`. Displays service icon, name in `Geist Medium`, and language/framework badge in `JetBrains Mono`.
- **Status Indicator:** 6px glowing dot: Cyan for Healthy/Active, Amber for Degraded, Rose for Breaking Changes.
- **Edges / Connectors:** SVG Bezier curves with stroke-width `1.5px`. Inactive: `#334155`; Selected/Active: `#06B6D4` with animated pulse dashes for live traffic emulation.