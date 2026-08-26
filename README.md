# eduvia-web

Статичний сайт для `geteduvia.com`. Тимчасово хоститься на GitHub Pages і віддає юридичні
документи за тими самими шляхами, на які посилаються App Store і самі документи:

| Маршрут | Документ |
| --- | --- |
| `/` | мінімальний лендінг зі списком документів |
| `/privacy/` | Privacy Policy (EN) |
| `/privacy/de/` | Datenschutzerklärung (DE) |
| `/terms/` | Terms of Use (EN) |
| `/terms/de/` | Nutzungsbedingungen (DE) |
| `/impressum/` | Impressum (§ 5 DDG, лише німецькою) |
| `/third-party-notices/` | Open-source компоненти |

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

Збірка: `build.mjs` рендерить markdown через `marked` у спільний layout,
стилі в `assets/style.css`. Жодного фреймворка.

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
