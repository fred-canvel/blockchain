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

Tu rol es el de un analista profesional que no solo informa, sino que interpreta, analiza y proyecta. Debes crear un artículo extenso y detallado que incluya:

1. **CONTEXTO Y RELEVANCIA** (2-3 párrafos)
   - Sitúa la noticia en el contexto actual del mercado cripto
   - Explica por qué esta noticia es importante AHORA
   - Conecta con tendencias macro del sector

2. **ANÁLISIS DETALLADO** (3-4 párrafos)
   - Desglosa los aspectos técnicos y fundamentales de la noticia
   - Analiza las implicaciones para diferentes stakeholders (inversores, desarrolladores, instituciones)
   - Identifica factores clave que podrían influir en el desarrollo de esta situación
   - Usa datos, métricas o comparaciones cuando sea relevante

3. **IMPACTO EN EL MERCADO** (2-3 párrafos)
   - Analiza cómo esta noticia puede afectar los precios y la volatilidad
   - Identifica qué activos o sectores podrían verse más impactados
   - Considera escenarios alcistas y bajistas
   - Menciona posibles reacciones institucionales o regulatorias

4. **PERSPECTIVA TÉCNICA** (1-2 párrafos)
   - Si aplica, analiza aspectos tecnológicos o de infraestructura
   - Evalúa la viabilidad técnica o innovación presentada
   - Compara con soluciones o situaciones similares en el pasado

5. **PROYECCIÓN Y CONCLUSIÓN** (2 párrafos)
   - Ofrece una visión sobre posibles desarrollos futuros
   - Proporciona puntos clave que los lectores deben monitorear
   - Concluye con una reflexión profesional sobre las implicaciones a largo plazo

REQUISITOS DE FORMATO:
- Idioma: Español (España/Latinoamérica profesional)
- Tono: Analítico, profesional, objetivo pero con perspectiva experta
- Longitud: Mínimo 8-12 párrafos bien desarrollados
- HTML: Usa MÚLTIPLES etiquetas <p> (una por cada párrafo). CRÍTICO: NO pongas todo en un solo <p>
- Énfasis: Usa <strong> para términos clave o cifras importantes
- Listas: Usa <ul> y <li> solo si presentas puntos específicos (ej: factores a monitorear)
- NO uses subtítulos explícitos como <h3>. El flujo debe ser natural y continuo
- Evita frases genéricas. Sé específico y aporta valor analítico real

ESTILO DE ESCRITURA:
- Primera frase: Impactante y que capte atención
- Párrafos: Bien estructurados, cada uno con una idea clara
- Transiciones: Fluidas entre secciones
- Datos: Incluye cuando sea posible (porcentajes, comparaciones, cifras)
- Evita: Lenguaje sensacionalista o clickbait
- Prefiere: Análisis fundamentado y perspectiva profesional

OUTPUT JSON:
{
  "title": "Título profesional y descriptivo en español (no clickbait, pero atractivo)",
  "excerpt": "Resumen ejecutivo de 2-3 frases que capture la esencia del análisis y su relevancia",
  "content": "<p>Párrafo 1...</p><p>Párrafo 2...</p><p>Párrafo 3...</p>... (mínimo 8 párrafos)",
  "category": "Selecciona la más apropiada: DeFi, NFTs, Metaverse, Web3, Tech, Eco, Regulación, Mercados",
  "readTime": "X min lectura" (calcula basado en ~200 palabras/min)
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

    // Use Unsplash with a random seed based on postId to get unique crypto-related images
    const imageTopics = [
        'cryptocurrency',
        'blockchain',
        'bitcoin',
        'ethereum',
        'trading',
        'finance',
        'technology',
        'digital',
        'network',
        'data'
    ];

    // Select a topic based on postId to ensure variety
    const topicIndex = postId % imageTopics.length;
    const topic = imageTopics[topicIndex];

    // Use postId as seed for consistent but unique images
    return `https://source.unsplash.com/1200x630/?${topic}&sig=${postId}`;
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