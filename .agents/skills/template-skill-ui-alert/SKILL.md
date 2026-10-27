---
name: template-skill-ui-alert
description: Present queued native alerts and integrate translated error feedback.
---

# Alerts

Use `Alert` and `AlertHost` from `@components/ui`.
Source: [alert/](../../../src/components/ui/alert/).

- Mount one `AlertHost` above navigation after launch. Use
  [showAlert](../../../src/lib/alerts.ts) for application feedback.
- Supply required `variant` and `message`; variants are `error`, `success`,
  `warning` and `info`. Optional `title` overrides the translated heading.
- Alerts require the translated OK acknowledgment. Android also supports Back
  and outside dismissal. Preserve queue coalescing, pre-mount retention and
  stale-dismissal guards; do not add automatic dismissal timers.
- For local presentation, mount `Alert` while visible with `onDismiss`.
  It owns its Host and accepts an optional `colorScheme`. iOS requires the
  existing mounted `Alert.Trigger` anchor.
- Use [reportErrorAlert](../../../src/lib/error-alerts.ts) for auth-aware
  error translation and cancellation/session filtering. Keep persistent error
  and retry content in the owning screen.
- Keep native SwiftUI Alert / Compose AlertDialog presentation. Preserve
  `app-alert-message` and `app-alert-dismiss` selectors.

Verify acknowledgment, queued reopening, Android dismissal, long translated text
and screen-reader focus on iOS and Android. Static checks do not verify native
dialog behavior.
