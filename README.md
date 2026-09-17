# Savaitės planas (WeekMenu)

AI sudaromas savaitės maisto planas su receptais ir pirkinių sąrašu.
Pritaikyta dešimčiai mitybos grupių – nuo diabetikų iki sportininkų.

Mokyklinis projektas, statomas kaip tikras produktas.

---

## Kas tai per projektas

Anksčiau tai buvo **trys atskiri repozitoriumai**: React sąsaja, Express
API ir tuščias trečias. Dabar – **vienas Deno monorepo**, kurį galima
nemokamai paleisti Deno Deploy platformoje.

| | Buvo | Yra |
|---|---|---|
| Sąsaja | React (CRA) | Fresh 2 + Preact, renderinama serveryje |
| Serveris | Express (Node) | Fresh maršrutai (Deno) |
| Duomenų bazė | MongoDB Atlas | Deno KV (įmontuota į Deno) |
| Patiekalai | Įvesti ranka | Generuoja Claude, saugomi duomenų bazėje |
| Hostingas | Render (užmiega) | Deno Deploy (nemokamai) |
| Repozitoriumai | 3 | 1 |

---

## Greitas startas

Reikia [Deno](https://deno.com) 2.x.

```bash
git clone https://github.com/brutall100/WeekMenu.git
cd WeekMenu

cp .env.example .env     # AI raktą galima palikti tuščią
deno install             # priklausomybės
deno task seed           # pradiniai duomenys
deno task dev            # http://localhost:8000
```

Svetainė veikia **ir be Claude rakto** – tada rodomi 14 iš anksto įrašytų
patiekalų, o AI generavimo mygtukai išjungiami su paaiškinimu.

### Su AI

Įrašyk raktą iš [console.anthropic.com](https://console.anthropic.com) į `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Tada:

```bash
deno task generate                 # po 8 patiekalus kiekvienai kategorijai
deno task generate diabetikams 12  # arba tik vienai
```

---

## Struktūra

```
.
├── shared/            # tipai, kategorijos – naudoja ir front, ir back
├── backend/
│   ├── db/            # Deno KV: raktai, saugyklos, sėkla
│   ├── ai/            # Claude klientas, promptai, zod schemos
│   ├── services/      # planuotojas, pirkiniai, sesija, įpročio variklis
│   └── lib/           # ID, datos, klaidos
├── frontend/
│   ├── routes/        # puslapiai + API keliai
│   ├── islands/       # interaktyvūs komponentai
│   ├── components/    # serveryje renderinami komponentai
│   └── assets/        # dizaino sistema (styles.css)
├── tests/             # 20 testų
├── docs/              # architektūra, produktas, migracija, diegimas
├── .claude/           # skills ir agentai šio projekto darbui
└── legacy/            # senasis React + Express kodas (tik istorijai)
```

Front ir back gyvena atskiruose aplankuose, bet turi **vieną** `deno.json`.
Fresh'ui pasakoma, kur ieškoti, per `vite.config.ts`.

---

## Komandos

| Komanda | Ką daro |
|---|---|
| `deno task dev` | Kūrimo serveris su karštu perkrovimu |
| `deno task build` | Produkcijos versija į `_fresh/` |
| `deno task start` | Paleidžia sukurtą versiją |
| `deno task seed` | Pradinės kategorijos, patiekalai, istorijos |
| `deno task generate` | Sugeneruoja patiekalus su Claude |
| `deno task test` | 20 testų |
| `deno task check` | Formatas + lint + tipai |

---

## Statistika

Privatus skydelis `/statistika` rodo piltuvėlį: kiek žmonių atėjo, pradėjo
anketą, gavo planą, pagamino, grįžo kitą dieną ir kitą savaitę.

```bash
# .env faile
WEEKMENU_STATS_TOKEN=ilga-atsitiktine-eilute
```

Tada skydelis pasiekiamas adresu `/statistika?raktas=ilga-atsitiktine-eilute`.
**Be rakto puslapio nėra** – grąžinamas 404, o ne prisijungimo forma.

Renkam tik tai, kas atsako į klausimą „ar žmonės grįžta": anoniminį ID, kuris
jau reikalingas planui laikyti, ir datas. Jokio IP, jokios naršyklės, jokių
trečiųjų šalių. Todėl nereikia nei sausainių banerio, nei sutikimo lango.

---

## Dokumentacija

- [`docs/ARCHITEKTURA.md`](docs/ARCHITEKTURA.md) – kaip viskas sujungta
- [`docs/PRODUKTAS.md`](docs/PRODUKTAS.md) – kam tai ir kaip matuojam sėkmę
- [`docs/MIGRACIJA.md`](docs/MIGRACIJA.md) – kas ir kodėl pakeista
- [`docs/DIEGIMAS.md`](docs/DIEGIMAS.md) – kaip paleisti internete nemokamai

---

## Apribojimai

- Patiekalus generuoja AI. Jie **nėra** medicininė konsultacija.
  Esant ligai reikia gydytojo ar dietologo.
- Maistinė vertė apytikslė – priklauso nuo konkrečių produktų.
- Paskyros nėra: sesija laikoma sausainyje. Išvalius naršyklės duomenis
  planas dingsta.
