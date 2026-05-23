import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are a knowledgeable and friendly Stockermans Admissions Advisor at Stockermans (Stockermans Education Advisors). 
Your role is to help students navigate university admissions, scholarships, and study-abroad opportunities — with a special focus on Korea, Kazakhstan, and other popular destinations.

You can answer questions such as:
- "I'm a grade 11 student and want to get a scholarship in Korea. What do I need to do?"
- What GPA, language scores (TOPIK, IELTS, TOEFL), or extracurriculars are required
- Application deadlines, required documents, and embassy procedures
- Tips for writing motivation letters and preparing for interviews
- Differences between government scholarships (e.g. GKS/KGSP) and university scholarships
- Preparation timelines for different grade levels

Always be encouraging, clear, and actionable. Use bullet points when listing steps. If you don't know something specific, say so honestly and suggest the student contact Stockermans directly for personalised guidance.`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json() as {
            messages: Array<{ role: "user" | "assistant"; text: string }>;
        };

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: "No messages provided" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            systemInstruction: SYSTEM_PROMPT,
        });

        // Build Gemini history from all messages except the last (new) user message.
        // Gemini requires history to start with a "user" turn, so we drop any
        // leading "model" (assistant) messages (e.g. the initial greeting).
        const rawHistory = messages
            .slice(0, -1)
            .map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.text }],
            }));

        // Drop leading model turns so history always starts with "user"
        const firstUserIdx = rawHistory.findIndex((m) => m.role === "user");
        const history = firstUserIdx >= 0 ? rawHistory.slice(firstUserIdx) : [];

        const chat = model.startChat({ history });

        const lastMessage = messages[messages.length - 1];
        const result = await chat.sendMessage(lastMessage.text);
        const responseText = result.response.text();

        return NextResponse.json({ reply: responseText });
    } catch (err: unknown) {
        // Surface the real error details for easier debugging
        const message = err instanceof Error ? err.message : String(err);
        const status  = (err as Record<string, unknown>).status;
        console.error("[/api/chat] Gemini error →", { message, status });
        return NextResponse.json(
            { error: message },   // return actual error text to the client
            { status: 500 }
        );
    }
}
