const POSTS_URL = 'posts.json';

// Render the blog listing page
async function renderBlogList() {
    const container = document.getElementById('blog-list');
    if (!container) return;

    const res = await fetch(POSTS_URL);
    const posts = await res.json();

    // Sort newest first
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = posts.map(post => `
        <a href="post.html?id=${post.id}" class="blog-card">
            <span class="blog-card-date">${formatDate(post.date)}</span>
            <h2 class="blog-card-title">${post.title}</h2>
            <p class="blog-card-summary">${post.summary}</p>
            <span class="blog-card-read">Read &rarr;</span>
        </a>
    `).join('');
}

// Render a single post page
async function renderPost() {
    const container = document.getElementById('post-content');
    if (!container) return;

    const id = new URLSearchParams(window.location.search).get('id');
    const res = await fetch(POSTS_URL);
    const posts = await res.json();
    const post = posts.find(p => p.id === id);

    if (!post) {
        container.innerHTML = '<p>Post not found.</p>';
        return;
    }

    document.title = `${post.title} — Paris Mollo`;

    container.innerHTML = `
        <p class="post-date">${formatDate(post.date)}</p>
        <h1 class="post-title">${post.title}</h1>
        <div class="post-body">${markdownToHtml(post.body)}</div>
    `;
}

// Minimal markdown: headings and paragraphs
function markdownToHtml(text) {
    return text
        .split('\n\n')
        .map(block => {
            if (block.startsWith('## ')) return `<h2>${block.slice(3)}</h2>`;
            if (block.startsWith('# '))  return `<h1>${block.slice(2)}</h1>`;
            return `<p>${block.replace(/\n/g, '<br>')}</p>`;
        })
        .join('\n');
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderBlogList();
    renderPost();
});
