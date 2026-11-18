# Battle sprites

Put battle sprites here as `<hero id>_front.png` and `<hero id>_back.png`, either already transparent
or on a plain white background, then run `npm run sprites`. The processed sprites go to `public/sprites/`
and are used on the battlefield and in the Herodex (click a sprite there to see it large).

- Forms: Bruce Banner is `bruce-banner_*`, Cloak is `cloak-form_*` (Dagger, the base form, uses `cloak-and-dagger_*`).
- Alternate genders: `<hero id>_female_front.png` (or `_male_`). `loki_female_*` is Lady Loki.
- Ultimate Forms: `monster-hulk_*`, `darkchylde_*`, `the-hood-gun-demon-form_*`, `kumiho_*`. Sprites for a
  form that doesn't exist yet are skipped until it's added, then picked up.
