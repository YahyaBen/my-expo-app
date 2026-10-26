# Component skills

Use this index to select only the component families involved in the change.
The 34 skills below cover 28 shared UI families and six native primitives.
Each family skill owns its current component contract. Short guidance stays in
SKILL.md; the longer page and button guides use linked references. Read only
the relevant family and shared rules. Source folders contain code, not duplicate
READMEs. The text skill covers native Text and the project text wrappers.

## Layout and native composition

| Component or family                       | Skill                                                                                                 | Source / current guidance                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Column                                    | [template-skill-ui-column](../../template-skill-ui-column/SKILL.md)                                   | [Public native export](../../../../src/components/ui/index.ts)                     |
| Row                                       | [template-skill-ui-row](../../template-skill-ui-row/SKILL.md)                                         | [Public native export](../../../../src/components/ui/index.ts)                     |
| Spacer                                    | [template-skill-ui-spacer](../../template-skill-ui-spacer/SKILL.md)                                   | [Public native export](../../../../src/components/ui/index.ts)                     |
| ScrollView                                | [template-skill-ui-scroll-view](../../template-skill-ui-scroll-view/SKILL.md)                         | [Public native export](../../../../src/components/ui/index.ts)                     |
| RNHostView                                | [template-skill-ui-rn-host-view](../../template-skill-ui-rn-host-view/SKILL.md)                       | [Public native export](../../../../src/components/ui/index.ts)                     |
| Host                                      | [template-skill-ui-host](../../template-skill-ui-host/SKILL.md)                                       | [host/](../../../../src/components/ui/host/)                                       |
| Native layout helpers                     | [template-skill-ui-native](../../template-skill-ui-native/SKILL.md)                                   | [native/](../../../../src/components/ui/native/)                                   |
| Page frames, header, sections, and motion | [template-skill-ui-page](../../template-skill-ui-page/SKILL.md)                                       | [page/](../../../../src/components/ui/page/)                                       |
| Refreshable scroll view                   | [template-skill-ui-refreshable-scroll-view](../../template-skill-ui-refreshable-scroll-view/SKILL.md) | [refreshable-scroll-view/](../../../../src/components/ui/refreshable-scroll-view/) |

## Text, icons, and collections

| Component or family | Skill                                                                         | Source / current guidance                                      |
| ------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Text                | [template-skill-ui-text](../../template-skill-ui-text/SKILL.md)               | [text/](../../../../src/components/ui/text/)                   |
| Icon                | [template-skill-ui-icon](../../template-skill-ui-icon/SKILL.md)               | [Public native export](../../../../src/components/ui/index.ts) |
| List                | [template-skill-ui-list](../../template-skill-ui-list/SKILL.md)               | [list/](../../../../src/components/ui/list/)                   |
| List item           | [template-skill-ui-list-item](../../template-skill-ui-list-item/SKILL.md)     | [list-item/](../../../../src/components/ui/list-item/)         |
| Table               | [template-skill-ui-table](../../template-skill-ui-table/SKILL.md)             | [table/](../../../../src/components/ui/table/)                 |
| Collapsible         | [template-skill-ui-collapsible](../../template-skill-ui-collapsible/SKILL.md) | [collapsible/](../../../../src/components/ui/collapsible/)     |

## Controls and forms

| Component or family    | Skill                                                                                     | Source / current guidance                                              |
| ---------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Button                 | [template-skill-ui-button (authored)](../../template-skill-ui-button/SKILL.md)            | [button/](../../../../src/components/ui/button/)                       |
| Checkbox               | [template-skill-ui-checkbox](../../template-skill-ui-checkbox/SKILL.md)                   | [checkbox/](../../../../src/components/ui/checkbox/)                   |
| Switch                 | [template-skill-ui-switch](../../template-skill-ui-switch/SKILL.md)                       | [switch/](../../../../src/components/ui/switch/)                       |
| Slider                 | [template-skill-ui-slider](../../template-skill-ui-slider/SKILL.md)                       | [slider/](../../../../src/components/ui/slider/)                       |
| Picker                 | [template-skill-ui-picker](../../template-skill-ui-picker/SKILL.md)                       | [picker/](../../../../src/components/ui/picker/)                       |
| Segmented control      | [template-skill-ui-segmented-control](../../template-skill-ui-segmented-control/SKILL.md) | [segmented-control/](../../../../src/components/ui/segmented-control/) |
| Text input             | [template-skill-ui-text-input](../../template-skill-ui-text-input/SKILL.md)               | [text-input/](../../../../src/components/ui/text-input/)               |
| Field group            | [template-skill-ui-field-group](../../template-skill-ui-field-group/SKILL.md)             | [field-group/](../../../../src/components/ui/field-group/)             |
| Form fields and submit | [template-skill-ui-form](../../template-skill-ui-form/SKILL.md)                           | [form/](../../../../src/components/ui/form/)                           |

## Feedback and overlays

| Component or family                | Skill                                                                           | Source / current guidance                                    |
| ---------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Bottom sheet                       | [template-skill-ui-bottom-sheet](../../template-skill-ui-bottom-sheet/SKILL.md) | [bottom-sheet/](../../../../src/components/ui/bottom-sheet/) |
| Loading, query content, and errors | [template-skill-ui-loading](../../template-skill-ui-loading/SKILL.md)           | [loading/](../../../../src/components/ui/loading/)           |
| Skeleton                           | [template-skill-ui-skeleton](../../template-skill-ui-skeleton/SKILL.md)         | [skeleton/](../../../../src/components/ui/skeleton/)         |
| Alert                              | [template-skill-ui-alert](../../template-skill-ui-alert/SKILL.md)               | [alert/](../../../../src/components/ui/alert/)               |

## App compositions

| Component or family     | Skill                                                                                   | Source / current guidance                                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Appearance preferences  | [template-skill-ui-appearance](../../template-skill-ui-appearance/SKILL.md)             | [Shared color-scheme control](../../../../src/components/ui/appearance/) and [Settings pickers](../../../../src/features/settings/) |
| Auth frame and controls | [template-skill-ui-auth](../../template-skill-ui-auth/SKILL.md)                         | [Shared UI](../../../../src/components/ui/auth/) and [Login preferences](../../../../src/features/auth/)                            |
| Floating action         | [template-skill-ui-floating-action](../../template-skill-ui-floating-action/SKILL.md)   | [floating-action/](../../../../src/components/ui/floating-action/)                                                                  |
| Tab navigation          | [template-skill-ui-navigation](../../template-skill-ui-navigation/SKILL.md)             | [navigation/](../../../../src/components/ui/navigation/)                                                                            |
| Launch screen           | [template-skill-ui-launch-screen](../../template-skill-ui-launch-screen/SKILL.md)       | [launch-screen/](../../../../src/components/ui/launch-screen/)                                                                      |
| OTP bottom sheet        | [template-skill-ui-otp-bottom-sheet](../../template-skill-ui-otp-bottom-sheet/SKILL.md) | [otp-bottom-sheet/](../../../../src/components/ui/otp-bottom-sheet/)                                                                |

## Maintain the component contract

Update the existing family skill for prop, Host, theme or native behavior changes.
Keep source and current story links accurate. Link shared rules rather than
copying them. A new component family needs one matching skill and index row;
a new API mode or state does not need another skill.
