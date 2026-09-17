# Diegimas į Deno Deploy (nemokamai)

## Kodėl Deno Deploy

- Nemokamas lygis be kredito kortelės.
- **Deno KV įskaičiuota** – nereikia atskiros duomenų bazės.
- Neužmiega (skirtingai nei senasis Render nemokamas lygis).

## Žingsniai

### 1. Nukreipk repozitoriumą

1. Eik į [dash.deno.com](https://dash.deno.com) ir prisijunk per GitHub.
2. **New Project** → pasirink `brutall100/WeekMenu`.
3. Šaka: `main` (arba ta, kurią nori paleisti).

### 2. Nustatyk komandas

| Laukas | Reikšmė |
|---|---|
| Framework preset | Fresh |
| Install command | `deno install` |
| Build command | `deno task build` |
| Entrypoint | `_fresh/server.js` |

### 3. Aplinkos kintamieji

Projekto nustatymuose → **Environment Variables**:

| Vardas | Reikšmė | Būtinas? |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Ne. Be jo svetainė veikia, AI mygtukai išjungti. |
| `WEEKMENU_AI_MODEL` | `claude-opus-5` | Ne |
| `WEEKMENU_AI_EFFORT` | `medium` | Ne |

⚠️ **Rakto niekada nerašom į kodą.** `.env` yra `.gitignore` sąraše.

### 4. Duomenų bazė

Nieko daryti nereikia. `Deno.openKv()` be argumento Deno Deploy platformoje
automatiškai gauna KV. Pradinė sėkla pasėjama per pirmą užklausą
(`frontend/main.ts`).

### 5. Patikrink

Atidaryk gautą adresą ir pereik:

- [ ] pagrindinis puslapis atsidaro
- [ ] `/kategorijos` rodo 10 kategorijų
- [ ] `/pradzia` anketa veikia iki galo
- [ ] `/planas` rodo savaitę
- [ ] „Pagaminau“ pakeičia serijos skaičių
- [ ] `/pirkiniai` rodo sąrašą
- [ ] neegzistuojantis adresas grąžina 404

## Vietinis paleidimas kaip produkcijoje

```bash
deno task build
deno task start
```

## Dažnos klaidos

| Klaida | Priežastis | Sprendimas |
|---|---|---|
| `Deno.openKv is not a function` | trūksta `--unstable-kv` | jau įrašyta į `deno task start` |
| Tuščios kategorijos | sėkla nepasėta | `deno task seed` |
| „AI generavimas išjungtas“ | nėra rakto | įrašyk `ANTHROPIC_API_KEY` |
| Build krenta dėl `legacy/` | senas kodas tikrinamas | `deno.json` → `exclude` (jau sutvarkyta) |

## Kaina

| Dalis | Kaina |
|---|---|
| Deno Deploy nemokamas lygis | 0 € |
| Deno KV nemokamas lygis | 0 € |
| Claude API | ~pora centų už kategorijos patiekalų rinkinį; sugeneruota kartą – naudojama visiems |

Be `ANTHROPIC_API_KEY` visas projektas kainuoja **0 €**.
