# NoDrama Repository Visibility Decision

## Decision

NoDrama is a commercial proprietary SaaS product. The recommended repository visibility is **PRIVATE**.

## Rationale

- the product contains proprietary application logic, billing/entitlement flows, prompt/orchestration behavior, and commercial implementation detail;
- public source availability is not required by the current business model;
- the repository previously had no root open-source license, so public visibility must not be interpreted as an open-source grant;
- changing a repository from public to private does not revoke copies that may already have been obtained while it was public.

## Required action

Change GitHub repository visibility from `PUBLIC` to `PRIVATE` through an authorized repository-settings operation.

## Verification

After the change, verify:

```text
repository: nulleimy/NoDrama
visibility: private
default branch: main
license model: proprietary / all rights reserved
```

Until the visibility change is confirmed, treat this item as:

`OPEN / MANUAL OR ADMIN API ACTION REQUIRED`
