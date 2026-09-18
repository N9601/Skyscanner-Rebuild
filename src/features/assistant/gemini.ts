export const GEMINI_KEY: string = import.meta.env.VITE_GEMINI_API_KEY ?? "";

export const geminiEnabled = GEMINI_KEY.length > 0;

const SYSTEM_PROMPT = `You are the travel assistant inside Akashavani, a flight, stay, and car meta-search demo app.
Rules:
- Only answer travel questions: routes, destinations, budgets, trip ideas, packing, timing, greener travel.
- If asked anything non-travel, decline in one friendly line and steer back to trips.
- Be concise: 2 to 4 sentences, no markdown headers, no bullet lists unless asked.
- Prices in INR. The user is typically flying out of India (BLR, DEL, BOM).
- Never use em dashes.
- You cannot book anything. You can suggest searches the user runs in the app (flights, stays, cars pages).`;

interface HistoryTurn {
  role: "user" | "assistant";
  text: string;
}

export async function askGemini(history: HistoryTurn[], input: string): Promise<string> {
  const contents = [
    ...history.slice(-8).map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.text }],
    })),
    { role: "user", parts: [{ text: input }] },
  ];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      }),
    },
  );

  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error("Empty Gemini reply");
  return text;
}
