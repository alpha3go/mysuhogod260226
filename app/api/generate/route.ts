import { NextResponse } from "next/server";
import OpenAI from "openai";
import { analyzeFortune } from "../../../lib/fortuneEngine";
import { generateImagePrompt, generateTextPrompt } from "../../../lib/promptGenerator";

export const runtime = 'edge';
export const maxDuration = 60; // Allow longer execution time for Next.js Serverless (if deployed)

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OpenAI API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요." }, { status: 500 });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const body = await req.json();
        const { birthDate, birthTime, region, language } = body;

        if (!birthDate || !region) {
            return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
        }

        // 1. Analyze Fortune
        const fortuneData = analyzeFortune({ birthDate, birthTime, region });

        // 2. Generate Prompts
        const imagePrompt = generateImagePrompt(fortuneData);
        const textPrompt = generateTextPrompt(fortuneData, region, language);

        // 3. Call OpenAI APIs in parallel
        const [imageResponse, textResponse] = await Promise.all([
            openai.images.generate({
                model: "dall-e-3",
                prompt: imagePrompt,
                n: 1,
                size: "1024x1024",
            }).catch(e => {
                console.error("DALL-E Error:", e);
                return null;
            }),
            openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: textPrompt }],
                max_tokens: 500,
                response_format: { type: "json_object" }
            }).catch(e => {
                console.error("GPT Error:", e);
                return null;
            })
        ]);

        // 4. Parse Responses
        const imageUrl = imageResponse?.data?.[0]?.url || "";
        const textContent = textResponse?.choices?.[0]?.message?.content || "{}";

        let parsedText = {
            angelName: "빛의 수호천사",
            comfortMessage: "API 연동에 일시적인 문제가 있었습니다. 하지만 천사는 항상 당신 곁에 있습니다.",
            fortuneMessage: "잠시 후 다시 시도해보세요."
        };

        try {
            if (textContent) {
                parsedText = JSON.parse(textContent);
            }
        } catch (e) {
            console.error("JSON Parse Error:", e);
        }

        return NextResponse.json({
            imageUrl,
            angelName: parsedText.angelName,
            comfortMessage: parsedText.comfortMessage,
            fortuneMessage: parsedText.fortuneMessage
        });

    } catch (error: any) {
        console.error("Generate API Error:", error);
        return NextResponse.json({ error: "수호천사 생성 중 오류가 발생했습니다." }, { status: 500 });
    }
}
