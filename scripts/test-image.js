import axios from 'axios';

async function testSimplerStyle() {
    const topic = "Blockchain Technology";
    const prompt = `${topic} cyberpunk style digital art`;
    const encoded = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encoded}`;

    console.log("Testing Simpler Style:", url);
    try {
        const response = await axios.get(url);
        console.log("Simpler Style Status:", response.status);
    } catch (error) {
        console.error("Simpler Style Failed:", error.message);
    }
}

testSimplerStyle();
