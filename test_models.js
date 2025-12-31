const { GoogleGenerativeAI } = require("@google/generative-ai");

// require('dotenv').config({ path: '.env.local' });

async function main() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const list = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // The SDK doesn't have a direct 'listModels' method exposed easily in the helper, 
        // but we can try to hit the endpoint or use the direct model if we knew it.
        // Actually, newer SDKs might not expose listModels easily on the instance. 
        // Let's try to just fetch model info or simply run a test generation on a few common names.
    } catch (e) {
        // ignore
    }

    // Alternative: Test common models
    const candidates = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-pro",
        "gemini-1.5-pro-001",
        "gemini-1.5-pro-002",
        "gemini-pro-vision",
        "gemini-1.0-pro"
    ];

    console.log("Testing models...");

    for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName}: `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log("OK ✅");
        } catch (error) {
            console.log(`FAILED ❌`);
            console.log(error.message); // Print full error
        }
    }
}

main();
