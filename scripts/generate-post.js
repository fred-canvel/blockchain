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
        console.log(`Generating professional analysis for: "${article.title}"...`);

        const prompt = `
Eres un analista financiero senior especializado en criptomonedas y tecnología blockchain, con más de 10 años de experiencia en mercados digitales. Tu trabajo es crear análisis profundos y profesionales que combinen periodismo de investigación con insights de mercado.

NOTICIA FUENTE:
Título: ${article.title}
Contenido: ${article.body}

INSTRUCCIONES PARA EL ANÁLISIS:

Tu rol es el de un analista profesional que no solo informa, sino que interpreta, analiza y proyecta. Debes crear un artículo extenso, detallado y **VISUALMENTE RICO** que incluya:

1. **CONTEXTO Y RELEVANCIA**
   - Sitúa la noticia en el contexto actual del mercado cripto.
   - Explica por qué esta noticia es importante AHORA.
   - Conecta con tendencias macro del sector.

2. **ANÁLISIS DETALLADO Y MÉTRICAS**
   - **CRÍTICO**: Busca e incluye **CIFRAS EXACTAS**, porcentajes y montos si están en la fuente.
   - Desglosa los aspectos técnicos y fundamentales.
   - Analiza las implicaciones para inversores, desarrolladores e instituciones.

3. **ANÁLISIS TÉCNICO (Si aplica)**
   - Si la noticia habla de precios, menciona niveles clave de **Soporte y Resistencia**.
   - Menciona indicadores como **Medias Móviles (MA 50, MA 200)** o **RSI** si el contexto lo sugiere (o infiere niveles psicológicos clave).
   - Si no hay datos técnicos, enfócate en el análisis fundamental de la tecnología o adopción.

4. **IMPACTO EN EL MERCADO**
   - Analiza cómo afecta a la volatilidad y precios.
   - Identifica ganadores y perdedores potenciales.
   - Escenarios: Alcista (Bull Case) vs Bajista (Bear Case).

5. **FACTORES A MONITOREAR**
   - Crea una lista clara de eventos o indicadores que los lectores deben vigilar.

6. **CONCLUSIÓN PROFESIONAL**
   - Reflexión final sobre las implicaciones a largo plazo.

REQUISITOS DE FORMATO Y VISUALES (IMPORTANTE):
- **NO** entregues texto plano. Usa HTML para estructurar visualmente.
- Usa **<h3>** para los títulos de las secciones (ej: "<h3>📊 Análisis de Impacto</h3>").
- **IMPORTANTE**: Asegúrate de que haya un salto de línea visual después de cada título <h3>.
- Usa **<ul>** y **<li>** para listas (especialmente en "Factores a Monitorear").
- Usa **<strong>** para resaltar TODAS las cifras, porcentajes y nombres de activos importantes.
- Usa **<blockquote>** para resaltar una frase clave o conclusión impactante.
- Párrafos cortos y digeribles (máximo 3-4 líneas por párrafo).

ESTILO DE ESCRITURA:
- Idioma: Español (España/Latinoamérica profesional).
- Tono: Analítico, experto, objetivo.
- **Evita**: Bloques de texto interminables. El lector debe poder escanear el artículo.

OUTPUT JSON:
{
  "title": "Título profesional y atractivo (con gancho analítico)",
  "excerpt": "Resumen ejecutivo de 2-3 frases con las métricas clave.",
  "content": "<h3>🌍 Contexto de Mercado</h3><p>...</p><h3>📉 Análisis Técnico</h3><p>...</p><ul><li>...</li></ul>...",
  "category": "Selecciona: DeFi, NFTs, Metaverse, Web3, Tech, Eco, Regulación, Mercados",
  "readTime": "X min lectura"
}
    `;

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Eres un analista financiero senior especializado en criptomonedas. Generas análisis profundos en formato JSON. Siempre proporcionas contenido extenso, detallado y profesional con múltiples párrafos bien estructurados."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error('Error generating content:', error.message);
        return null;
    }
}

function getArticleImage(article, postId) {
    // Check if article has an image and it's not the default CryptoCompare image
    if (article.imageurl && !article.imageurl.includes('default.png')) {
        console.log(`Using original article image: ${article.imageurl}`);
        return article.imageurl;
    }

    // If it's the default image or no image, generate a unique one based on postId
    console.log('Default or no image detected, generating unique image based on post ID');

    // Use Pollinations.ai for reliable AI image generation based on the article title/topic
    // This replaces the deprecated source.unsplash.com
    const cleanTitle = article.title.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 100);
    const encodedPrompt = encodeURIComponent(`${cleanTitle} crypto blockchain futuristic neon style high quality`);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true`;
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

    // 3. Create Post Object
    const now = new Date();
    const postId = Date.now();
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/New_York' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/New_York' };

    // 4. Generate Text Content
    const generatedContent = await generateContent(article);
    if (!generatedContent) return;

    // 5. Get Article Image (pass postId for unique image generation)
    const imageUrl = getArticleImage(article, postId);

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