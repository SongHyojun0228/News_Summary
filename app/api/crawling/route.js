import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const text = $("article").text() || $("body").text();
        const head = $("h1").text();
        const cleanText = text.replace(/\s+/g, " ").trim().slice(0, 3000);
        const category = $('meta[property="og:article:section"]').attr("content");
        console.log("category : ", category);

        console.log("서버에서 크롤링 성공");

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "너는 뉴스 요약 전문가야. 핵심 bullet point를 기반으로 넘버링 요약을 해줘."
                },
                {
                    role: "user",
                    // content: `넘버링 형식으로 다음 뉴스 기사를 요약해줘:\n\n${cleanText}`
                    content: `
                        ${cleanText}
                        위 내용을 다음 양식에 맞춰서 답해줘

                        카테고리: 정치, 경제, 사회, 세계, 생활/문화, IT/과학/컴퓨터, 스포츠 중 하나
                        요약 내용은 넘버링이나 (-)하이픈으로 딱딱 정리해서

                        출력 형식:
                        요약 내용
                        카테고리: (한 단어)
                    `
                }
            ]
        });

        const answer = response.choices[0].message.content;

        return NextResponse.json({ content: answer, head: head });
    } catch (err) {
        console.log("서버에서 크롤링 실패");
        return NextResponse.json(
            { error: "Failed to scrape content", details: err.message },
            { status: 500 }
        );
    }
}
