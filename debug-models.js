const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // Just initializing to get access to client, actually we need listModels if available or just test one by one.
        // The SDK doesn't always expose listModels directly on the main class in older versions, 
        // but let's try a direct fetch which is more reliable for debugging.

        console.log("Checking API Key: " + (process.env.GEMINI_API_KEY ? "Present" : "Missing"));

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
        } else {
            console.log("Available Models:");
            console.log(JSON.stringify(data.models?.map(m => m.name) || [], null, 2));
        }
    } catch (e) {
        console.error("Script Error:", e);
    }
}

listModels();
