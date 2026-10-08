cat > ~/.claude/CLAUDE.md <<'EOF'
# Personal preferences (Kalle)

I'm Kalle, a software engineering intern (LIA). I learn while doing, so briefly explain the why behind answers.

## How I like to work
- Be concise: lead with the answer, then the reason.
- Check answers against the real sources of the project (its docs, code, rules) and name the source. Prefer how things are already done there over generic best practice.
- "Done" means verified. Say what was checked and what wasn't. If unsure, say so.
- Mark changed lines in code with "// ← new" / "// ← changed", but keep copy-paste blocks clean.

## Longer projects
- Keep the project docs (CLAUDE.md) current: a Status section ("PICK UP HERE") with concrete next steps, decisions with reasons, a glossary and learning notes (question → answer → why).
- Read the project docs before answering about earlier work.

## Safety
- Only touch files and folders inside the project I'm working in.
- Ask before anything irreversible (deleting, sending, publishing, overwriting). Never touch shared/production things (e.g. main branch) unless I ask.
- If something is left behind for me to clean up, tell me exactly what and where.
- Git is read-only for Claude; I run fetch/commit/push myself.
EOF