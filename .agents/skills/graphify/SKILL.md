---
name: graphify
description: Use by default for codebase navigation and changes; build and query this project's Graphify graph for architecture, dependencies and impact analysis.
---

# Project knowledge graph

Use Graphify automatically for codebase work in this Expo application, without
waiting for `$graphify`. Query the graph before source searches. Confirm findings
against current source before changing code; a graph can be stale. Use `rg` and
source inspection to verify results or fill gaps in graph coverage.

## Build and query

Run from the repository root:

```sh
graphify extract . --code-only --max-workers 2
graphify query "How does session restoration reach the API client?" --budget 1500
graphify explain "SessionRestoreScreen()"
graphify path "api.ts" "apiClient"
```

If the graph is missing or relevant source has changed since extraction, refresh
it with the extraction command above. For `$graphify .`, use that same command.
With an existing `graphify-out/graph.json`, answer graph questions with scoped
`query`, `explain` or `path` commands. If a name is ambiguous, use the listed
qualified candidate; if nothing matches, search source instead of inventing an edge.
If output is truncated, narrow the question or use `--seed` and `--depth` before
raising the token budget.

Refresh once after code edits; reuse the graph between queries. If the CLI is
unavailable or extraction fails, report the limitation and continue with source
inspection. Inspect a shrink warning before adding `--force` to accept
intentional removals. Keep generated graphs, reports and caches in the ignored
`graphify-out/` directory.

Code-only extraction uses local parsers without model calls. Include documents
or media only when requested; select a supported backend from `graphify --help`
and the [official CLI documentation](https://docs.graphify.com/reference/overview).
Treat inferred relationships as leads to verify, and keep native performance
claims grounded in device measurements.

Add watchers, commit hooks or hosted services only when requested.

## Windows

Use PowerShell syntax on this host. If the current terminal has an old `PATH`,
replace `graphify` with `& "$env:USERPROFILE/.local/bin/graphify.exe"`. Use the
installed CLI directly; upstream Bash heredocs and interpreter detection need
translation before they can run in PowerShell.

Installation and maintenance belong to [the project agent guide](../../../docs/codex-agents.md#graphify).
