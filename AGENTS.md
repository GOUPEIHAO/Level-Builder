# AGENTS.md — Instructions for OpenAI Codex & Autonomous Agents

Refer to `CLAUDE.md` for full coordinate conventions (`1 unit = 1m`, `Y-up`, `-Z = North`) and CLI commands (`npm run ai -- ...`).

## Quick Verification Checklist After Level Edits
1. Run `npm run ai -- status` to verify that `audit.issues` has no unintended slope violations (`slope > maxSlopeAngle`) or unreachable jump links (`impossible` / `blocked`).
2. Run `npm run ai -- check-jump --from x1,y1,z1 --to x2,y2,z2` whenever placing platforming gaps.
3. Run `npm run ai -- analyze-los --from x1,y1,z1 --to x2,y2,z2` whenever placing sniper nests or tactical cover.
