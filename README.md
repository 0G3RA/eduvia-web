# eduvia-web

Статичний сайт для `geteduvia.com`. Тимчасово хоститься на GitHub Pages і віддає юридичні
документи за тими самими шляхами, на які посилаються App Store і самі документи:

| Маршрут | Документ |
| --- | --- |
| `/` | лендінг українською (`templates/landing.html` + `content/landing.uk.json`) |
| `/privacy/` | Privacy Policy (EN) |
| `/privacy/de/` | Datenschutzerklärung (DE) |
| `/terms/` | Terms of Use (EN) |
| `/terms/de/` | Nutzungsbedingungen (DE) |
| `/impressum/` | Impressum (§ 5 DDG, лише німецькою) |
| `/third-party-notices/` | Open-source компоненти |
| `/delete-account/`, `/delete-account/de/` | видалення акаунта (форма шле на API) |
| `/contact/`, `/contact/de/` | контакт (форма шле на API) |

## Як оновити документи

Джерело правди — markdown у `content/`. Замінити файл, закомітити, запушити:
GitHub Action перебудує і задеплоїть сайт сам.

Перед публікацією заповнити плейсхолдери `[YYYY-MM-DD]` (Effective Date / Gültig ab /
Last updated) у всіх файлах `content/`.

## Локальна збірка

```bash
npm install
npm run build     # генерує dist/
npm run serve     # локальний перегляд
```

Збірка: `build.mjs` рендерить markdown через `marked` у спільну оболонку юридичних сторінок,
а лендінг збирає з `templates/landing.html` (плейсхолдери `{{ключ}}`, частини в `templates/partials/`)
і словника `content/landing.<мова>.json`. Стилі `assets/style.css`, скрипт `assets/site.js`,
шрифт Manrope лежить у `assets/fonts/` (жодних зовнішніх запитів). Жодного фреймворка.

- Ціни і пробний період: `PRICES` і `TRIAL_DAYS` у `build.mjs` (формат за локаллю: "9,99 €", англійською "€9.99").
- Мови лендінгу: список `LANGS` у `build.mjs`; мова збирається, лише коли є `content/landing.<код>.json`
  з усіма ключами з `landing.uk.json`. `/` = uk, інші на `/<код>/`, сербська `/sr/` з `lang="sr-Latn"`.
- Cookies і Meta Pixel: `META_PIXEL_ID` у `build.mjs`. Поки він порожній, банера, `cookies.js` і коду Meta
  немає. З ID банер з'являється, а піксель вантажиться лише після згоди на аналітику.

## Одноразове налаштування GitHub Pages

1. Створити репозиторій і запушити: `gh repo create 0G3RA/eduvia-web --private --source . --push`
   (Pages на приватному репо потребує платного плану; інакше `--public`).
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. Custom domain: `geteduvia.com` (+ Enforce HTTPS після видачі сертифіката).
4. DNS у реєстратора: `A`-записи apex-домену на IP GitHub Pages
   (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153),
   опційно `CNAME www -> 0g3ra.github.io`.

Поки DNS не переключений, сайт доступний на `https://0g3ra.github.io/eduvia-web/`
(у цьому режимі абсолютні шляхи `/privacy/` працюватимуть тільки з кастомним доменом,
тому домен варто підключити одразу).
