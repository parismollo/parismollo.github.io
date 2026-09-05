const POSTS_URL = 'posts.json';

async function loadPosts() {
    const response = await fetch(POSTS_URL);
    if (!response.ok) {
        throw new Error(`Could not load posts (${response.status})`);
    }

    const posts = await response.json();
    if (!Array.isArray(posts)) {
        throw new Error('Post data must be an array');
    }

    return posts;
}

// Render the blog listing page
async function renderBlogList() {
    const container = document.getElementById('blog-list');
    if (!container) return;

    try {
        const posts = await loadPosts();
        posts.sort((a, b) => parseDate(b.date) - parseDate(a.date));

        container.innerHTML = posts.length === 0
            ? '<p class="blog-status">No posts yet. Check back soon.</p>'
            : posts.map(post => `
                <a href="post.html?id=${encodeURIComponent(post.id)}" class="blog-card">
                    <time class="blog-card-date" datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
                    <h2 class="blog-card-title">${escapeHtml(post.title)}</h2>
                    <p class="blog-card-summary">${escapeHtml(post.summary)}</p>
                    <span class="blog-card-read">Read &rarr;</span>
                </a>
            `).join('');
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="blog-status">Posts could not be loaded. Please try again.</p>';
    }
}

// Render a single post page
async function renderPost() {
    const container = document.getElementById('post-content');
    if (!container) return;

    try {
        const id = new URLSearchParams(window.location.search).get('id');
        const posts = await loadPosts();
        const post = posts.find(item => item.id === id);

        if (!post) {
            container.innerHTML = '<p>Post not found. <a href="blog.html">Return to the blog</a>.</p>';
            return;
        }

        document.title = `${post.title} | Paris Mollo`;
        container.innerHTML = `
            <header class="post-header">
                <time class="post-date" datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
                <h1 class="post-title">${escapeHtml(post.title)}</h1>
                ${post.author ? `<p class="post-author">By ${escapeHtml(post.author)}</p>` : ''}
            </header>
            <div class="post-body">${renderPostContent(post)}</div>
        `;
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Post could not be loaded. <a href="blog.html">Return to the blog</a>.</p>';
    }
}

function renderPostContent(post) {
    if (!Array.isArray(post.content)) {
        return markdownToHtml(post.body || '');
    }

    return post.content.map((block) => {
        if (block.type === 'heading') {
            return `<h2>${escapeHtml(block.text)}</h2>`;
        }

        if (block.type === 'paragraph') {
            const paragraphClass = block.variant === 'intro' ? ' class="post-intro"' : '';
            return `<p${paragraphClass}>${renderInlineText(block.text)}</p>`;
        }

        if (block.type === 'image' && isSafeUrl(block.src)) {
            const source = renderFigureSource(block);
            const caption = block.caption || source
                ? `<figcaption>
                    ${block.caption ? `<span>${escapeHtml(block.caption)}</span>` : ''}
                    ${source}
                </figcaption>`
                : '';
            const width = Number.isInteger(block.width) ? ` width="${block.width}"` : '';
            const height = Number.isInteger(block.height) ? ` height="${block.height}"` : '';

            return `
                <figure class="post-figure">
                    <img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt || '')}"${width}${height} loading="lazy" decoding="async">
                    ${caption}
                </figure>
            `;
        }

        return '';
    }).join('');
}

function renderFigureSource(block) {
    if (!block.source) return '';

    const label = `Source: ${escapeHtml(block.source)}`;
    if (block.sourceUrl && isSafeUrl(block.sourceUrl)) {
        return `<span class="post-figure-source"><a href="${escapeHtml(block.sourceUrl)}" target="_blank" rel="noopener noreferrer">${label}</a></span>`;
    }

    return `<span class="post-figure-source">${label}</span>`;
}

// Minimal formatting retained for older posts that still use the body field.
function markdownToHtml(text) {
    return text
        .split('\n\n')
        .filter(Boolean)
        .map(block => {
            if (block.startsWith('## ')) return `<h2>${escapeHtml(block.slice(3))}</h2>`;
            if (block.startsWith('# ')) return `<h2>${escapeHtml(block.slice(2))}</h2>`;
            return `<p>${renderInlineText(block).replace(/\n/g, '<br>')}</p>`;
        })
        .join('');
}

function renderInlineText(text = '') {
    const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let result = '';
    let lastIndex = 0;

    for (const match of text.matchAll(linkPattern)) {
        result += escapeHtml(text.slice(lastIndex, match.index));
        result += `<a href="${escapeHtml(match[2])}" target="_blank" rel="noopener noreferrer">${escapeHtml(match[1])}</a>`;
        lastIndex = match.index + match[0].length;
    }

    return result + escapeHtml(text.slice(lastIndex));
}

function isSafeUrl(value = '') {
    try {
        const url = new URL(value, document.baseURI);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    })[character]);
}

function parseDate(dateString) {
    return new Date(`${dateString}T00:00:00`);
}

function formatDate(dateString) {
    return parseDate(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderBlogList();
    renderPost();
});
