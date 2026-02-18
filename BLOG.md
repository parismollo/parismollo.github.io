# How to write a blog post

Open `posts.json` and add an object to the array:

```json
[
  {
    "id": "my-post-slug",
    "title": "My Post Title",
    "date": "2026-02-18",
    "summary": "One or two sentences shown on the blog listing page.",
    "body": "Full content of the post goes here."
  }
]
```

## Fields

- `id` — URL slug, no spaces (e.g. `"building-rsafe"`). Must be unique.
- `title` — displayed as the post heading.
- `date` — format `YYYY-MM-DD`. Posts are sorted newest first.
- `summary` — short preview shown on the blog listing page.
- `body` — full post content. Supports basic markdown:

## Body formatting

Separate blocks with a blank line (`\n\n`).

- `# Heading` → `<h1>`
- `## Heading` → `<h2>`
- Any other block → paragraph

Since the body is a JSON string, use `\n` for newlines:

```json
"body": "Intro paragraph.\n\n## A Section\n\nAnother paragraph."
```
