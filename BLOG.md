# How to write a blog post

Add an object to the array in `posts.json`:

```json
[
  {
    "id": "my-post-slug",
    "title": "My Post Title",
    "author": "Paris Mollo",
    "date": "2026-09-06",
    "summary": "One or two sentences shown on the blog listing page.",
    "content": [
      {
        "type": "paragraph",
        "text": "The opening paragraph can include an [external link](https://example.com)."
      },
      {
        "type": "heading",
        "text": "A section heading"
      },
      {
        "type": "image",
        "src": "post-assets/example.png",
        "alt": "A concise description of the image.",
        "caption": "An optional visible caption.",
        "source": "Source name",
        "sourceUrl": "https://example.com/source",
        "width": 1200,
        "height": 800
      }
    ]
  }
]
```

## Post fields

- `id`: unique URL slug with no spaces.
- `title`: article heading and browser title.
- `author`: optional author name displayed below the title.
- `date`: publication date in `YYYY-MM-DD` format. Posts are sorted newest first.
- `summary`: short preview shown on the blog listing page.
- `content`: ordered list of article content blocks.

## Content blocks

### Paragraph

```json
{
  "type": "paragraph",
  "variant": "intro",
  "text": "Paragraph text with an optional [link](https://example.com)."
}
```

Paragraphs support external Markdown-style links and `**bold text**`. Links open in a new browser tab. Omit `variant` for a standard paragraph or use `"intro"` for an introductory callout. To mark only part of a paragraph, add a `highlight` field containing the exact text that should receive the standard yellow highlight treatment. Set `numberedNotes` to `true` to render inline numeric markers such as `(1)` in the handwritten annotation style.

### Heading

```json
{
  "type": "heading",
  "text": "Section heading"
}
```

Headings render as level-two headings beneath the article title.

### List

```json
{
  "type": "list",
  "ordered": true,
  "items": [
    "First item with an optional [link](https://example.com).",
    "Second item."
  ]
}
```

Set `ordered` to `true` for a numbered list. Omit it or set it to `false` for a bulleted list. List items support the same external Markdown-style links as paragraphs.

### Image

```json
{
  "type": "image",
  "src": "post-assets/example.png",
  "alt": "A meaningful description for readers who cannot see the image.",
  "caption": "Optional caption shown below the image.",
  "source": "Source name",
  "sourceUrl": "https://example.com/source",
  "background": "light",
  "width": 1200,
  "height": 800
}
```

Use a path relative to the website root. Always provide accurate `alt`, `width`, and `height` values. Use `source` for the attribution label and add `sourceUrl` when an exact public source page is available. The dimensions preserve layout while the image loads. Images are responsive and load lazily.

## Legacy body format

Older posts may still use a `body` string. Blank-line-separated paragraphs and headings beginning with `#` or `##` remain supported, but new posts should use structured `content` blocks.
