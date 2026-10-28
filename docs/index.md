# Documentation

[Project home](../README.md) · [Agent rules](../AGENTS.md) · [Skill index](skills.md)

Current guides are listed first. Component contracts belong to independent skills;
[documentation ownership](documentation.md) defines where to maintain each topic.

## Development and architecture

- [Development](development.md)
- [Application architecture](architecture.md)
- [Documentation ownership](documentation.md)
- [Task and component skills](skills.md)
- [Shared native UI](ui.md)
- [Storybook](storybook.md)
- [Bundled assets](assets.md)

## Implementation and appearance

- [API services](api-services.md)
- [Authentication](auth-forms.md)
- [Localization](localization.md)
- [Live LTR / RTL](layout-direction.md)
- [Safe-area handling](safe-area-handling.md)
- [App Settings and appearance](appearance-themes.md)
- [Altarea and Likan theme](altarea-theme.md)
- [Native control themes](control-theme.md)
- [Shared Skia page motion](shared-skia-motion.md)

## Builds and engineering

- [EAS development builds](eas-development-builds.md)
- [Native performance](performance.md)
- [White-label readiness review — 2026-10-27](white-label-readiness-2026-10-27.md)
- [P1/P2 implementation report — 2026-10-28](white-label-implementation-2026-10-28.md)
- [White-label implementation plan](white-label-template-plan.md) — retains unfinished work.
- [Local SonarQube analysis](sonarqube.md)

## Cleanup candidates

Reviewed on 2026-10-27. These 25 files are candidates for removal or consolidation;
this cleanup lists them without deleting historical reports. Current guides and
source supersede their implementation instructions.

Retired features and old plans:

- [development-guest-mode.md](development-guest-mode.md) — retired guest access.
- [home-recipe-card-examples.md](home-recipe-card-examples.md) — removed card examples.
- [home-scroll-lag-investigation.md](home-scroll-lag-investigation.md) — earlier Home structure.
- [pages-navigation-plan.md](pages-navigation-plan.md) — old route plan.
- [reference-tabs-report.md](reference-tabs-report.md) — previous tab implementation.
- [whatsapp-theme.md](whatsapp-theme.md) — removed theme.

Superseded quality and implementation snapshots:

- [code-quality-report.md](code-quality-report.md)
- [engineering-quality.md](engineering-quality.md)
- [global-check-report.md](global-check-report.md)
- [global-project-audit-2026-10-16.md](global-project-audit-2026-10-16.md)
- [layout-dimensions-audit.md](layout-dimensions-audit.md)
- [optimisation-audit-2026-10-11.md](optimisation-audit-2026-10-11.md)
- [production-fixes-plan.md](production-fixes-plan.md)
- [production-readiness.md](production-readiness.md)
- [project-analysis-2026-10-18.md](project-analysis-2026-10-18.md)
- [project-audit-2026-10-04.md](project-audit-2026-10-04.md)
- [project-cleanup.md](project-cleanup.md)
- [render-performance-audit.md](render-performance-audit.md)
- [sonarqube-duplication-fixes-2026-10-11.md](sonarqube-duplication-fixes-2026-10-11.md)
- [sonarqube-high-impact-fixes-2026-10-11.md](sonarqube-high-impact-fixes-2026-10-11.md)
- [sonarqube-medium-impact-fixes-2026-10-11.md](sonarqube-medium-impact-fixes-2026-10-11.md)
- [sonarqube-report-2026-10-11.md](sonarqube-report-2026-10-11.md)
- [universal-components-audit.md](universal-components-audit.md)
- [white-label-audit-2026-10-04.md](white-label-audit-2026-10-04.md)

Merge any useful geometry detail into current guidance before removing:

- [layout-consistency.md](layout-consistency.md) — overlaps current page/layout contracts and includes retired routes/tests.

## Retained historical evidence

These files record actual native observations. Keep their dated context when using
them; they do not establish current SDK behavior.

- [Build verification](build-verification.md)
- [Former Home catalog](home-catalog-layout.md)
- [Navigation wave verification](navbar-wave-verification.md)
- [UI library history](archive/ui-library-history.md)
