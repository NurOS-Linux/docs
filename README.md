# NurOS Docs

Documentation site for NurOS, built with Astro. Reads Markdown files from `docs/` without modifying them.

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run build` | Build site and index search |
| `npm run preview` | Serve built site from `dist/` |

Development is done via `npm run build && npm run preview` — search (Pagefind) only works in the built version.

## Adding documentation

Add a Markdown file to the appropriate directory under `docs/`. To group pages into a section, create `_category_.json`:

```json
{
  "label": "Section title",
  "position": 1
}
```

The site picks up new files automatically on the next build.

## Stack

- [Astro](https://astro.build) — static site generator
- [Pagefind](https://pagefind.app) — static search
