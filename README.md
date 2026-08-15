# joelgauchia.dev — personal portfolio

Personal portfolio built with [Astro](https://astro.build) (SSR) and
[Tailwind CSS v4](https://tailwindcss.com). Contact form submissions are
delivered with [Resend](https://resend.com) via an Astro Action.

## Getting started

```sh
npm install
npm run dev
```

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm run dev`     | Start the dev server at `localhost:4321`      |
| `npm run build`   | Build the SSR bundle to `./dist/`             |
| `npm run preview` | Preview the production build locally          |

## Environment

| Variable          | Required | Notes                                           |
| :---------------- | :------- | :---------------------------------------------- |
| `RESEND_API_KEY`  | Runtime  | Resend API key used by the contact form action   |

The key is read at **request time** (`getSecret` from `astro:env/server`), so it
is never baked into the build output. That means the running process — not the
build — needs it:

```sh
docker run -e RESEND_API_KEY=re_xxx -p 4321:4321 portfolio-joel
```

Without it the site still renders normally; only the contact form responds with
a "something went wrong" message.

## Design

The layout follows an editorial/print model rather than a card-based one:
hairline rules instead of boxes, effectively square corners, and a numbered
section index set in monospace.

Three typefaces, each with one job:

| Face             | Used for                                      |
| :--------------- | :-------------------------------------------- |
| Instrument Serif | Display type — the masthead, section and item titles |
| Inter            | Running prose                                 |
| JetBrains Mono   | Labels, indexes, dates, captions and stack lists (the `label` utility) |

Colours are warm paper and ink with a single vermillion accent. The backdrop in
`Layout.astro` draws the two margin rules that the content column aligns to,
plus a faint SVG grain.

## Theming

Light and dark themes are driven by a `.dark` class on `<html>`, set before
first paint by an inline script in `src/layouts/Layout.astro`. Colours are
defined once as semantic tokens in `src/styles/global.css` (`--color-bg`,
`--color-fg`, `--color-accent`, …) and flipped in the `:root.dark` block, so
components only ever reference `bg-bg`, `text-fg-muted`, `border-line`, etc.

## Deployment

`deploy.sh <project-name>` builds a `linux/amd64` image from the `Dockerfile`,
ships it to the remote host over SSH, and loads it there.
