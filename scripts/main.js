class MicroblogApp {
    constructor() {
        this.postsContainer = document.getElementById('posts');
        this.loadingElement = document.getElementById('loading');
        this.posts = [];
        this.maxPosts = 100;
    }

    async init() {
        try {
            await this.loadPosts();
            this.renderPosts();
        } catch (error) {
            console.error('投稿の読み込みに失敗しました:', error);
            this.showError('投稿の読み込みに失敗しました。');
        }
    }

    async loadPosts() {
        const response = await fetch('./posts/posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.posts = data.posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, this.maxPosts);
    }

    renderPosts() {
        this.hideLoading();
        
        if (this.posts.length === 0) {
            this.showMessage('まだ投稿がありません。');
            return;
        }

        const postsHTML = this.posts.map(post => this.createPostHTML(post)).join('');
        this.postsContainer.innerHTML = postsHTML;
    }

    createPostHTML(post) {
        const formattedDate = this.formatDate(post.date);
        const processedContent = this.processContent(post.content);
        
        return `
            <article class="post" role="article">
                <header class="post__header">
                    <time class="post__date" datetime="${post.date}">${formattedDate}</time>
                </header>
                <div class="post__content">
                    ${processedContent}
                </div>
            </article>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        
        // 時刻を00:00:00にして日付のみで比較
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const diffDays = (nowOnly - dateOnly) / (1000 * 60 * 60 * 24);

        if (diffDays === 0) {
            return '今日';
        } else if (diffDays === 1) {
            return '昨日';
        } else if (diffDays <= 7) {
            return `${diffDays}日前`;
        } else {
            return date.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    processContent(content) {
        return content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => this.linkify(this.escapeHtml(line)))
            .map(line => `<p>${line}</p>`)
            .join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    linkify(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    }

    hideLoading() {
        this.loadingElement.style.display = 'none';
    }

    showError(message) {
        this.hideLoading();
        this.postsContainer.innerHTML = `
            <div class="timeline__message timeline__message--error">
                ${message}
            </div>
        `;
    }

    showMessage(message) {
        this.postsContainer.innerHTML = `
            <div class="timeline__message">
                ${message}
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new MicroblogApp();
    app.init();
});