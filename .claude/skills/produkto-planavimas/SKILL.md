---
name: produkto-planavimas
description: Naudok, kai reikia suplanuoti naują WeekMenu funkciją, nuspręsti, ką daryti toliau, atrinkti idėjas iš ilgo sąrašo, suskaidyti didelį darbą į žingsnius arba įvertinti, ar idėja apskritai verta darbo. Taip pat naudok prieš pradedant bet kurį darbą, kuris užtruktų ilgiau nei vieną sesiją.
---

# Kaip planuojam WeekMenu

Mokyklinis projektas, bet sprendimai priimami kaip produkte. Skirtumas
paprastas: produkte klausiama ne „ar galiu tai padaryti“, o **„ar dėl to kas
nors elgsis kitaip“**.

## Etapas 1 – Idėjų žvejyba (skirta kiekybei)

Tikslas – **daug** idėjų, ne geros idėjos. Vertinimas draudžiamas.

Keturi kampai, iš kurių visada verta pažvelgti:

1. **Skausmas** – kur žmogus dabar kenčia? (stovi prie šaldytuvo; perka
   atsitiktinai; pamiršta, ką planavo)
2. **Nutrūkimas** – kurioje vietoje žmonės pasitraukia? (ilga anketa; tuščias
   puslapis; planas, kurio negali pakeisti)
3. **Gretimos sritys** – ką daro Duolingo, Strava, Spotify? Ką iš to galima
   perkelti?
4. **Absurdas** – tyčia kvaila idėja („planą sudaro vaikas“, „patiekalai tik iš
   3 produktų“). Absurdiškos idėjos dažnai turi gerą branduolį.

Norma: **bent 15 idėjų**, prieš vertinant nors vieną.

## Etapas 2 – Atranka (RICE, supaprastintas)

Kiekviena idėja gauna tris skaičius nuo 1 iki 5:

- **Poveikis** – kiek stipriai pakeis žmogaus elgesį?
- **Pasitikėjimas** – ar tikrai žinom, kad taip bus? (nuojauta = 1, matuota = 5)
- **Darbas** – kiek užtruks? (čia **mažiau yra geriau**)

`Balas = Poveikis × Pasitikėjimas ÷ Darbas`

Dirbam su viršutiniais trim. Visa kita – į `docs/IDEJOS.md`, ne į kodą.

## Etapas 3 – Aprašymas prieš kodą

Kiekviena funkcija prieš rašant kodą aprašoma **penkiais sakiniais**:

1. **Kam** – kuriam žmogui ir kurioje situacijoje?
2. **Vietoj ko** – ką jis daro dabar be šios funkcijos?
3. **Kas pasikeis** – koks konkretus elgesys taps kitoks?
4. **Kaip sužinosim** – kuris skaičius turi pajudėti?
5. **Mažiausia versija** – kas yra mažiausias dalykas, kuris jau duotų atsakymą?

Jei 4-o sakinio parašyti neįmanoma – funkcija nedaroma. Neišmatuojamas tikslas
yra tik nuomonė.

## Etapas 4 – Skaidymas

Darbas skaidomas **vertikaliai**, ne horizontaliai.

- ❌ Blogai: „1. visi tipai, 2. visa duomenų bazė, 3. visas UI“ (po dviejų
  žingsnių nieko neveikia)
- ✅ Gerai: „1. vienas veikiantis atvejis nuo mygtuko iki duomenų bazės, 2.
  antras atvejis, 3. kraštiniai atvejai“ (po pirmo žingsnio jau galima parodyti)

Kiekvienas žingsnis turi baigtis kažkuo, ką galima **paleisti ir pamatyti**.

## Etapas 5 – Kas gali nepavykti

Prieš pradedant – trys rizikos ir ką su jomis darysim:

| Rizika                        | Ženklas, kad pasitvirtino | Atsarginis planas |
| ----------------------------- | ------------------------- | ----------------- |
| Techninė                      | ...                       | ...               |
| Elgsenos (žmonės nenaudos)    | ...                       | ...               |
| Kaštų (per brangu / per lėta) | ...                       | ...               |

## Šio projekto ribos

- **Nemokamas hostingas.** Deno Deploy + Deno KV. Jokių sprendimų, kuriems
  reikia nuolat veikiančio serverio ar mokamos duomenų bazės.
- **AI kviečiamas tik kai trūksta.** Sugeneruota vieną kartą – guli duomenų
  bazėje ir tarnauja visiems. Kiekvienas kvietimas kainuoja pinigus.
- **Veikia be AI rakto.** Svetainė su tuščiu `ANTHROPIC_API_KEY` privalo veikti
  ir atrodyti gyva. Mokytojas neturės rakto.
- **Be registracijos.** Kol nėra tikros priežasties (sinchronizacijos tarp
  įrenginių), sausainio pakanka.
