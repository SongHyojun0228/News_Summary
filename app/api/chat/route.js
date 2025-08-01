import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
    try {
        const body = await req.json();
        const question = body.question || "";

        if (!process.env.OPENAI_API_KEY) {
            return new Response(
                JSON.stringify({ error: "Open API Key not configured" }),
                { status: 500 }
            );
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "너는 뉴스 요약 전문가야. 핵심 bullet point와 한두 문장 종합 요약을 해줘."
                },
                {
                    role: "user",
                    content: `다음 뉴스 기사를 요약해줘 ( 단, 넘버링 형식으로 ):\n\n${question}`
                }
            ]
        });

        const answer = response.choices[0].message.content;

        return new Response(
            JSON.stringify({ result: answer }),
            { headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("API Error: ", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}
