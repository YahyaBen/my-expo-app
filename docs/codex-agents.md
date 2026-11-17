# Project agents

Codex loads project agent definitions from `.codex/agents/*.toml`. These define
specialist roles; the main agent coordinates the task and combines their work.
The `.agents/skills/` directory contains reusable task instructions selected
through [the skill index](skills.md).

| Agent          | Responsibility                                            |
| -------------- | --------------------------------------------------------- |
| `native_ui`    | Native screens, shared UI and platform adapters           |
| `api_services` | API contracts, repositories and remote state              |
| `expo_config`  | Expo dependencies, app configuration and EAS profiles     |
| `reviewer`     | Review changes for concrete defects without editing files |

Role instructions live in their TOML files. Maintain workflow and component
contracts in the existing skills rather than duplicating them in agent definitions.

## Using the agents

Open this trusted project in a current Codex client. Project settings in
`.codex/config.toml` enable subagents and cap concurrently open subagent threads at
three, excluding the main agent. These roles do not override model or reasoning
settings; Codex resolves them from explicit spawn settings, agent defaults and
the parent session. Agents inherit the parent permissions; the reviewer's no-edit
instruction is a behavioral constraint, not a separate read-only sandbox.

Ask for agents by name, or let the main agent follow the delegation rules in
[`AGENTS.md`](../AGENTS.md). For example:

> Add a profile screen. Use native_ui for presentation and api_services for the
> confirmed API contract. Agree on the contract first and assign separate files.
> Have reviewer inspect the combined changes, then run lint and typecheck.

Start only the agents needed for the task. Independent research can run in
parallel; dependent edits must wait for their inputs. Assign one writer per file,
and let the main agent integrate shared files and run the final static checks.
Preserve existing uncommitted changes. Keep short tasks with one agent.

Definitions do not create persistent workers or start jobs automatically. More
agents consume more tokens, so use parallel work when it helps the actual task.
If a running chat does not discover newly added definitions, start a new chat in
this project.

See the official [Codex subagent guide](https://learn.chatgpt.com/docs/agent-configuration/subagents)
for configuration and client behavior. Report static checks, native-device checks
and live-backend checks separately as required by `AGENTS.md`.

## Reply style

The [Caveman skill](https://github.com/JuliusBrussee/caveman) is enabled by default
through this project's `AGENTS.md`. It keeps replies concise while preserving code,
commands and technical details. Say `stop caveman` or `normal mode` to use normal
replies for the rest of the chat. Invoke `$caveman` to re-enable it.

Codex loads global defaults from `~/.codex/AGENTS.md`; add the same default-skill
instruction there to apply Caveman across projects. Start a new chat to load
changes to these instruction files.

## Ponytail

[Ponytail](https://github.com/DietrichGebert/ponytail) provides coding, review and
audit instructions. This project's `.codex/config.toml` enables `ponytail@ponytail`.
Install the plugin once for your Codex user profile:

```sh
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
codex plugin list --marketplace ponytail --json
```

Keep Node.js on your PATH for the plugin's lifecycle hooks. In an interactive
`codex` session, open `/hooks` to review and trust Ponytail's hooks. Restart the
Codex desktop app after installation and start a new chat. Installation and project
enablement alone do not trust the hooks or activate them in an existing chat.

Invoke skills by their plugin namespace, for example `$ponytail:ponytail-review`
for a diff review, `$ponytail:ponytail-audit` for a repository audit, or
`$ponytail:ponytail full` to select the default intensity. The skills ship with the
plugin; do not duplicate them in `.agents/skills/` or add an application dependency.
Project constraints in `AGENTS.md` govern native UI, architecture, performance
measurement and static/manual verification.

See [Ponytail's Codex installation guide](https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md#codex)
for upstream setup details.

## Graphify

[Graphify](https://github.com/Graphify-Labs/graphify) indexes code into a local
knowledge graph. The official Python package is `graphifyy` (double `y`); its CLI
is `graphify`. Keep it in an isolated developer environment, outside the app's
JavaScript dependencies. The current setup uses Graphify 0.9.111 and Python 3.12.

Install once per machine with [uv](https://docs.astral.sh/uv/getting-started/installation/):

```sh
uv tool install --python 3.12 graphifyy==0.9.111
graphify install --platform codex
```

On Windows, `winget install astral-sh.uv` installs uv. Restart Codex after changing
your user `PATH`. If an already-running terminal cannot find Graphify, invoke
`& "$env:USERPROFILE/.local/bin/graphify.exe"` in PowerShell.

The second command installs Graphify's official skill in
`~/.codex/skills/graphify/`. This repository maintains a compact project workflow
in `.agents/skills/graphify/SKILL.md`, discoverable through the skill index.
Codex user preferences in `~/.codex/AGENTS.md` and this project's `AGENTS.md`
enable Graphify automatically for codebase work in every chat. Query the graph
before source searches, building or refreshing it with local code-only extraction
when needed. No explicit invocation is required. You can also invoke `$graphify .`
to build the graph or `$graphify query "<question>"` to inspect it.

For a local code-only build and query from the repository root:

```sh
graphify extract . --code-only --max-workers 2
graphify query "How does session restoration reach the API client?" --budget 1500
```

This uses local code parsers without model calls. Re-run extraction after source
changes. `.graphifyignore` excludes agent instructions and bundled media;
Graphify also respects `.gitignore`. Generated graphs, reports and caches stay
in the ignored `graphify-out/` directory. Verify graph results against current
source before relying on them.

The project workflow applies automatically during codebase work and refreshes
after code edits. Full semantic extraction of documents and media uses a
configured model backend; watchers, commit hooks, MCP and cloud
services are optional. The upstream Codex project installer also writes broad
agent instructions and a hook file, so use the maintained project skill here
instead of rerunning `graphify install --project --platform codex`.
