# Site

Facts about this client site that the code doesn't show. Fill in when the repo is created from the template, keep
current. (Template placeholders below.)

## Client
- Client / firm: _TBD_
- Domain(s): _TBD_
- Language(s): `site.lang` in `cms.config.json` (_TBD_)
- Contacts / who edits the site: _TBD_

## Requirements & decisions
- _e.g. customer accounts off (publicAuth false): no member area_
- _e.g. legal notice built from Configuration (template `legal`)_

## Site-specific code
| What | Where | Why |
|------|-------|-----|
| Call-to-action block (example from the starter) | `src/blocks/cta/` | _keep or remove_ |
| Legal notice template | `src/templates/legal.vue` | firm, contact, VAT ID, register from Configuration |
| Footer with social media | `src/overrides/SiteFooter.vue` | socials group from `cms.config.json` |

## Deployment
- Host / provider: _TBD_
- How images are built and rolled out: _TBD_ (images: `frontend`, `renderer`, `api` from the `Dockerfile`)
- Secrets (.env values) live in: _TBD_
- Backups (Postgres + media volume): _TBD_
