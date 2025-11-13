import dotenv from 'dotenv';
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

// Load environment variables
dotenv.config();

console.log("Initializing AI model...");

const model = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0.0,
  apiKey: process.env.GROQ_API_KEY,
});

// Individual stand-up analysis
export async function analyseStandup({ yesterday, today, blockers }: any) {
  console.log("Analyzing standup...");    
  const prompt = PromptTemplate.fromTemplate(`
You are an AI assistant that extracts *actual* daily work progress from brief stand-up notes.

You must:
1. Derive tasks exactly as mentioned — do NOT make up generic ones.
2. Reflect tone realistically based on language used (avoid always "positive").
3. Give a vagueness score (0 = very detailed, 10 = extremely vague).
4. Suggest how the user can improve clarity.

Here is the user's stand-up update:

Yesterday: {yesterday}
Today: {today}
Blockers: {blockers}

Respond ONLY with valid JSON (no markdown or code):
{{
  "key_tasks": [string],
  "tone": "positive" | "neutral" | "frustrated" | "overwhelmed",
  "vague_score": number (0-10),
  "suggestion": string
}}

Important:
- Do not fabricate tasks or actions.
- Extract tasks *verbatim* from text when possible.
- Keep output short and factual.
`);

  const input = await prompt.format({ yesterday, today, blockers });
    
  try {
  console.log("Sending to AI model...");
  const response = await model.invoke([
    // System prompt 
    { role: "system", content: "You are a strict JSON generator. Do not include any explanation or code." },
    // User Input prompt
    { role: "user", content: input }
  ]);
  let content = response.content as string;

  // Explicit stripping of any non-JSON text if model adds them
  content = content
    .replace(/```json/g, "")
    .replace(/```python/g, "")
    .replace(/```/g, "")
    .trim();

  // parsing
  const parsed = JSON.parse(content);
  return parsed;

} catch (err: any) {
  console.error("analyseStandup error:", err.message);
  return {
    key_tasks: [],
    tone: "neutral",
    vague_score: 5,
    suggestion: "AI temporarily unavailable or returned invalid data.",
  };
}
}

// Team summary
export async function generateTeamSummary(teamStandups: any[]) {
  const joined = teamStandups
    .map(
      (s) =>
        `${s.userId.name || "User"}: Yesterday(${s.yesterday}), Today(${s.today}), Blockers(${s.blockers})`
    )
    .join("\n");

  const prompt = PromptTemplate.fromTemplate(`
You are an AI Scrum Master summarizing team stand-up updates.

You MUST return only valid JSON, with no markdown, code, or extra commentary.

Input data:
{joined}


Output format:
{{  
  "summary"(one paragraph team progress summary): string,
  "common_blockers"(list of issues several members share): [string],
  "suggested_collaborations"(list of who should sync up):[string],
  "risks"(list of potential risks): [string]
}}  

Guidelines:
- "summary" should be a concise overview (2-3 sentences).
- "common_blockers" should list shared or recurring issues.
- "suggested_collaborations" should list pairs or small groups who should coordinate.
- "risks" should mention possible project risks or delays.
- Do not include any explanations, code snippets, or markdown formatting.
Only valid JSON!
`);

  const input = await prompt.format({ joined });

  try {
    const response = await model.invoke([
      { role: "system", content: "You are a strict JSON generator. Do not include any explanation, code or markdown." },
      { role: "user", content: input }
    ]);
    
    let content = response.content as string;

    content = content
      .replace(/```json/g, "")
      .replace(/```python/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(content);
    return parsed;
  } catch (err: any) {
    console.error("generateTeamSummary error:", err.message);
    return {
      summary: "AI temporarily unavailable or returned invalid data.",
      common_blockers: [],
      suggested_collaborations: [],
      risks: [],
    };
  }
}
