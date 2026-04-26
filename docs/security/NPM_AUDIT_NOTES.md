# NPM Audit Notes

## Current finding

npm audit reports a moderate severity advisory for postcss through the Next.js dependency tree.

## Decision

Do not run npm audit fix --force because npm proposes a breaking downgrade to an old Next.js version.

## Mitigation

- Keep Next.js updated.
- Re-run npm audit after dependency updates.
- Do not accept untrusted CSS input from users.
- Do not expose CSS stringification features to user-generated content in the current MVP.
- Treat this as an upstream framework dependency issue unless a safe patch upgrade is available.
