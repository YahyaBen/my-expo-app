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

The project includes the [Caveman skill](https://github.com/JuliusBrussee/caveman)
for concise replies that preserve code, commands and technical details. Invoke
`$caveman` in Codex to use it for the chat. Say `stop caveman` or `normal mode`
to return to normal replies. After installation, the skill will be available on
the next turn.

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
