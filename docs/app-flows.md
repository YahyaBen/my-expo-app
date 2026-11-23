# App flow examples

## Explore stories

Open **Components → App flows → Explore**, or tap **Explore stories** on Home or
Discover. The `/explore` route renders the sketch as a native iOS/Android screen,
using the current theme, language, layout direction and motion preferences.

The reading area uses a single top bar for Back, title and account access, followed
by search and category chips. Flat story rows use one title, a photo-only thumbnail
and a subtle separator. The compact Photo journal keeps its image labels available
to screen readers. Wide screens center the reading area at 720 points; the shared
dock keeps its full-window layout.

### Button actions

| Control                     | Result                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| Back                        | Returns to the previous screen; a direct link falls back to Discover.                    |
| Search / Clear              | Filters the local collection by translated text; Clear retains the category.             |
| Category chip               | Selects one category; All removes the category filter.                                   |
| Story card text             | Opens that story in a native bottom sheet with a full-width photo banner.                |
| Story thumbnail             | Expands its photo through the shared photo grid.                                         |
| Sheet Close                 | Closes the sheet; native dismissal also updates the same presentation state.             |
| Banner Retry                | Retries the selected story's failed banner image.                                        |
| Account avatar              | Opens the existing account flow, which requests sign-in when needed.                     |
| Reset filters               | Clears both the query and category after an empty result.                                |
| Photo tile                  | Expands through the shared photo grid; Close, downward drag and Android Back dismiss it. |
| Pause gallery / manual drag | Stops automatic photo-strip progression for the current visit.                           |
| Dock destination            | Returns to the corresponding Discover, Home, Components or Settings tab.                 |
| Center action               | Opens the component catalog.                                                             |

### Scrolling and refresh

The native page owns vertical scrolling and pull-to-refresh. Category chips use
an independent horizontal native scroll. The photo strip has a bounded horizontal
viewport above the actual dock. Short windows and large text move it into the
page and disable automatic progression so the story content remains reachable.
The keyboard hides the fixed strip while editing. Photo-only tiles keep this rail
72 points tall, independent of translated title length; its header and dock
clearance sit outside that image viewport.

Initial photo requests show native skeleton cards until they settle. Pull-to-refresh
reloads sample artwork without clearing the current search, category or resolved
cards. A collection failure reports an error and invites another pull-to-refresh;
failed banner artwork has a Retry action. An empty result offers filter reset.
Story thumbnails and text have separate native actions, without nested buttons.
The detail sheet owns one bounded vertical scroll, including its final content.
Page and dock retain their existing safe-area ownership.

### Animation notes

Route transitions use the existing stack motion settings. Sheets use native
presentation and dismissal. Photo expansion uses the shared measured zoom and
drag behavior. The photo strip advances only while focused, visible, in the
foreground, and allowed by motion preferences; modal content, a screen reader,
the keyboard or a manual stop prevent automatic progression. A manual stop stays
in effect through rotation and text-size changes for the current visit. Reduced motion
keeps photos accessible without automatic movement.

### Data and verification

This is a local editorial sample, translated into every registered locale. Photos
come from Lorem Picsum and require network access; no new backend, persistence or
dependencies are introduced. Connect a confirmed repository/query contract before
using the collection as live product data.

Static verification covers TypeScript, lint and formatting. Native verification
still needs matching development builds on iOS and Android: check card/image
center taps, refresh recovery offline, sheet close/reopen, photo zoom/drag/Back,
all dock destinations, keyboard reachability, light/dark, live RTL, large text,
rotation, reduced motion, screen readers and background/foreground transitions.
Static checks do not establish device behavior or performance.
