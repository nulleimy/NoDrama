# PRODUCT / DECISION / EXECUTION CONSTITUTION

**Normativní doplněk k `WORLD_CLASS_SOFTWARE_DEVOPS_OPERATING_MODE.md`**
**Doporučený název souboru:** `PRODUCT_DECISION_EXECUTION_CONSTITUTION.md`
**Verze:** 1.1.1
**Stav dokumentu:** `PROPOSED_CONFLICT_AUDITED_NOT_IMPLEMENTED`
**Datum návrhu:** 2026-07-26
**Primární použití:** NoDrama. Přenos do jiného projektu vyžaduje explicitní adaptaci, nový konfliktový audit a vlastní přijetí.

---

## ČLÁNEK 0 — NEJVYŠŠÍ PRINCIP

> **Nejsilnější vývojový model spojuje Jobsovu produktovou čistotu, unixovou jednoduchost, DevOps automatizaci, SRE spolehlivost, princip nulové důvěry a úplnou auditovatelnost celého životního cyklu systému — nejen jeho Git historie.**
>
> **Každá změna musí být jednoduchá, účelná, automatizovaná, bezpečná, měřitelná, vratná a důkazně ověřitelná.**

Tento princip není slogan. Je to závazný rozhodovací filtr.

Změna, která nesplní některou z uvedených vlastností, musí být:

1. přepracována,
2. zmenšena na bezpečný vertikální řez,
3. označena jako časově omezená výjimka s vlastníkem a expirací,
4. nebo odmítnuta.

Rychlost, obchodní tlak, technická zajímavost, konkurenční funkce ani autorita jednotlivce nesmějí obejít bezpečnost, důkaznost, uživatelskou hodnotu nebo integritu produktu.

---

## 1. ÚČEL, ROZSAH A AUTORITA

Tato ústava doplňuje technickou ústavu `WORLD_CLASS_SOFTWARE_DEVOPS_OPERATING_MODE.md` o produktové, rozhodovací a realizační řízení.

Řídí zejména:

- výběr problémů, které mají být řešeny,
- produktovou čistotu a jednoduchost,
- prioritizaci a roadmapu,
- rozhodovací pravomoci a eskalace,
- design, implementaci, verifikaci a release,
- AI kvalitu, bezpečnost a odpovědnost,
- UX, přístupnost, soukromí a důvěru,
- monetizaci a ekonomickou udržitelnost,
- provoz, incidenty, rollback, obnovu a ukončení funkcí,
- důkazní stopu od potřeby uživatele až po provozní výsledek.

### 1.1 Pořadí autority

Při konfliktu platí toto pořadí:

1. systémová pravidla platformy, závazné právo a nepřekročitelné bezpečnostní omezení,
2. `WORLD_CLASS_SOFTWARE_DEVOPS_OPERATING_MODE.md`,
3. explicitní aktuální instrukce a autorizace vlastníka projektu,
4. tato produktová, rozhodovací a realizační ústava po jejím kanonickém přijetí,
5. ostatní kanonická projektová dokumentace,
6. ADR a dříve schválená rozhodnutí,
7. roadmapa, backlog a plány,
8. osobní preference, zvyklosti a předpoklady.

Aktuální instrukce vlastníka projektu nesmí být tiše interpretována jako změna ústavy. Pokud požaduje výjimku, musí být výjimka explicitní, ohraničená, auditovatelná a nesmí porušit vyšší autoritu.

Tato ústava nesmí oslabit bezpečnostní, technické ani důkazní požadavky WORLD dokumentu.

### 1.2 Kanonický stav

Dokument se stává závazným až po:

- vložení do kanonického repozitáře,
- ověření přesného diffu,
- kontrole konfliktů s WORLD dokumentem,
- schváleném commitu,
- a explicitním přijetí jako normativní dokument.

Do té doby je jeho stav `PROPOSED_CONFLICT_AUDITED_NOT_IMPLEMENTED`.

### 1.3 Normativní hranice externích rámců

Externí standardy nejsou automaticky celé přeneseny do projektu. Jsou zdrojem kontrol a srovnávacích kritérií.

Pro každý použitý rámec musí být zaznamenáno:

- přesné jméno a verze,
- stav `FINAL`, `APPROVED`, `DRAFT` nebo `INFORMATIVE`,
- vybrané kontroly a jejich důvod,
- vlastník mapování,
- datum posledního ověření aktuálnosti,
- dopad nové verze,
- a migrační rozhodnutí.

Nová verze externího rámce nemění projektové povinnosti automaticky. Nejprve vyžaduje diff, risk review a explicitní přijetí. Draft nesmí bez zvláštního rozhodnutí nahradit finální normativní základ.

### 1.4 Projektový profil NoDrama

Tato ústava je obecný governance základ doplněný profilem NoDrama. Pro NoDrama jsou vždy kritické zejména:

- přirozenost češtiny a angličtiny,
- situační a vztahová přesnost,
- nemanipulativní a bezpečný výstup,
- ochrana citlivých promptů a osobních údajů,
- transparentní kredity, ceny a billing,
- fail-closed produkční hranice,
- dostupnost a přístupnost hlavních uživatelských cest,
- a důkazně reprodukovatelná AI evaluace.

Obecné pravidlo nesmí přepsat přísnější NoDrama invariant.

---

## 2. PRAVDA, STAVY A ZÁKAZ FALEŠNÉHO ÚSPĚCHU

Povinné stavové štítky:

- `VERIFIED` — tvrzení je podloženo aktuálním důkazem,
- `IMPLEMENTED` — změna skutečně existuje v deklarovaném prostředí,
- `PROPOSED` — jde pouze o návrh,
- `INFERRED` — závěr je logicky odvozen z omezených důkazů,
- `UNKNOWN` — chybí podklady,
- `BLOCKED` — nelze bezpečně pokračovat,
- `FAILED` — ověřovací gate selhal,
- `DEFERRED` — práce byla vědomě odložena s důvodem, vlastníkem a termínem,
- `RETIRED` — funkce nebo systém byly řízeně ukončeny,
- `PARTIALLY_VERIFIED` — část rozsahu je doložena, část nikoliv.

### 2.1 Zakázaná tvrzení

Nikdy netvrď:

- že potřeba uživatele je potvrzená bez výzkumu nebo dat,
- že funkce přináší hodnotu jen proto, že byla dokončena,
- že změna je jednoduchá jen proto, že má malý diff,
- že systém je bezpečný jen proto, že audit nenašel známou chybu,
- že AI výstup je kvalitní bez reprezentativní evaluace,
- že experiment vyhrál bez předem definované metriky a guardrailů,
- že release je úspěšný bez runtime důkazů,
- že dokumentace odpovídá realitě bez porovnání s implementací,
- že stav je `COMPLETE`, `PRODUCTION_READY` nebo `10/10`, pokud existuje povinný stav `UNKNOWN`, `BLOCKED`, `FAILED` nebo neuzavřený kritický dluh.

### 2.2 Důkaz má omezenou platnost

Důkaz je platný pouze pro:

- konkrétní commit nebo artefakt,
- konkrétní konfiguraci,
- konkrétní prostředí,
- konkrétní časové období,
- konkrétní rozsah testu,
- a konkrétní verzi závislostí, modelu, dat nebo infrastruktury.

Starý důkaz nesmí být automaticky přenesen na nový stav.

---

## 3. DOKTRÍNA 10/10

`10/10` není pochvala, marketingový výraz ani osobní dojem. Je to nejvyšší důkazní stav v přesně vymezeném rozsahu.

### 3.1 Pravidlo minima

Celkové skóre kroku se rovná **nejnižšímu skóre povinné dimenze**, nikoliv průměru.

```text
OVERALL_SCORE = MIN(
  USER_VALUE,
  SIMPLICITY,
  SAFETY_PRIVACY,
  ARCHITECTURE,
  IMPLEMENTATION,
  VERIFICATION,
  RELIABILITY,
  OPERABILITY_ROLLBACK,
  ECONOMICS,
  AUDITABILITY
)
```

Jedna kritická slabina nesmí být skryta devíti silnými oblastmi.

### 3.2 Povinných deset dimenzí

Každý významný krok se hodnotí v těchto dimenzích:

1. **Uživatelská hodnota** — problém, uživatel a očekávaný výsledek jsou doloženy.
2. **Jednoduchost** — řešení je nejjednodušší bezpečná varianta, bez zbytečné funkce nebo vrstvy.
3. **Bezpečnost a soukromí** — trust boundaries, zneužití, data a právní dopady jsou řízené.
4. **Architektura** — odpovědnosti, rozhraní, data a závislosti jsou jasné a udržitelné.
5. **Implementace** — změna je malá, srozumitelná, deterministická a odpovídá návrhu.
6. **Verifikace** — relevantní statické, funkční, integrační, regresní a bezpečnostní testy prošly.
7. **Spolehlivost** — jsou definovány failure modes, SLO nebo provozní očekávání a monitorování.
8. **Provoz a rollback** — změnu lze nasadit, pozorovat, zastavit, vrátit nebo kompenzovat.
9. **Ekonomika a udržitelnost** — hodnota ospravedlňuje vývojové, provozní, inference a podpůrné náklady.
10. **Auditovatelnost** — existuje řetězec důkazů od potřeby po výsledek.

### 3.3 Kdy smí být uděleno 10/10

Skóre `10` v dimenzi smí být uděleno pouze tehdy, když:

- existuje předem definovaný pass/fail gate,
- gate byl skutečně proveden,
- výsledek je uložen a dohledatelný,
- důkaz odpovídá aktuálnímu stavu,
- nejsou známy neřešené kritické výjimky,
- a výsledek obstojí při věcném review.

### 3.4 Fázové 10/10

Je dovoleno použít například:

- `DISCOVERY_SCORE=10/10`,
- `DESIGN_SCORE=10/10`,
- `IMPLEMENTATION_SCORE=10/10`,
- `RELEASE_SCORE=10/10`.

Fázové skóre nesmí být zaměněno za celkovou produkční připravenost.

Příklad:

```text
DESIGN_SCORE=10/10
IMPLEMENTATION_STATE=NOT_STARTED
PRODUCTION_READY=NO
```

### 3.5 Neověřitelné body

- `N/A` je dovoleno pouze s písemným odůvodněním.
- Kritická dimenze nesmí být označena `N/A`.
- `UNKNOWN` omezuje celkové skóre maximálně na `6/10`.
- `BLOCKED` nebo `FAILED` znamená `0/10` pro příslušný gate a zákaz uzavření kroku.
- Časově omezená výjimka omezuje celkové skóre maximálně na `9/10`.

### 3.6 Kalibrace skóre 0–10

Skóre musí odpovídat této společné stupnici:

| Skóre | Normativní význam |
|---:|---|
| `0` | `FAILED` nebo `BLOCKED`; gate nelze uzavřít. |
| `1–2` | problém je popsán jen částečně; vysoká nejistota nebo zásadní nedostatky. |
| `3–4` | existuje návrh nebo dílčí implementace, ale chybí podstatné důkazy či failure paths. |
| `5–6` | základní řešení je použitelné v omezeném rozsahu; zůstávají významné `UNKNOWN` nebo neprovedené gates. |
| `7` | relevantní základní gates prošly; zbývá střední dluh nebo omezená nezávislá verifikace. |
| `8` | silný, reprodukovatelný a auditovaný výsledek; zbývají pouze jasně ohraničená nekritická omezení. |
| `9` | všechny povinné gates prošly, ale existuje schválená výjimka, omezený provozní důkaz nebo chybí požadované nezávislé review. |
| `10` | všechny povinné gates v deklarovaném rozsahu prošly, důkazy jsou aktuální, nezávislost review odpovídá riziku a není otevřená výjimka. |

Skóre nesmí být určeno podle pocitu, množství práce ani procenta dokončených úkolů.

### 3.7 Nezávislost hodnocení

- D0 a D1 mohou být self-reviewed, pokud jsou plně automatizovaně ověřitelné.
- D2 vyžaduje alespoň druhé věcné review nebo ekvivalentní automatický kontrolní gate.
- D3 a D4 nesmějí získat `10/10` bez nezávislého review osobou nebo systémem, který nebyl jediným autorem změny.
- Pokud nezávislé review pro D3 nebo D4 objektivně není dostupné, maximální skóre je `8/10`, stav musí uvést omezení a release může být dále blokován.
- Reviewer nesmí hodnotit pouze formu důkazu; musí ověřit jeho vazbu na tvrzení.

### 3.8 Zákaz předstírané dokonalosti

Cílem není vždy tvrdit `10/10`. Cílem je navrhnout práci tak, aby mohla `10/10` důkazně získat.

Hodnoty jako `200 %`, „naprosto dokonalé“, „bezchybné“ nebo „world-class“ nejsou technický stav. Smějí být použity pouze jako aspirace, nikdy jako náhrada scorecardu a evidence.

Pokud důkaz chybí, správný výsledek je nižší skóre nebo `BLOCKED`. To není selhání komunikace; je to ochrana produktu.

---

## 4. PRODUKTOVÁ PRAVDA A ČISTOTA

### 4.1 Produkt existuje kvůli výsledku uživatele

Každá funkce musí mít jednoznačnou odpověď na:

- Kdo má problém?
- Jaký skutečný úkol se snaží dokončit?
- Jaký výsledek má získat?
- Jak tento výsledek měříme?
- Jaké škody mohou vzniknout?
- Jaké existující řešení už používá?
- Proč je naše řešení jednodušší, bezpečnější nebo účinnější?

Funkce bez doloženého uživatelského problému je `PROPOSED_WITHOUT_EVIDENCE` a nesmí automaticky vstoupit do implementace.

### 4.2 Produktová hierarchie

Při konfliktu optimalizuj v tomto pořadí:

1. ochrana člověka, zákonnost a základní práva,
2. bezpečnost, soukromí a integrita dat,
3. správnost a spolehlivost,
4. skutečný uživatelský výsledek,
5. jednoduchost a srozumitelnost,
6. vratnost a provozní kontrola,
7. dlouhodobá udržitelnost,
8. rychlost doručení,
9. růstové a výnosové cíle,
10. technická elegance bez přímé hodnoty.

Výnos nesmí ospravedlnit manipulaci, klamání, bezpečnostní oslabení nebo zneužití citlivosti uživatele.

### 4.3 Jobsova produktová čistota jako gate

Před implementací významné funkce musí review potvrdit:

- jeden jasný hlavní účel,
- minimum nezbytných voleb,
- srozumitelný výchozí stav,
- konzistentní jazyk a vizuální hierarchii,
- absenci mrtvých cest a falešných funkcí,
- absenci interní technické složitosti přenesené na uživatele,
- možnost vysvětlit funkci jednou přesnou větou,
- a důkaz, že jednodušší varianta nestačí.

### 4.4 Právo odstranit

Odstranění je rovnocenný produktový nástroj.

Kandidátem na odstranění je funkce, která:

- nemá vlastníka,
- nemá měřitelný výsledek,
- duplikuje jinou cestu,
- zvyšuje počet rozhodnutí uživatele bez hodnoty,
- vytváří bezpečnostní nebo provozní dluh,
- nebo nemá doložené použití.

Odstranění musí být auditované, vratné a komunikované podle dopadu.

---

## 5. ROZHODOVACÍ GOVERNANCE

### 5.1 Rozhodnutí musí mít vlastníka

Každé významné rozhodnutí musí obsahovat:

- `DECISION_ID`,
- vlastníka,
- datum,
- rozhodovaný problém,
- dostupné varianty,
- kritéria,
- důkazy,
- zvolenou variantu,
- odmítnuté varianty a důvody,
- rizika,
- trigger pro přehodnocení,
- rollback nebo exit strategii.

### 5.2 Role

Minimální role:

- **Product Owner** — uživatelský výsledek, priorita, obchodní hranice.
- **Product Architect** — produktová čistota, systém schopností, end-to-end cesta.
- **Technical Lead** — architektura, implementační rozsah, technický dluh.
- **Security/Privacy Owner** — threat model, data, oprávnění, výjimky.
- **AI/Data Owner** — datasety, modely, evaluace, provenance, drift.
- **SRE/Release Owner** — SLO, nasazení, observabilita, rollback, incidentní připravenost.
- **Reviewer** — věcně nezávislá kontrola důkazů podle rizika.
- **Project Owner** — finální autorizace změn, které ji podle WORLD dokumentu vyžadují.

V malém týmu může jedna osoba držet více rolí. U vysokého rizika však musí být konflikt rolí explicitně přiznán a kompenzován druhým review, automatickým gate nebo odložením.

### 5.3 Třídy rozhodnutí

#### D0 — Pozorování

- pouze audit nebo měření,
- žádná změna produktu,
- bez produkčního dopadu.

#### D1 — Nízké a vratné

- lokální nebo textová změna,
- žádná citlivá data,
- žádné veřejné API,
- snadný rollback.

#### D2 — Střední

- nová závislost,
- změna datového toku,
- cross-cutting UI nebo backend změna,
- změna metrik nebo experimentu.

#### D3 — Vysoké

- autentizace, autorizace, billing, citlivá data,
- AI safety nebo model routing,
- produkční infrastruktura,
- migrace dat,
- veřejné API,
- release nebo zásadní cenová změna.

#### D4 — Kritické nebo obtížně vratné

- destruktivní migrace,
- změna právního nebo privacy režimu,
- rotace produkčních secrets,
- smazání dat,
- změna licence,
- přepis historie,
- vypnutí ochranného gate,
- nevratná změna uživatelských práv.

D3 a D4 vyžadují explicitní autorizaci, povinné nezávislé review, důkaz rollbacku a immutable evidence receipt. Pokud nezávislé review není dostupné, změna nemůže získat 10/10 a produkční rozhodnutí se řídí článkem 3.7.

### 5.4 Rozhodovací metoda

Rozhodnutí se neřídí hlasitostí názoru. Použije se tato posloupnost:

1. fakta a omezení,
2. bezpečnostní a právní invarianty,
3. uživatelský problém a škody,
4. varianty včetně varianty „neudělat nic“,
5. nejjednodušší bezpečná varianta,
6. náklady a vratnost,
7. předem definované měření výsledku,
8. jasné rozhodnutí a vlastník.

---

## 6. PRIORITIZACE A ROADMAPA

### 6.1 Priorita není pocit

Každá roadmap položka musí mít:

- doložený problém,
- velikost dopadu,
- jistotu důkazů,
- riziko neřešení,
- náklady řešení a provozu,
- strategickou návaznost,
- vratnost,
- a definici úspěchu.

### 6.2 Povinné pořadí práce

Přednost mají:

1. bezpečnostní nebo právní blokátory,
2. ztráta dat, integrity nebo peněz,
3. produkční nespolehlivost a incidentní dluh,
4. blokovaný hlavní uživatelský výsledek,
5. důkazní a observační mezery,
6. výrazné zjednodušení,
7. růst a monetizace,
8. kosmetické nebo spekulativní rozšíření.

### 6.3 WIP limit

- Jeden aktivní cíl má mít jeden hlavní rozhodovací záznam.
- Jeden technický řez má mít jednu logickou odpovědnost.
- Paralelní práce je dovolena pouze při nezávislých závislostech a jasných integračních hranicích.
- Neuzavřené kritické práce nesmějí být maskovány zahájením nových funkcí.

### 6.4 Stop pravidlo

Položka se zastaví, když:

- původní hypotéza byla vyvrácena,
- náklady převýšily předem stanovený limit,
- vzniklo kritické riziko,
- jednodušší cesta vyřešila problém,
- nebo chybí data potřebná k poctivému rozhodnutí.

Sunk cost není důvod pokračovat.

---

## 7. KANONICKÝ ŽIVOTNÍ CYKLUS ZMĚNY

Každá významná změna prochází:

```text
OBSERVE
→ FRAME
→ OPTIONS
→ DECIDE
→ DESIGN
→ IMPLEMENT
→ VERIFY
→ CHECKPOINT
→ REVIEW
→ RELEASE
→ OPERATE
→ LEARN
→ RETIRE
```

Přeskakování fáze je dovoleno pouze u doložené nízkorizikové změny. Bezpečnostní a produkční fáze se nepřeskakují.

### 7.1 Kontrakt každé fáze

Každá fáze musí mít:

- jasný vstup,
- jediný hlavní cíl,
- vlastníka,
- výstupní artefakt,
- pass/fail gate,
- uložený důkaz,
- stop podmínku,
- rollback nebo návratový bod.

### 7.2 Evidence chain

Povinný řetězec:

```text
USER_NEED
→ HYPOTHESIS
→ DECISION
→ DESIGN
→ CHANGESET
→ TEST_EVIDENCE
→ ARTIFACT
→ DEPLOYMENT_RECEIPT
→ RUNTIME_EVIDENCE
→ USER_OUTCOME
→ LEARNING_OR_RETIREMENT
```

Chybějící článek musí být označen `UNKNOWN` nebo `DEFERRED`; nesmí být domyšlen.

---

## 8. DISCOVERY GATE

Discovery je `10/10` pouze pokud:

- cílová skupina a situace jsou konkrétní,
- problém je pozorovaný, nikoliv pouze předpokládaný,
- jsou popsány současné alternativy uživatele,
- je odlišena potřeba od navrženého řešení,
- byly identifikovány škody a citlivé skupiny,
- existuje falsifikovatelná hypotéza,
- je definována metrika výsledku a guardraily,
- a je doloženo, proč má smysl pokračovat.

Povinný výstup: `PRODUCT_PROBLEM_BRIEF`.

Minimální obsah:

```text
USER:
SITUATION:
JOB_TO_BE_DONE:
CURRENT_ALTERNATIVE:
PAIN_OR_RISK:
EXPECTED_OUTCOME:
EVIDENCE:
HYPOTHESIS:
PRIMARY_METRIC:
GUARDRAILS:
STOP_CONDITION:
```

---

## 9. DESIGN GATE

Design je `10/10` pouze pokud:

- řeší celý deklarovaný problém, ne pouze pohodlnou technickou část,
- porovnává nejméně variantu bez změny a jednu jednodušší variantu,
- má jasné uživatelské, datové a trust boundaries,
- obsahuje failure states a recovery UX,
- používá bezpečné výchozí hodnoty,
- nevyžaduje zbytečnou abstrakci nebo závislost,
- je přístupný a lokalizovatelný,
- obsahuje měření, rollout a rollback,
- a je zaznamenán v ADR nebo produktovém rozhodnutí.

Design nesmí přenášet interní architekturu, billing terminologii nebo modelové limity na uživatele bez nutnosti.

---

## 10. IMPLEMENTAČNÍ GATE

Implementace je `10/10` pouze pokud:

- odpovídá schválenému rozhodnutí,
- diff je omezený na deklarovaný rozsah,
- změna je deterministická a reprodukovatelná,
- používá aktuální kanonický repozitář a správnou větev,
- závislosti jsou připnuté a odůvodněné,
- citlivé operace jsou fail-closed,
- existuje targeted test a regresní ochrana,
- dokumentace odpovídá realitě,
- nevznikly secrets, runtime artefakty nebo nesouvisející změny,
- a existuje přesný rollback.

„Kód existuje“ není důkaz implementace `10/10`.

---

## 11. VERIFIKAČNÍ GATE

Relevantní vrstvy verifikace:

1. formát a statické kontroly,
2. type checking,
3. unit testy,
4. contract testy,
5. integrační testy,
6. E2E nebo workflow testy,
7. bezpečnostní testy,
8. privacy a data kontrola,
9. build z čisté instalace,
10. runtime smoke a observabilita.

Verifikace je `10/10` pouze pokud:

- byly předem definovány očekávané výsledky,
- testy ověřují chování, ne pouze spuštění,
- existují negativní a failure-path scénáře,
- výstupy jsou uložené,
- každý neprovedený test má důvod a dopad,
- není známá kritická regrese,
- a výsledky odpovídají aktuálnímu artefaktu.

Coverage je podpůrná metrika, nikoliv samostatný důkaz správnosti.

---

## 12. RELEASE GATE

Release se hodnotí ve dvou oddělených stavech. Předrelease připravenost nesmí být zaměněna za ověřený produkční výsledek.

### 12.1 Release authorization gate

`RELEASE_AUTHORIZATION_SCORE=10/10` je dovoleno pouze pokud:

- je znám přesný commit a immutable artefakt,
- build je reprodukovatelný,
- je ověřena provenance a checksum,
- prostředí splňuje environment contract,
- migrace mají dry-run, pořadí a rollback nebo kompenzaci,
- security a privacy gates jsou uzavřené,
- SLO, alerty a dashboardy existují nebo je doloženo legitimní `N/A`,
- předrelease smoke, health a readiness ověření prošly,
- rollout omezuje blast radius,
- rollback byl ověřen nebo realisticky nacvičen,
- je znám release owner,
- a byla udělena požadovaná autorizace.

Tento stav znamená pouze oprávnění zahájit rollout.

### 12.2 Post-release verification gate

`POST_RELEASE_SCORE=10/10` je dovoleno až po definovaném observačním okně, pokud:

- běží přesně autorizovaný artefakt a konfigurace,
- syntetické i reálné health signály odpovídají očekávání,
- SLI/SLO a error budget nejsou nepřijatelně zhoršené,
- nebyla překročena security, privacy, billing ani AI quality guardrail metrika,
- uživatelská kritická cesta je funkční,
- nejsou nové závažné incidenty nebo regresní signály,
- a release receipt obsahuje skutečný runtime výsledek.

`PRODUCTION_READY=YES` nebo `RELEASE_SCORE=10/10` vyžaduje obě části. Lokální build, úspěšný deploy příkaz ani zelený CI gate samy o sobě produkční připravenost nedokazují.

---

## 13. SRE, SPOLEHLIVOST A PROVOZ

Každá produkční schopnost musí mít:

- service level indicators,
- service level objectives,
- měřitelný error budget,
- alerty na uživatelský dopad,
- health a readiness signály,
- strukturované logy a korelační identifikátory,
- on-call nebo jasný incidentní kontakt,
- runbook,
- rollback a recovery postup,
- postmortem bez hledání viníka.

### 13.1 Error-budget governance

Pokud je error budget vyčerpán nebo trend ohrožuje SLO:

- zpomalují se rizikové releasy,
- prioritu dostává spolehlivost,
- výjimka musí mít vlastníka a schválení,
- a produktová roadmapa nesmí ignorovat provozní realitu.

### 13.2 Povinné delivery metriky

Podle aktuálního DORA modelu sleduj na úrovni systému minimálně:

- deployment frequency,
- change lead time,
- failed deployment recovery time,
- change fail rate,
- deployment rework rate.

Metriky musí být interpretovány společně s uživatelským outcome, spolehlivostí, bezpečností a kontextem systému. Nesmějí být cílem jednotlivce, podkladem pro odměňování podle aktivity ani pobídkou ke gaming chování.

Změna názvu nebo definice externí metriky vyžaduje aktualizaci mapování, ne přepis historických dat bez vysvětlení.

---

## 14. ZERO TRUST, SECURITY A PRIVACY

### 14.1 Nulová implicitní důvěra

Nedůvěřuj automaticky:

- síťové lokaci,
- interní službě,
- uživatelskému vstupu,
- modelovému výstupu,
- webhooku,
- build artefaktu,
- dependency balíčku,
- cache,
- administrátorské roli,
- ani historickému důkazu.

Ověřuj identitu, oprávnění, integritu, kontext a účel každé citlivé operace.

### 14.2 Privacy by design and default

Povinné principy:

- minimalizace dat,
- účelové omezení,
- bezpečné výchozí nastavení,
- nejkratší obhajitelná retence,
- explicitní souhlas tam, kde je nutný,
- možnost exportu a výmazu podle použitelného práva,
- redakce logů,
- oddělení analytiky od citlivého obsahu,
- zákaz ukládání plných promptů ve výchozím stavu bez doložené potřeby.

### 14.3 Bezpečnostní výjimky

Výjimka musí obsahovat:

- přesný kontrolní bod,
- důvod,
- riziko,
- kompenzační opatření,
- vlastníka,
- datum expirace,
- plán odstranění,
- a monitoring.

Výjimka bez expirace je neřízený dluh.

---

## 15. AI A DATOVÁ ÚSTAVA

AI systém nesmí být považován za běžnou deterministickou funkci.

### 15.1 Povinný AI inventory

Pro každý model nebo AI službu eviduj:

- poskytovatele a přesnou verzi,
- účel a zakázaná použití,
- vstupní a výstupní data,
- region a data-processing podmínky,
- retention a training policy poskytovatele,
- fallback a možnost vypnutí,
- náklady a rate limits,
- eval dataset a poslední výsledek,
- známé failure modes,
- bezpečnostní a právní klasifikaci.

### 15.2 AI quality gate

AI změna je `10/10` pouze pokud má reprezentativní evaluaci pro:

- správnost a relevanci,
- situační vhodnost,
- jazykovou přirozenost,
- konzistenci tónu,
- bezpečnostní polaritu,
- odmítnutí nebezpečných požadavků,
- míru nepravdivých tvrzení,
- opakování a diverzitu,
- kulturní a jazykové segmenty,
- manipulativnost a nepřiměřenou autoritu,
- prompt injection a data leakage,
- latency, dostupnost a cenu.

### 15.3 NoDrama specifické AI principy

Výstup musí být:

- empatický, ne manipulativní,
- praktický, ne obecný,
- přirozený, ne robotický,
- bezpečný, ne moralizující,
- respektující hranice, sebeúctu a autonomii uživatele,
- transparentní v nejistotě,
- a ovladatelný uživatelem.

NoDrama nesmí:

- předstírat psychologickou, právní nebo zdravotní autoritu,
- podporovat nátlak, stalking, vydírání nebo zneužití,
- skrývat nejistotu modelu,
- ani ukládat citlivé konverzace bez jasného účelu a kontroly uživatele.

### 15.4 AI lifecycle

Povinný cyklus:

```text
GOVERN
→ MAP
→ MEASURE
→ MANAGE
→ MONITOR
→ INCIDENT_RESPONSE
→ RETIRE
```

Modelová změna, prompt změna, změna RAG zdroje nebo routing změna jsou produktové změny a vyžadují regresní evaluaci.

---

## 16. UX, CONTENT DESIGN A ACCESSIBILITY

### 16.1 Přístupnost

Výchozím cílem je WCAG 2.2 úroveň AA pro relevantní uživatelské rozhraní.

Povinně ověřuj:

- klávesnicové ovládání,
- focus order a viditelnost focusu,
- kontrast,
- popisky a chybové zprávy,
- screen-reader význam,
- velikost a dostupnost ovládacích cílů,
- responzivitu,
- zoom a reflow,
- reduced motion,
- přístupnou autentizaci,
- a kritické cesty na reprezentativních zařízeních.

Automatický accessibility test není náhradou manuálního a uživatelského ověření.

### 16.2 Content design

Veřejný text musí být:

- přesný,
- stručný,
- jazykově přirozený,
- konzistentní,
- neklamavý,
- bez interního žargonu,
- a správně lokalizovaný.

Loading, empty, success, warning a error stavy jsou součást produktu, ne vedlejší práce.

### 16.3 Zakázané vzory

Zakázány jsou:

- dark patterns,
- skryté poplatky,
- falešná urgence,
- zavádějící potvrzení,
- předem zaškrtnutý souhlas bez legitimního důvodu,
- záměrně obtížné zrušení,
- a UX, které nutí uživatele sdílet více dat, než je potřebné.

---

## 17. MONETIZACE A EKONOMICKÁ DISCIPLÍNA

Monetizace musí posilovat důvěru, ne ji spotřebovávat.

Povinné principy:

- ceny a jednotky musí být srozumitelné,
- kredity, limity a expirace musí být přesné,
- billing operace musí být idempotentní a auditovatelné,
- selhání nesmí vést k dvojímu účtování nebo dvojímu entitlementu,
- refundy a reversals musí mít definovaný proces,
- bezpečnostní funkce nesmějí být záměrně skryty za paywall,
- uživatel musí rozumět tomu, co kupuje,
- a obchodní metrika nesmí obejít safety nebo privacy guardrail.

Každá placená schopnost musí mít:

- jednotkovou ekonomiku,
- nákladový strop,
- abuse model,
- support dopad,
- a vypínací mechanismus.

---

## 18. EXPERIMENTY A MĚŘENÍ

Experiment není omluva pro náhodnou změnu.

Před spuštěním musí existovat:

- hypotéza,
- primární metrika,
- guardrail metriky,
- cílový segment,
- minimální délka nebo rozhodovací pravidlo,
- stop podmínka,
- rizika,
- rollback,
- a pravidlo interpretace.

Zakázáno:

- vybírat metriku až po výsledku,
- opakovaně kontrolovat výsledek bez statistického plánu,
- ignorovat negativní segmenty kvůli celkovému průměru,
- optimalizovat kliknutí na úkor uživatelského výsledku,
- nebo experimentovat na citlivých bezpečnostních funkcích bez zvláštního review.

Povinné vrstvy metrik:

- uživatelský outcome,
- leading behavior,
- kvalita a safety,
- spolehlivost,
- náklady,
- obchodní výsledek,
- a negativní dopady.

---

## 19. OPEN SOURCE, DEPENDENCIES A SUPPLY CHAIN

Nová závislost musí mít doloženo:

- konkrétní potřebu,
- porovnání s existujícím stackem,
- aktivitu údržby,
- licenci,
- známé zranitelnosti,
- transitive dependency dopad,
- velikost a runtime náklady,
- možnost připnutí,
- provenance nebo integritu distribuce,
- a removal plan.

Povinné supply-chain cíle:

- lockfile,
- deterministická instalace,
- SBOM podle rozsahu,
- checksumy a provenance artefaktů,
- oddělený build a release authority,
- minimální CI oprávnění,
- pinning kritických actions a nástrojů,
- kontrola licencí a původu převzatého kódu.

Nový framework není automaticky pokrok.

---

## 20. DATA GOVERNANCE

Každý datový tok musí mít:

- vlastníka,
- zdroj,
- účel,
- klasifikaci citlivosti,
- právní základ podle použitelného práva,
- retenční dobu,
- přístupová pravidla,
- auditní stopu,
- kvalitu a validaci,
- a plán výmazu nebo archivace.

### 20.1 Datové invarianty

- Peněžní, kreditní a entitlement operace musí být atomické a idempotentní.
- Analytika nesmí měnit zdroj pravdy transakčního systému.
- Cache nesmí být jediným zdrojem pravdy.
- Lokální fallback nesmí být tajně použit v produkci.
- Migrace nesmí být označena za bezpečnou bez zálohy, dry-runu a ověření obnovy podle rizika.

---

## 21. INCIDENTY, ROLLBACK A DISASTER RECOVERY

### 21.1 Incidentní režim

Při incidentu má prioritu:

1. ochrana lidí a dat,
2. zastavení škody,
3. obnovení bezpečné služby,
4. zachování důkazů,
5. komunikace,
6. root-cause analýza,
7. trvalé odstranění příčiny.

### 21.2 Postmortem

Postmortem musí obsahovat:

- časovou osu,
- uživatelský dopad,
- detekci,
- technickou a systémovou příčinu,
- přispívající podmínky,
- co fungovalo a nefungovalo,
- konkrétní action items,
- vlastníky a termíny,
- a kontrolu opakování.

Postmortem nesmí být nástrojem hledání viníka.

### 21.3 Recovery důkaz

Backup bez restore testu je `UNVERIFIED_BACKUP`.

Disaster recovery je ověřené pouze po realistickém restore drillu s:

- RPO,
- RTO,
- integritou obnovených dat,
- obnovením konfigurace a secrets,
- smoke testem,
- a uloženým reportem.

---

## 22. DEFINITION OF DONE PRO PRODUKTOVÝ ŘEZ

Řez není uzavřen, dokud relevantní části neobsahují:

### Produkt

- doložený problém,
- cílového uživatele,
- očekávaný outcome,
- metriky a guardraily,
- product simplicity review.

### Rozhodnutí

- varianty,
- kritéria,
- rozhodnutí,
- vlastníka,
- trigger pro přehodnocení.

### Realizace

- přesný diff,
- testy,
- build,
- security a privacy kontrolu,
- dokumentaci,
- rollback.

### Provoz

- rollout,
- observabilitu,
- SLO nebo provozní očekávání,
- incidentní a recovery postup.

### Důkazy

- commit nebo artifact ID,
- test report,
- checksum/provenance podle rozsahu,
- runtime důkaz podle fáze,
- outcome měření nebo plán jeho získání.

### Stav

Povinný závěr:

```text
STATUS:
SCOPE:
OVERALL_SCORE:
USER_VALUE_SCORE:
SIMPLICITY_SCORE:
SAFETY_PRIVACY_SCORE:
ARCHITECTURE_SCORE:
IMPLEMENTATION_SCORE:
VERIFICATION_SCORE:
RELIABILITY_SCORE:
OPERABILITY_ROLLBACK_SCORE:
ECONOMICS_SCORE:
AUDITABILITY_SCORE:
VERIFIED:
NOT_VERIFIED:
CHANGED:
RISKS:
ROLLBACK:
NEXT_SAFE_STEP:
```

---

## 23. VÝJIMKY, DLUH A EXPIRACE

Každý dluh musí mít:

- typ,
- závažnost,
- dopad,
- vlastníka,
- termín,
- kompenzační opatření,
- trigger eskalace.

Kritický bezpečnostní, privacy nebo datový dluh blokuje produkční release, pokud není explicitně přijat oprávněnou autoritou a právně i technicky obhajitelný. Ani přijatá výjimka neumožňuje tvrdit `10/10`.

Výjimky se přezkoumávají nejpozději při:

- změně souvisejícího systému,
- incidentu,
- release,
- změně právního nebo threat prostředí,
- nebo dosažení data expirace.

---

## 24. AUDITOVATELNOST CELÉHO ŽIVOTNÍHO CYKLU

Git je důležitý, ale nestačí.

Úplná auditní stopa musí podle rizika spojit:

- výzkumný důkaz,
- rozhodnutí,
- návrh,
- diff,
- review,
- testy,
- build,
- security výsledky,
- artefakt,
- nasazení,
- konfiguraci,
- runtime metriky,
- incidenty,
- uživatelský outcome,
- a ukončení nebo nahrazení funkce.

Každý důkaz musí být:

- dohledatelný,
- časově označený,
- spojený s verzí,
- chráněný proti nepozorované změně podle rizika,
- a zbavený secrets a nepřiměřených osobních údajů.

---

## 25. POVINNÉ ARTEFAKTY

Podle rozsahu používej:

- `PRODUCT_PROBLEM_BRIEF.md`,
- `PRODUCT_DECISION_RECORD.md`,
- `ADR-XXXX.md`,
- `THREAT_MODEL.md`,
- `PRIVACY_DATA_INVENTORY.md`,
- `AI_SYSTEM_CARD.md`,
- `EVALUATION_REPORT.md`,
- `RELEASE_RECEIPT.md`,
- `ROLLBACK_RUNBOOK.md`,
- `INCIDENT_REPORT.md`,
- `RETIREMENT_RECORD.md`.

Artefakt nesmí existovat pouze formálně. Musí obsahovat aktuální rozhodnutí a důkazy.

---

## 26. ŠABLONA ROZHODOVACÍHO ZÁZNAMU

```text
DECISION_ID:
TITLE:
DATE:
STATUS:
OWNER:
RISK_CLASS:

PROBLEM:
USER_OUTCOME:
CONSTRAINTS:

EVIDENCE:
UNKNOWNS:

OPTIONS:
0. DO_NOTHING:
1. OPTION_A:
2. OPTION_B:

DECISION_CRITERIA:
DECISION:
WHY:
REJECTED_OPTIONS:

SAFETY_PRIVACY_IMPACT:
RELIABILITY_IMPACT:
COST_IMPACT:
MIGRATION_IMPACT:

SUCCESS_METRIC:
GUARDRAILS:
STOP_CONDITION:
ROLLBACK_OR_EXIT:
REVIEW_TRIGGER:
APPROVALS:
```

---

## 27. ŠABLONA 10/10 SCORECARDU

```text
SCOPE:
RISK_CLASS=D0|D1|D2|D3|D4
COMMIT_OR_ARTIFACT:
ENVIRONMENT:
EVIDENCE_TIMESTAMP:
EVIDENCE_EXPIRY_OR_REVIEW_DATE:
ASSESSOR:
INDEPENDENT_REVIEWER:

1_USER_VALUE=0..10
GATE_DEFINITION:
EVIDENCE_ID:
EVIDENCE:

2_SIMPLICITY=0..10
GATE_DEFINITION:
EVIDENCE_ID:
EVIDENCE:

3_SAFETY_PRIVACY=0..10
GATE_DEFINITION:
EVIDENCE_ID:
EVIDENCE:

4_ARCHITECTURE=0..10
GATE_DEFINITION:
EVIDENCE_ID:
EVIDENCE:

5_IMPLEMENTATION=0..10
GATE_DEFINITION:
EVIDENCE_ID:
EVIDENCE:

6_VERIFICATION=0..10
GATE_DEFINITION:
EVIDENCE_ID:
EVIDENCE:

7_RELIABILITY=0..10
GATE_DEFINITION:
EVIDENCE_ID:
EVIDENCE:

8_OPERABILITY_ROLLBACK=0..10
GATE_DEFINITION:
EVIDENCE_ID:
EVIDENCE:

9_ECONOMICS=0..10
GATE_DEFINITION:
EVIDENCE_ID:
EVIDENCE:

10_AUDITABILITY=0..10
GATE_DEFINITION:
EVIDENCE_ID:
EVIDENCE:

OVERALL_SCORE=MIN(1..10)
SCORE_CALCULATION_STATE=VERIFIED|FAILED
BLOCKERS:
EXCEPTIONS:
REVIEWER:
REVIEW_INDEPENDENCE_STATE:
DECISION:
```

---

## 28. ANTI-PATTERNS, KTERÉ ÚSTAVA VÝSLOVNĚ ZAKAZUJE

- Feature factory bez měřeného outcome.
- AI funkce vytvořená jen proto, že AI je dostupná.
- Velký přepis bez migračního mostu.
- Průměrné skóre, které skryje kritickou slabinu.
- Security gate vypnutý kvůli termínu.
- „Dočasná“ výjimka bez expirace.
- Test, který pouze spustí funkci.
- Dashboard bez rozhodovacího použití.
- Observabilita, která loguje citlivý obsah.
- Roadmapa tvořená pouze požadavky stakeholderů bez uživatelského důkazu.
- KPI zaměněné za cíl produktu.
- Release bez rollbacku.
- Backup bez restore drillu.
- Dokumentace popisující budoucí stav jako současný.
- Dodavatelský lock-in bez exit plánu.
- Měření produktivity podle počtu commitů, ticketů nebo řádků kódu.
- Tvrzení „world-class“, „200 %“ nebo „dokonalé“ bez srovnávacího gate a evidence.
- D3/D4 self-review vydávané za nezávislé ověření.
- `PRODUCTION_READY` odvozené pouze z pre-release nebo CI výsledku.
- Aktualizace externího standardu bez verze, diffu a rozhodnutí o adopci.

---

## 29. REVIZE A ZMĚNA ÚSTAVY

Tato ústava se přezkoumává:

- po závažném incidentu,
- po zásadní změně produktu nebo business modelu,
- při změně použitelného práva nebo standardů,
- při vzniku nové AI nebo security rizikové třídy,
- nejméně jednou ročně,
- nebo když její pravidlo opakovaně brání bezpečnému doručení bez měřitelného přínosu.

Změna ústavy vyžaduje:

- důvod,
- přesný diff,
- analýzu oslabených a posílených ochran,
- schválení podle autority,
- verzi,
- datum účinnosti,
- a migrační dopad na existující procesy.

Ústava nesmí být změněna pouze proto, aby nevyhovující projektový stav vypadal vyhovující.

---

## 30. NORMATIVNÍ A INFORMATIVNÍ ZÁKLAD

Tato ústava byla navržena jako doplněk WORLD dokumentu a syntéza následujících rámců. Při konfliktu platí pořadí autority z článku 1.

| Zdroj | Použití v této ústavě |
|---|---|
| `WORLD_CLASS_SOFTWARE_DEVOPS_OPERATING_MODE.md` | pravdivost, source of truth, malé vratné změny, testy, rollback, audit |
| NIST SP 800-218 SSDF 1.1 — `FINAL` | normativní secure software development základ |
| NIST SP 800-218 Rev. 1 / SSDF 1.2 — `DRAFT` k 2026-07-26 | informativní směr; nenahrazuje SSDF 1.1 bez adopčního rozhodnutí |
| NIST SP 800-207 Zero Trust Architecture — `FINAL` | zákaz implicitní důvěry a resource-centric security |
| NIST AI RMF 1.0 — `CURRENT_BUT_UNDER_REVISION` a NIST AI 600-1 — `FINAL` | Govern, Map, Measure, Manage; GenAI risk management |
| OWASP ASVS 5.0.0 — `STABLE` | verziované testovatelné požadavky aplikační bezpečnosti |
| OWASP SAMM 2.x — `STABLE_MODEL` | měřitelná a risk-driven vyspělost secure SDLC |
| OWASP AISVS 1.0 — `LIVE_2026-06-24` | testovatelné bezpečnostní požadavky pro celý AI lifecycle |
| SLSA 1.2 — `APPROVED` | source/build provenance a supply-chain integrita |
| Google SRE | SLO, error budgets, incidenty, recovery a učení |
| DORA model ověřený 2026-07 | pět systémových delivery metrik včetně deployment rework rate |
| W3C WCAG 2.2 — `RECOMMENDATION_2024-12-12` | přístupnost a testovatelné success criteria |
| EDPB Guidelines 4/2019 — `FINAL_2020-10-20` | privacy by design and by default |
| EU Regulation 2024/1689 | risk-based AI governance pouze podle skutečné právní použitelnosti |
| GOV.UK Service Standard | uživatelské potřeby, jednoduchost, měření, bezpečnost, spolehlivost a otevřené standardy |

### 30.1 Auditovatelný registr oficiálních zdrojů

Stav ověřen k `2026-07-26`. Odkazy jsou informativní reference k přesně uvedeným verzím; jejich pozdější změna sama nemění tuto ústavu.

- NIST SSDF publications: `https://csrc.nist.gov/Projects/ssdf/publications`
- NIST SP 800-218 SSDF 1.1: `https://csrc.nist.gov/pubs/sp/800/218/final`
- NIST SP 800-218 Rev. 1 / SSDF 1.2 draft: `https://csrc.nist.gov/pubs/sp/800/218/r1/ipd`
- NIST Zero Trust Architecture: `https://csrc.nist.gov/pubs/sp/800/207/final`
- NIST AI RMF: `https://www.nist.gov/itl/ai-risk-management-framework`
- NIST AI 600-1 GenAI Profile: `https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence`
- OWASP ASVS: `https://owasp.org/www-project-application-security-verification-standard/`
- OWASP SAMM: `https://owasp.org/www-project-samm/`
- OWASP AISVS: `https://owasp.org/www-project-artificial-intelligence-security-verification-standard-aisvs-docs/`
- SLSA 1.2: `https://slsa.dev/spec/v1.2/`
- Google SRE error-budget policy: `https://sre.google/workbook/error-budget-policy/`
- DORA delivery metrics: `https://dora.dev/guides/dora-metrics/`
- WCAG 2.2: `https://www.w3.org/TR/WCAG22/`
- EDPB Guidelines 4/2019 final: `https://www.edpb.europa.eu/documents/guideline/guidelines-42019-on-article-25-data-protection-by-design-and-by-default_en`
- EU AI Act, Regulation 2024/1689: `https://eur-lex.europa.eu/eli/reg/2024/1689/`
- GOV.UK Service Standard: `https://www.gov.uk/service-manual/service-standard`

---

## 31. AUTOMATIZOVANÝ CONSTITUTION LINT

Kanonická ústava musí mít automatický read-only validator, který minimálně ověří:

- přítomnost Článku 0,
- správné pořadí autority,
- povinné pravdivostní stavy,
- pravidlo `OVERALL_SCORE = MIN(...)`,
- kalibraci skóre 0–10,
- zákaz `10/10` při `UNKNOWN`, `BLOCKED`, `FAILED` nebo výjimce,
- nezávislé review pro D3/D4,
- oddělení release authorization a post-release verification,
- rollback a recovery požadavky,
- AI, security, privacy, accessibility a supply-chain gates,
- verze externích rámců,
- a nepřítomnost nedokončených placeholderů.

Validator potvrzuje strukturu a vnitřní konzistenci dokumentu. Nedokazuje, že projekt jednotlivá pravidla skutečně plní.

---

## 32. ZÁVĚREČNÉ USTANOVENÍ

Nejvyšší kvalita nevzniká maximalizací množství funkcí, dokumentů, testů ani procesů.

Vzniká tím, že se správný problém vyřeší nejjednodušším bezpečným způsobem, změna se automatizovaně a důkazně ověří, její provozní dopad je měřitelný, uživatel získá skutečný výsledek a systém lze bez chaosu změnit, vrátit, obnovit nebo ukončit.

Proto platí:

```text
NO_EVIDENCE = NO_10_OUT_OF_10
NO_ROLLBACK = NO_RELEASE
NO_USER_OUTCOME = NO_PRODUCT_SUCCESS
NO_SAFETY = NO_AUTHORIZATION
NO_AUDIT_TRAIL = NO_COMPLETE
```

Když nejsou splněny důkazy, správný profesionální výsledek není optimistické tvrzení. Správný výsledek je přesný stav `UNKNOWN`, `PARTIALLY_VERIFIED`, `FAILED` nebo `BLOCKED` a nejrychlejší bezpečný krok k nápravě.
