# Security policy

## Reporting

Email **stafadigital@gmail.com** with a clear description and reproduction steps. Please do **not** open public GitHub issues for security reports.

We commit to acknowledging within 72 hours and working with you on a coordinated disclosure.

## Scope

The following are in scope for responsible disclosure:

- Authentication, session, or authorization flaws.
- Anything that could expose data from `/play/[token]` to non-intended parties.
- Anything that could violate the COPPA commitments documented in `docs/coppa-compliance.md` (e.g., a third-party SDK reaching the player route).
- Stripe webhook handling, subscription state.

Out of scope:

- Volumetric DoS, social engineering of staff, physical attacks.
