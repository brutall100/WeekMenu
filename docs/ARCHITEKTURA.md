# Architektūra

## Bendras vaizdas

```
Naršyklė
   │
   │  HTML (renderinta serveryje) + maži JS „salos“
   ▼
frontend/routes/           ← puslapiai ir API keliai (Fresh)
   │
   ▼
backend/services/          ← logika: planuotojas, pirkiniai, įpročiai
   │
   ├──► backend/db/        ← Deno KV saugyklos
   │
   └──► backend/ai/        ← Claude API
```

**Taisyklė:** kiekvienas sluoksnis kalbasi tik su gretimu.
Puslapis niekada nesikreipia į KV tiesiogiai, o `services` nieko nežino
apie HTTP.

## Kodėl Fresh, o ne React SPA

| | Fresh | React SPA |
|---|---|---|
| Pirmas puslapio užkrovimas | HTML iškart | tuščias langas + JS |
| Google matomumas | veikia | reikia papildomų triukų |
| JS naršyklėje | tik „salos“ | visa programa |
| Front ir back | vienas projektas | du projektai |

Maisto planas – daugiausia skaitomas turinys. Renderinti serveryje čia
natūralu. Interaktyvios lieka tik keturios vietos (`frontend/islands/`).

## Kas yra „sala“ (island)

Fresh pagal nutylėjimą siunčia į naršyklę **nulį** JavaScript.
Į `islands/` įdėtas komponentas – vienintelė išimtis: jis „atgyja“ naršyklėje.

Šiame projekte tokių yra keturios:

| Sala | Kodėl reikia naršyklėje |
|---|---|
| `OnboardingWizard` | žingsniai keičiasi be perkrovimo |
| `PlanBoard` | pažymėjimas ir keitimas turi atsakyti iškart |
| `GenerateMealsButton` | rodo laukimo būseną |
| `StoryForm` | forma išsiskleidžia be perkrovimo |

⚠️ **Sala negali importuoti `backend/db` ar `backend/ai`.**
Tai patektų į naršyklės paketą kartu su API raktu.

## Duomenų bazė: Deno KV

Deno KV neturi lentelių. Ji turi tik **raktus ir reikšmes**, kaip didelis
žodynas. Raktas – masyvas, pvz. `["meal", "01J..."]`.

Visi raktai aprašyti vienoje vietoje: `backend/db/keys.ts`.

| Raktas | Reikšmė |
|---|---|
| `["category", id]` | Kategorija |
| `["category_by_slug", slug]` | kategorijos id (indeksas) |
| `["meal", id]` | Patiekalas |
| `["meal_by_category", catId, mealId]` | indeksas: kategorijos patiekalai |
| `["user", id]` | Naudotojas su profiliu |
| `["plan", userId, planId]` | Savaitės planas |
| `["plan_active", userId]` | kuris planas aktyvus |
| `["engagement", userId]` | serija, ženkliukai, skaičiai |
| `["story", id]` | Istorija |

### Kodėl reikia indeksų

SQL bazėje rašytum `WHERE categoryId = 'x'`. KV to nemoka – ji randa
tik pagal raktą. Todėl įrašant patiekalą įrašom **du** dalykus: patį
patiekalą ir po vieną indekso įrašą kiekvienai jo kategorijai.

Abu rašomi `kv.atomic()` viduje – arba abu, arba nė vieno.
Antraip atsirastų indeksas, rodantis į nesantį patiekalą.

### ULID vietoj UUID

ID generuojami ULID formatu (`backend/lib/id.ts`). ULID'ai rikiuojasi
pagal sukūrimo laiką, todėl `kv.list({ reverse: true })` grąžina
naujausius įrašus be jokio papildomo rikiavimo.

## AI: kada ir kiek kainuoja

Claude kviečiamas **tik kai sandėlyje trūksta patiekalų**
(`backend/services/catalog.ts`). Sugeneruota – įrašoma į KV ir tarnauja
visiems lankytojams. Antras žmogus tai pačiai kategorijai planą gauna
per milisekundes ir nemokamai.

Atsakymo forma garantuojama `output_config.format` su zod schema
(`backend/ai/schemas.ts`): modelis fiziškai negali grąžinti kitokio JSON.
Todėl nereikia nei `JSON.parse` su `try`, nei vilties, kad modelis
nepridės paaiškinimo prieš tekstą.

Pastovus sistemos promptas pažymėtas `cache_control: ephemeral` –
kartojantis tekstas apmokestinamas pigiau.

## Sesija be registracijos

Anoniminis ULID `HttpOnly` sausainyje (`backend/services/session.ts`).
Jokio el. pašto, jokio slaptažodžio.

Priežastis – ne tingumas, o skaičiai: registracijos forma yra ta vieta,
kur pasitraukia didžiausia dalis naujų lankytojų. Produktas rodomas
pirma, paskyros klausiama vėliau (arba niekada).

Kaina: išvalius naršyklės duomenis planas dingsta. Tai sąmoningas
kompromisas, aprašytas README apribojimuose.

## Klaidų tvarkymas

`AppError` (`backend/lib/errors.ts`) – klaida, kurią **saugu** parodyti
žmogui. Viskas kita virsta bendru „Kažkas nepavyko“, o tikroji priežastis
lieka serverio žurnale. Taip vidiniai keliai ir duomenų bazės struktūra
nepatenka į naršyklę.
