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

        // Return the first article that has an image and body
        return news.find(article => article.imageurl && article.body.length > 100);
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
         - **Introduction**: Set the context and why this news is breaking.
         - **The Core Update**: Explain the technical or market details clearly.
         - **Why It Matters (Analysis)**: Deep dive into the implications for the industry/market.
         - **Future Outlook**: Speculation or prediction based on this event.
         - **Conclusion**: A strong closing thought.
      
      Output format (JSON):
      {
        "title": "Spanish Title",
        "excerpt": "Spanish Excerpt",
        "content": "<p>Intro...</p><h3>El Núcleo de la Noticia</h3><p>Details...</p><h3>Análisis de Impacto</h3><p>Analysis...</p>...",
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
    // 1. Fetch News
    const article = await fetchNews();
    if (!article) {
        console.log('No suitable news found.');
        return;
    }

    // 2. Generate Text Content
    const generatedContent = await generateContent(article);
    if (!generatedContent) return;

    // 3. Generate Image
    // We use the English title for better image generation prompts
    const imageUrl = await generateImage(article.title);

    // 4. Create Post Object
    const newPost = {
        id: Date.now(), // Simple unique ID
        title: generatedContent.title,
        excerpt: generatedContent.excerpt,
        content: generatedContent.content, // Added full content
        category: generatedContent.category,
        readTime: generatedContent.readTime,
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        image: imageUrl,
        author: {
            name: "fredcanvel",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fredcanvel"
        }
    };

    // 5. Save to File
    try {
        const posts = JSON.parse(await fs.readFile(POSTS_FILE_PATH, 'utf8'));
        posts.unshift(newPost); // Add to the beginning

        // Keep only the last 100 posts
        if (posts.length > 100) {
            posts.length = 100;
        }

        await fs.writeFile(POSTS_FILE_PATH, JSON.stringify(posts, null, 2));
        console.log('Successfully generated and saved new post!');
    } catch (error) {
        console.error('Error saving post:', error.message);
    }
}

main();
