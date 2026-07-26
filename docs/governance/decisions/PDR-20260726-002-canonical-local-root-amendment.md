# PDR-20260726-002 — Změna kanonického lokálního rootu NoDrama

```text
DECISION_ID=PDR-20260726-002
DATE=2026-07-26
STATUS=ACCEPTED
OWNER=Eimy Herrer
RISK_CLASS=D2
OWNER_DECISION=ACCEPTED
NODRAMA_CANONICAL_LOCAL_ROOT=/Users/eimyna/NoDrama
PREVIOUS_DECLARED_LOCAL_ROOT=/Users/eimyna/Library/CloudStorage/GoogleDrive-ejmiherrer@gmail.com/My Drive/NoDrama
PREVIOUS_ROOT_STATE=NOT_FOUND
CANONICAL_SOURCE_BOUNDARY_STATE=AMENDED
CANONICAL_REMOTE=https://github.com/nulleimy/NoDrama.git
EFFECTIVE_FROM_HEAD=7b61d1888dd16e88e9d445bcd0ee61533b75cc83
```

## Problém

Předchozí projektová deklarace označovala jako jediný kanonický lokální pracovní strom cestu
`/Users/eimyna/Library/CloudStorage/GoogleDrive-ejmiherrer@gmail.com/My Drive/NoDrama`. Read-only rekonciliace dne 2026-07-26 prokázala, že tato cesta neexistuje.
Současně prokázala jediný registrovaný Git worktree v cestě `/Users/eimyna/NoDrama`, správný vzdálený repozitář,
čistý worktree a HEAD `7b61d1888dd16e88e9d445bcd0ee61533b75cc83`.

Nezměněná stará deklarace by blokovala bezpečné write operace a vytvářela rozpor mezi normativní
dokumentací a skutečným stavem systému.

## Ověřené skutečnosti

- `/Users/eimyna/NoDrama` existuje a jeho fyzická cesta je shodná s deklarovanou cestou.
- `git rev-parse --show-toplevel` vrací `/Users/eimyna/NoDrama`.
- Git eviduje právě jeden worktree a jeho cesta je `/Users/eimyna/NoDrama`.
- Aktivní HEAD před tímto rozhodovacím checkpointem je `7b61d1888dd16e88e9d445bcd0ee61533b75cc83`.
- Worktree i index byly před změnou čisté.
- Fetch i push URL remote `origin` jsou `https://github.com/nulleimy/NoDrama.git`.
- Vzdálená větev `main` zůstává na `75ef29ac54e63ea25d7c30d0e0154e14444d5c1c`.
- Předchozí deklarovaná Google Drive cesta má stav `NOT_FOUND`.
- Nebyl proveden přesun repozitáře, kopírování `.git`, push, merge ani release.

## Posouzené varianty

1. **Ponechat nejasnost beze změny** — zamítnuto, protože by všechny další write operace zůstaly fail-closed blokované.
2. **Obnovit nebo přesunout repozitář do Google Drive cesty** — zamítnuto, protože cesta neexistuje a přesun aktivního `.git` do synchronizované složky by bez samostatného migračního plánu zvýšil riziko poškození nebo paralelních kopií.
3. **Přijmout existující jediný ověřený worktree `/Users/eimyna/NoDrama`** — přijato jako nejjednodušší, vratná a důkazně podložená varianta.

## Rozhodnutí

Vlastník projektu výslovně přijímá `/Users/eimyna/NoDrama` jako jediný kanonický lokální pracovní repozitář NoDrama.
Předchozí deklarovaná cesta `/Users/eimyna/Library/CloudStorage/GoogleDrive-ejmiherrer@gmail.com/My Drive/NoDrama` již není source of truth a může být používána pouze jako
historická reference k dřívějšímu uspořádání.

Kanonický vzdálený repozitář zůstává `https://github.com/nulleimy/NoDrama.git`. Toto rozhodnutí nemění obsah ani
SHA-256 souboru `WORLD_CLASS_SOFTWARE_DEVOPS_OPERATING_MODE.md` ani produktové ústavy.

## Hranice rozhodnutí

- Rozhodnutí autorizuje použití `/Users/eimyna/NoDrama` pro budoucí schválené lokální audity a implementační řezy.
- Neautorizuje push, merge, release, produkční deployment ani změnu produkčních dat.
- Neprokazuje celkovou projektovou compliance ani produkční připravenost.
- Jiné kopie NoDrama zůstávají `CANDIDATE`, `BACKUP`, `ARCHIVE` nebo `UNKNOWN`, dokud nejsou explicitně přijaty.

## Guardrails a trigger přehodnocení

Rozhodnutí musí být znovu přezkoumáno, pokud:

- `/Users/eimyna/NoDrama` přestane existovat nebo přestane být Git worktree,
- změní se kanonický remote,
- objeví se druhý aktivní worktree nebo paralelní zapisující kopie,
- dojde k plánovanému přesunu repozitáře,
- vlastník vydá nové explicitní source-boundary rozhodnutí.

## Rollback nebo exit strategie

Toto rozhodnutí se nesmí tiše přepsat ani odstranit. Návrat k jiné kanonické cestě vyžaduje nové
explicitní vlastnické rozhodnutí, nový audit cesty, remote, worktrees a Git integrity a samostatný
append-only rozhodovací záznam. Tento checkpoint lze technicky vrátit pouze autorizovaným revertem
lokálního commitu; automatický reset, přepis historie ani smazání evidence nejsou povoleny.

## Stav

```text
OWNER_DECISION=ACCEPTED
NODRAMA_CANONICAL_LOCAL_ROOT=/Users/eimyna/NoDrama
PREVIOUS_DECLARED_LOCAL_ROOT=/Users/eimyna/Library/CloudStorage/GoogleDrive-ejmiherrer@gmail.com/My Drive/NoDrama
PREVIOUS_ROOT_STATE=NOT_FOUND
CANONICAL_SOURCE_BOUNDARY_STATE=AMENDED_RECORDED_IN_REPOSITORY
CANONICAL_REMOTE=https://github.com/nulleimy/NoDrama.git
EFFECTIVE_FROM_HEAD=7b61d1888dd16e88e9d445bcd0ee61533b75cc83
PROJECT_COMPLIANCE_STATE=NOT_PROVEN_BY_ROOT_AMENDMENT
PUSH=NONE
MERGE=NONE
RELEASE=NONE
PRODUCTION_EFFECT=NONE
```
