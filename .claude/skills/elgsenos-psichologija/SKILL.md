---
name: elgsenos-psichologija
description: Naudok, kai projektuoji arba peržiūri bet kurią WeekMenu dalį, kuri turi paveikti žmogaus elgesį – onboarding'ą, serijas, priminimus, progreso rodiklius, tuščias būsenas, pranešimus, mygtukų tekstus arba bet ką, kas turi "kad žmogus grįžtų" tikslą. Taip pat naudok, kai reikia nuspręsti, ar funkcija nėra manipuliatyvi.
---

# Elgsenos psichologija WeekMenu projekte

Šis skill'as paverčia "noriu, kad žmonės naudotųsi" į konkrečius sprendimus
kode.

## Pagrindinė mintis

Žmonės nemeta maisto planavimo programėlių todėl, kad jos blogos. Meta todėl,
kad **pastanga ateina šiandien, o nauda – po savaitės**.

Todėl kiekvienas sprendimas vertinamas dviem klausimais:

1. **Ar sumažina pastangą dabar?** (mažiau paspaudimų, mažiau galvojimo)
2. **Ar priartina naudą arčiau dabar?** (matomas rezultatas tą pačią sekundę)

Jei funkcija nedaro nė vieno – ji dekoracija.

## Septyni principai, naudojami šiame projekte

### 1. Pirmoji nauda per 60 sekundžių

Žmogus turi gauti **kažką vertingo prieš** duodamas ką nors mainais. Todėl:
jokios registracijos, anoniminis sausainis, planas iškart po trijų klausimų.

Kode: `backend/services/session.ts`, `frontend/routes/api/profilis.ts` (profilio
išsaugojimas ir plano sudarymas – **vienas** veiksmas, ne du).

### 2. Mažas pirmas žingsnis

Ilga forma atrodo kaip darbas. Trys ekranai po vieną klausimą – kaip pokalbis.
Kiekvienas laukas turi protingą numatytą reikšmę: galima tris kartus spausti
„Toliau“ ir vis tiek gauti gerą planą.

Kode: `frontend/islands/OnboardingWizard.tsx`

### 3. Serija (streak), kuri nemeluoja

Serija auga **tik vieną kartą per dieną**. Kitaip žmogus per vieną vakarą
„nusipirktų“ 7 dienų seriją, ir skaičius nustotų ką nors reikšti. Serija
skaičiuojama **skaitant**, ne rašant – todėl išsaugota reikšmė niekada netampa
melu.

Kode: `backend/services/engagement.ts` → `registerCooked`, `currentStreak`

### 4. Tikslo gradientas: rodom „kiek liko“, ne „kiek padaryta“

„Liko 3“ veikia stipriau nei „padaryta 11 iš 14“, nes kuo arčiau tikslo, tuo
labiau žmogus stengiasi jį pabaigti.

Kode: `frontend/components/Progress.tsx`, `PlanBoard.tsx`

### 5. Kontrolė, ne įsakymas

„Kitas patiekalas“ mygtukas yra svarbesnis nei atrodo. Planas, kurio negali
keisti, jaučiasi kaip įsakymas. Žmonės, kurie bent kartą pakeičia patiekalą,
plano laikosi kur kas dažniau – jis tampa „jų“.

Kode: `backend/services/planner.ts` → `swapEntry`

### 6. Vienas kvietimas, vienas mygtukas

Kuo daugiau pasirinkimų, tuo didesnė tikimybė, kad žmogus nepasirinks nieko.
Todėl `buildNudge` visada grąžina **vieną** žinutę su **vienu** veiksmu.

Kode: `backend/services/engagement.ts` → `buildNudge`

### 7. Ketinimą paversti veiksmu

Didžiausia kliūtis tarp „noriu sveikai valgyti“ ir realaus valgymo – namie nėra
produktų. Todėl pirkinių sąrašas generuojamas automatiškai ir grupuojamas pagal
parduotuvės skyrius, o ne pagal patiekalus.

Kode: `backend/services/shopping.ts`

## Etinės ribos – NEPERŽENGIAMOS

Šitos taisyklės yra svarbesnės už bet kokį naudojimo rodiklį. Jei funkcija
pažeidžia bent vieną – ji nedaroma, net jei „veiktų“.

| Draudžiama                                    | Kodėl                  | Ką darom vietoj to           |
| --------------------------------------------- | ---------------------- | ---------------------------- |
| Melagingas skubėjimas („liko 2 min!“)         | Melas                  | Tikra informacija arba nieko |
| Gėdinimas („vėl neparuošei?“)                 | Kaltė atstumia, neveda | „Sveikas sugrįžęs“           |
| Serijos praradimas kaip nesėkmė               | Baudžia už gyvenimą    | Duris atgal, ne priekaištą   |
| Suklastotas socialinis įrodymas               | Melas                  | Tik tikros istorijos         |
| Sunkiai randamas atsisakymas                  | Įkalinimas             | Aiškus ir greitas išėjimas   |
| Dirbtinis laukimas, kad atrodytų „protingiau“ | Vagystė iš žmogaus     | Greitis yra funkcija         |

**Testas prieš kiekvieną funkciją:** ar galėtum jos veikimą paaiškinti
naudotojui garsiai ir jis vis tiek ją naudotų? Jei ne – tai tamsus raštas.

## Kai rašai tekstą sąsajoje

- **Antraštė** – kas iš to žmogui, ne ką daro sistema. ❌ „Planas sugeneruotas“
  → ✅ „Savaitė paruošta“
- **Mygtukas** – veiksmažodis, kurį žmogus atlieka. ❌ „Pateikti“ → ✅ „Sudaryti
  mano planą“
- **Klaida** – kas nutiko + ką daryti. ❌ „Error 500“ → ✅ „Nepavyko išsaugoti.
  Pabandyk dar kartą.“
- **Tuščia būsena** – niekada tuščias ekranas. Visada paaiškinimas + vienas
  mygtukas.

## Kaip patikrinti, ar veikia

Kiekvienas psichologinis sprendimas turi būti **matuojamas**, o ne tikimas.
Rodikliai, kuriuos verta sekti (žr. `docs/PRODUKTAS.md`):

- kiek % pradėjusių anketą ją pabaigia (matuoja 1 ir 2 principus);
- kiek % gavusių planą pažymi bent vieną patiekalą (matuoja pirmąją naudą);
- kiek % grįžta 2-ą savaitę (matuoja serijas ir priminimus);
- vidutinis pakeistų patiekalų skaičius (matuoja 5 principą).

Jei rodiklis nejuda – sprendimas buvo prielaida, ne tiesa. Keičiam.

Visi šie rodikliai jau matuojami: `backend/services/analytics.ts` renka įvykius,
`/statistika` juos rodo. Prieš siūlant naują elgsenos funkciją **pirma pažiūrėk
į piltuvėlį** – ten matyti, kurioje vietoje žmonės iškrenta. Funkcija, taisanti
ne tą pakopą, yra švaistymas.
