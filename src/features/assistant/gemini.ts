export const GEMINI_KEY: string = import.meta.env.VITE_GEMINI_API_KEY ?? "";

export const geminiEnabled = GEMINI_KEY.length > 0;

const SYSTEM_PROMPT = `You are the travel assistant inside Akashavani, a flight, stay, and car meta-search demo app.
Rules:
- Only answer travel questions: routes, destinations, budgets, trip ideas, packing, timing, greener travel.
- If asked anything non-travel, decline in one friendly line and steer back to trips.
- Be concise: 2 to 4 sentences, no markdown headers, no bullet lists unless asked.
- Prices in INR. The user is typically flying out of India (BLR, DEL, BOM).
- Never use em dashes.
- You cannot book anything, but you CAN hand the user a search inside the app.
Action rules:
- When the message implies a concrete search, fill "action". kind "flights" needs from and to city names (default from = Bengaluru). kind "stays" or "cars" needs city. kind "explore" means open-ended destination browsing from a city.
- Put depart as YYYY-MM-DD only if the user gave a date. If no search applies, set action kind to "none".`;

export interface GeminiAction {
  kind: "flights" | "stays" | "cars" | "explore" | "none";
  from?: string;
  to?: string;
  city?: string;
  depart?: string;
}

export interface GeminiStructured {
  reply: string;
  action?: GeminiAction | null;
}

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    reply: { type: "STRING" },
    action: {
      type: "OBJECT",
      nullable: true,
      properties: {
        kind: { type: "STRING", enum: ["flights", "stays", "cars", "explore", "none"] },
        from: { type: "STRING", nullable: true },
        to: { type: "STRING", nullable: true },
        city: { type: "STRING", nullable: true },
        depart: { type: "STRING", nullable: true },
      },
      required: ["kind"],
    },
  },
  required: ["reply"],
};

interface HistoryTurn {
  role: "user" | "assistant";
  text: string;
}

export async function askGemini(history: HistoryTurn[], input: string): Promise<GeminiStructured> {
  const contents = [
    ...history.slice(-8).map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.text }],
    })),
    { role: "user", parts: [{ text: input }] },
  ];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 640,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
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
  const jsonBlock = text.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonBlock) return { reply: text };
  try {
    const parsed = JSON.parse(jsonBlock) as GeminiStructured;
    if (!parsed.reply) return { reply: text };
    return parsed;
  } catch {
    return { reply: text };
  }
}
