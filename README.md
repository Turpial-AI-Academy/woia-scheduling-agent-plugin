# woia-scheduling

Customer Service-owned appointments with scoped reads, separate booking/confirmation/attendance, and no embedded external notifications.

Native thin shared provider, version 0.5.7. Agent Plugin 1.0.0 distribution; no orchestrator, MCP server or chosen database.

- [Skill](skills/woia-scheduling/SKILL.md)
- [Contract](skills/woia-scheduling/references/CONTRACT.md)
- [Ports](skills/woia-scheduling/references/PORTS.md)

Actions: `appointment.availability.read`, `appointment.read`, `appointment.create`, `appointment.reschedule`, `appointment.cancel`, `appointment.status.observe`.

Run `mise run ci:fast` for source, schema and portable payload checks. Commit the candidate, then run `mise run plugin:certify-thin --repo <absolute-provider-path>` from Ecosystem v0.5.7.

A host must supply fresh authenticated authority, source and atomic persistence ports. No credentials or private organization values are included. Local synthetic PASS does not imply external adapter qualification, admission, release, Operator E2E or Production Ready.

## Maintenance

Edit only this canonical repository. Keep `plugin.json`, `package.json` and `dev.woia/manifest.json` versions aligned. From the canonical WOIA Ecosystem repository, run `mise run plugin:certify-thin --repo <absolute-plugin-repository>`, then use its release preparation/publication tasks. Install and update consumers from immutable published artifacts; keep Project personalization in overlays.
