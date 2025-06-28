#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class PostBuilder {
    constructor() {
        this.postsDir = path.join(__dirname, '../posts');
        this.outputFile = path.join(this.postsDir, 'posts.json');
    }

    // Markdownファイルのフロントマターを解析
    parseFrontMatter(content) {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);
        
        if (!match) {
            return { metadata: {}, content: content.trim() };
        }

        const frontMatter = match[1];
        const bodyContent = match[2].trim();
        const metadata = {};

        frontMatter.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
                metadata[key] = value;
            }
        });

        return { metadata, content: bodyContent };
    }

    // 日付からファイル名を推測
    extractDateFromFilename(filename) {
        const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
        return dateMatch ? dateMatch[1] : null;
    }

    // RSSフィードも一緒に生成
    generateRSSFeed(posts) {
        const now = new Date();
        const rssDate = now.toUTCString();
        
        const items = posts.slice(0, 10).map(post => {
            const postDate = new Date(post.date);
            const pubDate = postDate.toUTCString();
            
            return `        <item>
            <title>${this.escapeXml(post.title || post.date)}</title>
            <link>https://your-domain.vercel.app/#${post.date}</link>
            <guid>https://your-domain.vercel.app/#${post.date}</guid>
            <pubDate>${pubDate}</pubDate>
            <description><![CDATA[${post.content}]]></description>
        </item>`;
        }).join('\n');

        const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>マイクロブログ</title>
        <description>シンプルなマイクロブログ - 短文投稿を気軽に共有</description>
        <link>https://your-domain.vercel.app</link>
        <atom:link href="https://your-domain.vercel.app/feed.xml" rel="self" type="application/rss+xml"/>
        <language>ja</language>
        <lastBuildDate>${rssDate}</lastBuildDate>
        <generator>Static Microblog</generator>
        
${items}
    </channel>
</rss>`;

        fs.writeFileSync(path.join(__dirname, '../feed.xml'), rssContent, 'utf8');
        console.log('✅ RSSフィード (feed.xml) を更新しました');
    }

    escapeXml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    async buildPosts() {
        try {
            console.log('📝 投稿データを生成中...');
            
            // postsディレクトリからMarkdownファイルを読み込み
            const files = fs.readdirSync(this.postsDir)
                .filter(file => file.endsWith('.md'))
                .sort()
                .reverse(); // 新しい順

            const posts = [];

            for (const file of files) {
                const filePath = path.join(this.postsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const { metadata, content: bodyContent } = this.parseFrontMatter(content);
                
                // 日付の取得（メタデータ > ファイル名）
                const date = metadata.date || this.extractDateFromFilename(file);
                
                if (!date) {
                    console.warn(`⚠️  ${file}: 日付が見つかりません（ファイル名またはフロントマターに日付を含めてください）`);
                    continue;
                }

                const post = {
                    date,
                    title: metadata.title || date,
                    content: bodyContent
                };

                posts.push(post);
                console.log(`✅ ${file} を処理しました`);
            }

            // 日付順でソート（新しい順）
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            // JSONファイルに出力
            const output = {
                posts: posts,
                generated: new Date().toISOString(),
                count: posts.length
            };

            fs.writeFileSync(this.outputFile, JSON.stringify(output, null, 2), 'utf8');
            console.log(`✅ ${posts.length}件の投稿を ${this.outputFile} に書き出しました`);

            // RSSフィードも生成
            this.generateRSSFeed(posts);

            return posts;

        } catch (error) {
            console.error('❌ 投稿の生成に失敗しました:', error);
            throw error;
        }
    }
}

// スクリプトとして直接実行された場合
if (require.main === module) {
    const builder = new PostBuilder();
    builder.buildPosts()
        .then(() => {
            console.log('🎉 投稿データの生成が完了しました！');
        })
        .catch(error => {
            console.error('❌ エラーが発生しました:', error);
            process.exit(1);
        });
}

module.exports = PostBuilder;