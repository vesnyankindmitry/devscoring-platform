# DevScoring Platform

Аналитическая платформа для оценки инвестиционной привлекательности регионов и земельных участков для девелоперских компаний РФ.

## Ссылки

- **Production (Cloudflare Pages)**: https://devscoring.pages.dev
- **Supabase Backend**: https://bxxehorsyeuztthyxrwg.supabase.co
- **GitHub Repo**: https://github.com/vesnyankindmitry/devscoring-platform

## Технологии

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL + Edge Functions)
- Cloudflare Pages

## Локальный запуск

```bash
npm install
npm run dev
```

## Деплой

Деплой на Cloudflare Pages происходит автоматически через GitHub Actions при пуше в ветку `master`.

Требуется добавить секрет `CLOUDFLARE_API_TOKEN` в настройках репозитория (Settings > Secrets > Actions).

## Функционал

1. **Бриф** — 3-шаговая форма для сбора данных о девелоперской компании
2. **Рейтинг регионов** — скоринг 85 регионов РФ по 27 параметрам, 8 блокам, 3 сегментам
3. **Карта** — интерактивная карта с земельными участками
4. **Скоринг участков** — 29 параметров для оценки земельных участков

## Структура БД

- `devscoring.regions` — 85 регионов РФ с демографическими и экономическими данными
- `devscoring.land_plots` — земельные участки (генерируются синтетически)
- `devscoring.brief_responses` — ответы на бриф
