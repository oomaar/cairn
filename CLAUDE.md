# CAIRN — Project Constitution

Before generating any code, architecture, components, pages, routes, data structures, or designs, follow these rules.

These rules are project constraints.

---

# Source of Truth

The approved Cairn wireframes already exist locally and must be treated as the primary product reference.

Wireframes location:

/Users/omar/Projects/cairn/travel

Before implementing any screen:

- Review the relevant wireframes.
- Preserve the workflows, information hierarchy, and product intent.
- Do not redesign screens unless explicitly requested.
- Do not invent alternative layouts when the wireframe already defines the experience.
- If implementation details are unclear, infer them from the surrounding wireframes before introducing new UX patterns.

The goal is implementation, not redesign.

---

# Product Goal

Cairn is an expedition operations platform.

It is not a travel booking app.

It is not an admin dashboard.

It is not a CRUD showcase.

The primary goal is to create software that feels alive.

Users should feel that real expeditions are being planned, operated, and documented through the system.

Every feature should support:

- planning
- coordination
- navigation
- operations
- decision making

Avoid features that only display data without supporting a workflow.

---

# Engineering Goal

Code quality is a first-class feature.

Optimize for maintainability and clarity.

Assume this project will eventually contain dozens of screens and hundreds of components.

The architecture must remain easy to navigate as the project grows.

---

# Technology Constraints

Framework:

- Next.js App Router

Language:

- TypeScript strict mode

Styling:

- Tailwind CSS only

Allowed:

- Tailwind utility classes
- clsx
- cva

Forbidden:

- inline styles
- style={{}}
- CSS modules
- custom CSS files
- SCSS
- styled-components
- emotion

All styling must be implemented through Tailwind.

---

# Component Architecture

Large files are forbidden.

Pages should act as orchestration layers only.

Pages compose components.

Pages should not contain large UI trees.

If a page becomes visually complex:

Extract components immediately.

Bad:

- 500+ line page files
- dialogs inside pages
- tables inside pages
- filters inside pages
- forms inside pages

Good:

page.tsx

- DashboardHeader
- RouteSummary
- WeatherBanner
- ExpeditionTimeline
- RiskPanel
- ActivityFeed

Each component in its own file.

---

# File Organization

Use feature-based architecture.

Examples:

src/features/expeditions
src/features/routes
src/features/live-operations
src/features/weather
src/features/participants
src/features/risk-center
src/features/logbook

Each feature owns:

- components
- hooks
- types
- utils
- constants

Avoid giant shared folders.

---

# Types

Do not declare large interfaces inside components.

Create dedicated type files.

Examples:

- expedition.types.ts
- route.types.ts
- participant.types.ts

---

# Utilities

Utility functions must live outside components.

Examples:

- formatting
- grouping
- sorting
- calculations
- transformations

Use dedicated utility files.

---

# Constants

Avoid magic values.

Statuses, labels, limits, configuration, and mappings belong in constants files.

---

# SOLID Principles

Apply SOLID principles whenever reasonable.

Particularly:

Single Responsibility Principle

Each component should have one reason to change.

Avoid components that simultaneously:

- fetch data
- transform data
- render UI
- manage forms
- manage dialogs
- manage tables

Split responsibilities.

---

# Reusability

Create reusable primitives.

Examples:

- SectionHeader
- StatCard
- StatusBadge
- EmptyState
- MetricCard
- ActivityFeed
- RiskIndicator
- TimelineSection

Avoid duplicated implementations.

---

# Fake Database Philosophy

The fake-db is a simulated operational universe.

It is not a collection of mock arrays.

Data must be relational.

Examples:

- Expeditions
- Routes
- Checkpoints
- Participants
- Equipment
- Weather Alerts
- Incidents
- Logs
- Risk Assessments

must reference one another.

Navigation across the product should reveal consistent data relationships.

If a participant belongs to an expedition:

That participant should also appear in:

- assignments
- route manifests
- equipment manifests
- notifications
- incident reports
- expedition logs

The fake-db should feel like a real backend.

Not isolated fixtures.

---

# Deterministic Data

Use seeded generators.

The same build should produce the same operational universe.

This improves:

- debugging
- screenshots
- reproducibility
- consistency

---

# Product Experience

Avoid dashboard syndrome.

The goal is operational experiences.

Examples:

Route Planning
→ planning a real expedition

Live Operations
→ running an active expedition

Risk Center
→ evaluating evolving risks

Logbook
→ reviewing expedition history

The goal is not displaying information.

The goal is helping users make decisions.

---

# Interaction Philosophy

The platform should feel alive.

Examples:

- weather warnings
- route progression
- participant movement
- expedition updates
- incident reports
- equipment assignments
- operational notifications

The world should feel active even when the user is not interacting with it.

---

# Design Philosophy

Function before decoration.

Avoid trend-driven UI.

Avoid visual effects without purpose.

Every visual decision should support:

- awareness
- planning
- coordination
- navigation
- operations

---

# Final Rule

Before implementing anything ask:

"Does this make Cairn feel more like a real expedition platform?"

If not, reconsider the implementation.
