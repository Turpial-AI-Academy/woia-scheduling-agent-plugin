# woia-scheduling

Customer Service-owned appointments with scoped reads, separate booking/confirmation/attendance, and no embedded external notifications.

Native thin shared provider, version 0.5.0. Agent Plugin 1.0.0 distribution; no orchestrator, MCP server or chosen database.

- [Skill](skills/woia-scheduling/SKILL.md)
- [Contract](skills/woia-scheduling/references/CONTRACT.md)
- [Ports](skills/woia-scheduling/references/PORTS.md)

Actions: `appointment.availability.read`, `appointment.read`, `appointment.create`, `appointment.reschedule`, `appointment.cancel`, `appointment.status.observe`.

Run `node --test tests/domain.test.mjs` for capability regression, `mise run ci:fast` for repository checks. Commit the candidate, then run `mise run plugin:certify-thin --repo <absolute-provider-path>` from Ecosystem v0.5.4.

A host must supply fresh authenticated authority, source and atomic persistence ports. No credentials or private organization values are included. Local synthetic PASS does not imply external adapter qualification, admission, release, Operator E2E or Production Ready.
