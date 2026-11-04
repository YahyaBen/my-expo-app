---
name: template-skill-ui-date-time-picker
description: Compose controlled native date and time fields with inherited themes and selection bounds.
---

# Date and time picker

Import `DateTimePicker` from `@components/ui` inside an existing Host.
Source: [date-time-picker/](../../../src/components/ui/date-time-picker/).

- The caller owns a valid `Date` through `value` and `onValueChange`. Labels,
  helper/error text and optional locale come from the caller. No form, storage,
  navigation or network work belongs in this component.
- Modes are `date` (default), `time` and `datetime`. Date changes preserve local
  time; time changes preserve the local calendar day. Callbacks receive new Date
  objects and skip unchanged values. Do not mutate the supplied value.
- `minimumDate` and `maximumDate` include whole local days in date mode, constrain
  exact instants in datetime mode and are ignored in time mode. Datetime selections
  are clamped to the interval, including edits to time on a boundary date. Keep
  the controlled value within the interval; invalid dates/reversed bounds throw.
- iOS uses a compact SwiftUI picker; Android provides separate Material date/time
  dialogs. Each Android confirmation commits that part; cancellation commits
  nothing. Only presentation state lives in the Android adapter.
- Preserve Android's local-day to UTC-calendar conversion in both directions.
  Material calendar timestamps are UTC days, not local-midnight instants.
- Reuse the owning Host's scheme, tint and Material colors. Do not add another
  Host, palette or theme provider. Error text takes priority over helper text.
- `disabled` guards callbacks and closes an Android dialog. `is24Hour` defaults
  to true on Android; iOS follows its locale. `locale` controls iOS and Android
  trigger formatting; Android dialogs follow the system app locale.
- `testID` targets the iOS picker or Android single-mode trigger. Android datetime
  triggers use `-date` and `-time`; supporting text uses `-message`. Upstream
  Android dialog buttons have native accessibility labels, no custom test IDs.

Use **Components/Date Time Picker/Playground** for modes, external reset, bounds,
errors, disabled state, locales and theme controls. The app catalog also exposes
`/components/date-time-picker`. Check both platforms with light/dark, RTL, large
text, cancellation and timezone boundaries on a matching native build.
