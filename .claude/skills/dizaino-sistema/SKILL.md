---
name: dizaino-sistema
description: Naudok, kai kuri arba keiti bet kokį WeekMenu vaizdinį elementą – puslapį, komponentą, spalvą, tarpą, šriftą, mygtuką, formą ar tuščią būseną. Taip pat naudok prieš pridedant naują CSS klasę arba naują spalvą, kad nesikurtų antra dizaino sistema šalia esamos.
---

# WeekMenu dizaino sistema

## Vienintelė tiesa – `frontend/assets/styles.css`

Visos spalvos, apvalinimai ir šriftai gyvena `@theme` bloke. **Komponente
niekada nerašom `#d96a3f` ar `bg-orange-500`** – rašom `bg-brand`.

Priežastis paprasta: kai spalva pakartota 40 vietų, jos pakeisti nebeįmanoma.
Kai ji viena – visos svetainės nuotaiką pakeiti trimis eilutėmis.

### Spalvų vardai ir kada kurią

| Žetonas          | Kam                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------- |
| `brand`          | Pagrindinis veiksmas, akcentai. Šiltas paprikos oranžinis – maistas turi atrodyti šiltas. |
| `brand-soft`     | Fonas po akcentu (kvietimai, pažymėti pasirinkimai)                                       |
| `brand-strong`   | Tekstas ant šviesaus brand fono, hover būsena                                             |
| `fresh`          | Tik „pavyko“: progresas, pažymėta, sėkmė                                                  |
| `fresh-soft`     | Fonas po sėkmės pranešimu                                                                 |
| `surface`        | Puslapio fonas                                                                            |
| `surface-raised` | Kortelės, iškilę paviršiai                                                                |
| `line`           | Rėmeliai, skirtukai                                                                       |
| `ink`            | Pagrindinis tekstas                                                                       |
| `ink-soft`       | Antrinis tekstas, paaiškinimai                                                            |

**Taisyklė:** `fresh` niekada nenaudojamas dekoracijai. Jei pamatai žalią – turi
reikšti, kad kažkas pavyko.

### Tamsi tema

Kiekvienas naujas žetonas turi būti apibrėžtas **trijose vietose**: `@theme`,
`@media (prefers-color-scheme: dark)` ir `:root[data-theme="dark"]`. Praleidus
vieną – tamsioje temoje atsiras nematomas tekstas.

## Komponentų taisyklės

1. **Trečias kartas → komponentas.** Jei tą patį stilių rašai trečią kartą, jam
   vieta `frontend/components/ui.tsx`.
2. **Mobilusis pirmas.** Rašom bazinį stilių telefonui, `sm:` ir `lg:` prideda.
   Šoninis tarpas visada 16px (`px-4`). Horizontalaus slinkimo puslapyje nebūna.
3. **Apvalinimas:** kortelės `rounded-card`, mygtukai `rounded-full`, maži
   elementai `rounded-lg`. Kitų variantų nėra.
4. **Šriftai:** antraštės `font-display` (serif), tekstas – numatytasis.
   Serifinė antraštė daro projektą panašų į receptų knygą, ne į admin skydelį.

## Prieinamumas – privaloma

- `:focus-visible` žiedas **niekada nenuimamas**. Yra žmonių, kurie naršo
  klaviatūra.
- Kiekvienas mygtukas – `<button>`, kiekviena nuoroda – `<a>`. Ne atvirkščiai.
- `aria-label` ten, kur tekstas tik piktograma.
- Progreso juostai – `role="progressbar"` su `aria-valuenow`.
- Animacijos gerbia `prefers-reduced-motion` (jau įrašyta globaliai).
- Kontrastas: `ink` ant `surface` ir `ink-soft` ant `surface` – tikrinam
  abiejose temose.

## Tuščios būsenos

Tuščias ekranas – greičiausias būdas prarasti žmogų. Kiekviena tuščia būsena
naudoja `<EmptyState>` ir turi **visus keturis**: emoji, antraštę, vieną
paaiškinimo sakinį ir vieną mygtuką.

## Ko šiame projekte NEDAROM

- ❌ Nuotraukų iš stock bankų. Emoji ir tipografika – sąžiningiau ir greičiau.
- ❌ Modalinių langų, kuriuos reikia uždaryti prieš naudojant puslapį.
- ❌ Karuselių. Niekas jų neslenka.
- ❌ Animacijų ilgesnių nei 500 ms.
- ❌ Antros spalvų sistemos „tik šitam vienam puslapiui“.

## Prieš įrašant naują komponentą – trys klausimai

1. Ar toks jau yra `ui.tsx`?
2. Ar naudoju tik dizaino žetonus (jokių `#hex`, jokių `bg-orange-*`)?
3. Ar veikia 390px pločio ekrane ir tamsioje temoje?

Jei bent vienas „ne“ – taisom prieš commit'ą.
