---
name: foodiya-performance
description: Diagnose and improve Foodiya native startup, scrolling, animation and idle resource usage with repeatable measurements. Use for performance changes, lag investigations and regression checks.
---

# Foodiya performance

Apply performance changes through [Foodiya implementation](../foodiya-implementation/SKILL.md).
Use the [performance guide](../../../docs/performance.md) for scenarios, measurement
definitions and the results template. Component contracts remain in the
[component skills](../foodiya-implementation/references/component-skills.md).

## Establish the problem

- Inspect the current routes, data size, native adapters and installed SDK. Older
  reports describe retired features and test suites; they are leads, not evidence
  of a current bottleneck.
- State the affected interaction and a reproducible device/data scenario. Separate
  a static code risk, synthetic stress result and measured production regression.
- Compare release builds on the same device, build configuration and dataset.
  Record startup phases, interaction latency, JS/native frame work and memory as
  relevant. Development re-render highlighting locates work but does not establish
  its user-visible cost.

## Choose the smallest useful change

- **Startup:** distinguish font/preference/session readiness, initial native layout,
  configured launch presentation and actual interactivity. Use the installed
  `expo-observe` API and the matching `eas-observe` guidance for metrics. Keep
  recovery reachable, preserve session ownership, and measure both startup and
  first-use cost when deferring work.
- **Motion and idle work:** inspect retained page-local blur/mask consumers as well
  as the shared clock. React freezing alone does not establish native animation
  inactivity. Preserve the shared motion/AppState guards and check focus,
  background/resume, reduced motion and native Back before changing lifecycles.
- **Collections:** inspect actual row count and geometry. The native grouped List
  and bounded Table have different jobs from a virtualized feature feed. Use one
  scrolling owner for a feed and benchmark native Host/cell costs. Read the List,
  Table and Page contracts before changing composition.
- **Updates and data:** profile narrow subscriptions and expensive derived work.
  Preserve equal-auth-snapshot suppression, request cancellation, session guards,
  exact query refresh and bounded pagination. Add memoization or split a context
  when the affected work justifies it.
- **Media:** measure request size, decoding, cache behavior and retained memory on
  the actual feature. Use display-sized previews and stable layout where useful.
  Synthetic image fixtures do not establish live network behavior.

Keep configured branding, native UI ownership, RTL, safe areas and accessibility
through each change. Performance work does not imply a redesign, state-management
rewrite, SDK upgrade or new dependency.

## Verify and record

Use the existing native preview workflow for deterministic stress cases. Run the
current project checks; do not restore a retired test runner. Keep a change when
its benefit is repeatable and the relevant product states still work. If device
measurement is unavailable, complete authorized instrumentation and static checks,
then report native verification as pending rather than claiming faster frames.

Record device/build/data conditions and before/after evidence using the guide's
template. Update an existing component skill only if its contract changes; keep
historical measurements separate from the reusable workflow.
