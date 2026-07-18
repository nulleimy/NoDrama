# NoDrama — Release Gate Status

## Aktuální produkční připravenost

| Oblast | Stav | Poznámka |
|---|---:|---|
| Full QA engine runtime gate | ✅ lokálně silné / ⚠️ CI musí být tvrdý gate | `npm run verify` aktuálně pokrývá lint, build, Stripe foundation, persistence plan, abuse guard, auth credit ledger a další kontroly. |
| Stripe / reálné platby | ⚠️ foundation hotová | Existují `/api/billing/checkout`, `/api/billing/portal`, `/api/billing/webhook`; reálné produkční Stripe secrets a webhook flow musí být ověřené mimo repo. |
| Produkční DB | ⚠️ plán/foundation | Persistence plan a credit ledger foundation existují; produkční DB, migrace, backup a rollback musí být dotažené. |
| Full 3k/9k dataset | ❌ chybí | Chybí tvrdý smoke/regression test nad plným datasetem. |
| Release/deploy branch | ⚠️ doplnit | Doporučený tok: `feature/* → dev → release/deploy → main`. |
| CI jako plný release gate | ⚠️ doplnit | CI musí blokovat release větve a main při nesplněném gate. |

## Verdikt

NoDrama je lokálně stabilní a `npm run verify` aktuálně prochází.

Projekt ale ještě není plně produkčně release-ready, dokud nejsou dotažené:

1. Tvrdý CI release gate.
2. Produkční Stripe konfigurace a webhook test.
3. Produkční DB migrace, backup a rollback.
4. Full 3k/9k dataset regression/smoke test.
5. Release/deploy branch flow.
6. Deploy ochrana proti náhodnému release z feature branche.

## Doporučený release flow

```text
feature/* → dev → release/deploy → main
