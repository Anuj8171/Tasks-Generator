import openai from "openai";

export const llm = new openai.OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Task Generator",
    },
});