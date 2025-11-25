import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const NEWS_API_URL = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';
const POSTS_FILE_PATH = path.join(__dirname, '../src/data/posts.json');

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function fetchNews() {
    try {
        console.log('Fetching latest news...');
        const response = await axios.get(NEWS_API_URL);
        const news = response.data.Data;

        // Return the first article that has an image, body, and url
        return news.find(article => article.imageurl && article.body.length > 100 && article.url);
    } catch (error) {
        console.error('Error fetching news:', error.message);
        return null;
    }
}

async function generateContent(article) {
    try {
        console.log(`Generating content for: "${article.title}"...`);

        const prompt = `
      You are an expert crypto journalist and thought leader. Write a comprehensive, high-impact blog post based on this news article.
      
      Article Title: ${article.title}
      Article Body: ${article.body}
      
      Requirements:
      - Language: Spanish
      - Tone: Professional, insightful, visionary, and engaging.
      - Format: The 'content' field must be valid HTML (paragraphs <p>, headers <h3>, lists <ul>/<li>).
      
      Structure:
      1. **Catchy Title**: A headline that grabs attention.
      2. **Engaging Excerpt**: A 2-sentence hook.
      3. **Full Content**:
         - Write a fluid, engaging article without using explicit subtitles like "Introduction", "The Core Update", etc.
         - **CRITICAL**: Use multiple <p> tags to separate ideas. Do not put everything in one big paragraph.
         - Example: <p>First idea...</p><p>Second idea...</p>
         - You can use <strong> for emphasis but avoid <h3> headers for sections unless absolutely necessary for a list.
         - The flow should be: Context -> Core News -> Analysis -> Future Outlook -> Conclusion, but woven together naturally.
      
      Output format (JSON):
      {
        "title": "Spanish Title",
        "excerpt": "Spanish Excerpt",
        "content": "<p>Paragraph 1...</p><p>Paragraph 2...</p>...",
        "category": "Select one: DeFi, NFTs, Metaverse, Web3, Tech, Eco",
        "readTime": "X min lectura"
      }
    `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant that outputs JSON." }, { role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error('Error generating content:', error.message);
        return null;
    }
}

async function generateImage(postId) {
    // Use Unsplash Source API with crypto/blockchain keywords
    // The sig parameter acts as a cache buster/seed to get consistent images
    // We rotate through different crypto-related keywords for variety
    const keywords = [
        'cryptocurrency',
        'blockchain',
        'bitcoin',
        'technology',
        'finance',
        'digital',
        'network',
        'data'
    ];

    // Use postId to select a keyword consistently for this post
    const keywordIndex = postId % keywords.length;
    const keyword = keywords[keywordIndex];

    // Unsplash Source API with sig parameter for consistency
    const imageUrl = `https://source.unsplash.com/1024x1024/?${keyword}&sig=${postId}`;

    console.log(`Generated stable themed image URL for post ${postId} with keyword: ${keyword}`);
    return imageUrl;
}

async function main() {
    // 1. Read existing posts to check for duplicates
    let posts = [];
    try {
        const fileContent = await fs.readFile(POSTS_FILE_PATH, 'utf8');
        posts = JSON.parse(fileContent);
    } catch (error) {
        console.log('No existing posts found or error reading file. Starting fresh.');
    }

    // 2. Fetch News
    const article = await fetchNews();
    if (!article) {
        console.log('No suitable news found.');
        return;
    }

    // Check if this article has already been posted
    // We check if any existing post has the same source URL
    const isDuplicate = posts.some(post => post.sourceUrl === article.url);

    if (isDuplicate) {
        console.log(`Skipping duplicate article: "${article.title}"`);
        return;
    }

    // 3. Create Post Object (Generate ID first to use for image seed)
    const now = new Date();
    const postId = Date.now();
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/New_York' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/New_York' };

    // 4. Generate Text Content
    const generatedContent = await generateContent(article);
    if (!generatedContent) return;

    // 5. Generate Image
    // Pass postId to ensure stable, themed image per post
    const imageUrl = await generateImage(postId);

    const newPost = {
        id: postId,
        title: generatedContent.title,
        excerpt: generatedContent.excerpt,
        content: generatedContent.content,
        category: generatedContent.category,
        readTime: generatedContent.readTime,
        date: `${now.toLocaleDateString('es-ES', dateOptions)} • ${now.toLocaleTimeString('es-ES', timeOptions)} EST`,
        image: imageUrl,
        sourceUrl: article.url,
        author: {
            name: "fredcanvel",
            avatar: "https://cdn-icons-png.flaticon.com/512/3540/3540784.png"
        }
    };

    // 6. Save to File
    try {
        posts.unshift(newPost); // Add to the beginning

        // Keep only the last 96 posts
        if (posts.length > 96) {
            posts.length = 96;
        }

        await fs.writeFile(POSTS_FILE_PATH, JSON.stringify(posts, null, 2));
        console.log('Successfully generated and saved new post!');
    } catch (error) {
        console.error('Error saving post:', error.message);
    }
}

main();