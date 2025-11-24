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

async function generateImage(topic) {
    try {
        console.log(`Generating image for topic: "${topic}"...`);

        // Create a prompt for Pollinations.ai
        const basePrompt = `Cyberpunk style digital art illustration of ${topic}, neon colors, futuristic, high quality, 4k, blockchain theme, dark background`;
        const encodedPrompt = encodeURIComponent(basePrompt);

        // Construct the URL
        // width=1024, height=1024, nologo=true (to avoid watermarks if possible/supported)
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

        return imageUrl;
    } catch (error) {
        console.error('Error generating image:', error.message);
        // Fallback to a random tech image if generation fails
        return "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800";
    }
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

    // 3. Generate Text Content
    const generatedContent = await generateContent(article);
    if (!generatedContent) return;

    // 4. Generate Image
    // We use the English title for better image generation prompts
    const imageUrl = await generateImage(article.title);

    // 5. Create Post Object
    const now = new Date();
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/New_York' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/New_York' };

    const newPost = {
        id: Date.now(), // Simple unique ID
        title: generatedContent.title,
        excerpt: generatedContent.excerpt,
        content: generatedContent.content, // Added full content
        category: generatedContent.category,
        readTime: generatedContent.readTime,
        date: `${now.toLocaleDateString('es-ES', dateOptions)} • ${now.toLocaleTimeString('es-ES', timeOptions)} EST`,
        image: imageUrl,
        sourceUrl: article.url, // Save source URL to prevent duplicates
        author: {
            name: "fredcanvel",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fredcanvel"
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
