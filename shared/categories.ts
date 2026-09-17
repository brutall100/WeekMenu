import type { Category } from "./types.ts";

/**
 * Pradinės kategorijos – tos pačios 10, kurios buvo senajame projekte,
 * tik dabar su taisyklėmis, kurias AI privalo gerbti.
 * `rules` keliauja tiesiai į promptą, todėl rašom jas kaip įsakymus.
 */
export const SEED_CATEGORIES: Omit<Category, "id">[] = [
  {
    slug: "diabetikams",
    name: "Diabetikams",
    emoji: "🩺",
    summary:
      "Stabilus cukraus lygis – lėti angliavandeniai ir pakankamai baltymų.",
    order: 1,
    rules: [
      "Vengti cukraus, baltų miltų, saldžių gėrimų ir saldžių vaisių sirupų.",
      "Kiekviename patiekale turi būti baltymų ar riebalų šaltinis, kad angliavandeniai virškintųsi lėčiau.",
      "Angliavandenių vienam patiekalui – ne daugiau 45 g.",
      "Pirmenybė – pilno grūdo kruopoms, ankštinėms, daržovėms.",
    ],
  },
  {
    slug: "nesciosioms",
    name: "Nėščiosioms",
    emoji: "🤰",
    summary: "Folio rūgštis, geležis ir kalcis – maistas dviem, bet protingai.",
    order: 2,
    rules: [
      "Jokios žalios ar neprakaitintos mėsos, žuvies, kiaušinių, nepasterizuoto pieno.",
      "Vengti didelių plėšrių žuvų (tuno, kardžuvės) dėl gyvsidabrio.",
      "Jokio alkoholio; kofeino – minimaliai.",
      "Kiekvieną dieną įtraukti geležies (ankštinės, liesa mėsa) ir folio rūgšties (tamsios lapinės daržovės) šaltinį.",
    ],
  },
  {
    slug: "sportininkams",
    name: "Sportininkams",
    emoji: "🏋️",
    summary:
      "Baltymai raumenims, angliavandeniai energijai, laikas aplink treniruotę.",
    order: 3,
    rules: [
      "Bent 25 g baltymų pagrindiniame patiekale.",
      "Aplink treniruotę – lengvai virškinami angliavandeniai.",
      "Kalorijos gali būti didesnės nei įprastai (2500–3200 kcal per dieną).",
    ],
  },
  {
    slug: "svorio-metimui",
    name: "Svorio metimui",
    emoji: "⚖️",
    summary: "Sotu, bet mažiau kalorijų – daug tūrio, baltymų ir skaidulų.",
    order: 4,
    rules: [
      "Patiekalas – iki 500 kcal, dienos suma apie 1500–1800 kcal.",
      "Daug daržovių ir skaidulų, kad būtų sotu.",
      "Riebalus naudoti saikingai, bet neišmesti visai.",
      "Jokių 'stebuklingų' ar badavimo patarimų.",
    ],
  },
  {
    slug: "vaikams",
    name: "Vaikams",
    emoji: "🧒",
    summary: "Linksma, spalvinga ir be kovos prie stalo.",
    order: 5,
    rules: [
      "Švelnus skonis, be aštrių prieskonių.",
      "Patiekalai, kuriuos galima valgyti rankomis arba kurie atrodo smagiai.",
      "Jokių smulkių kietų gabalėlių mažiems vaikams (užspringimo rizika).",
      "Paslėptos daržovės – privalumas.",
    ],
  },
  {
    slug: "vegetarams",
    name: "Vegetarams",
    emoji: "🥦",
    summary: "Be mėsos ir žuvies, bet su pilnaverčiais baltymais.",
    order: 6,
    rules: [
      "Jokios mėsos, paukštienos, žuvies ir jūros gėrybių.",
      "Baltymai – iš ankštinių, tofu, kiaušinių, pieno produktų.",
      "Derinti ankštines su grūdais, kad susidarytų pilnas aminorūgščių rinkinys.",
    ],
  },
  {
    slug: "be-glitimo",
    name: "Be glitimo",
    emoji: "🌾",
    summary: "Celiakija ar glitimo netoleravimas – nulis kompromisų.",
    order: 7,
    rules: [
      "Jokių kviečių, rugių, miežių, įprastų avižų, kuskuso, manų, duonos, makaronų iš kviečių.",
      "Naudoti ryžius, grikius, bolivinę balandą, kukurūzus, sertifikuotas be glitimo avižas.",
      "Įspėti apie paslėptą glitimą padažuose ir sultinio kubeliuose.",
    ],
  },
  {
    slug: "keto",
    name: "Ketogeninė dieta",
    emoji: "🥑",
    summary: "Mažai angliavandenių, daug riebalų.",
    order: 8,
    rules: [
      "Iki 10 g grynų angliavandenių vienam patiekalui.",
      "Riebalai – pagrindinis kalorijų šaltinis.",
      "Jokių grūdų, bulvių, cukraus, saldžių vaisių.",
    ],
  },
  {
    slug: "pagyvenusiems",
    name: "Pagyvenusiems",
    emoji: "👵",
    summary: "Minkšta, lengvai virškinama, bet maistinga.",
    order: 9,
    rules: [
      "Minkšta tekstūra, lengva kramtyti ir virškinti.",
      "Pakankamai baltymų (raumenų netekčiai stabdyti) ir kalcio bei vitamino D.",
      "Saikingai druskos.",
    ],
  },
  {
    slug: "be-alergenu",
    name: "Be alergenų",
    emoji: "🚫",
    summary: "Be pieno, riešutų ir kiaušinių – saugu jautriems.",
    order: 10,
    rules: [
      "Jokių pieno produktų, riešutų, žemės riešutų, kiaušinių.",
      "Aiškiai įvardinti kiekvieną ingredientą – jokių neapibrėžtų 'padažų'.",
      "Siūlyti pakaitalus (augalinis pienas, aquafaba vietoj kiaušinio).",
    ],
  },
];
