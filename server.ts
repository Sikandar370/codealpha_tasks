import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environmental variable is missing. Please add it via Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for translation
app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      res.status(400).json({ error: "Text to translate is required." });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert polyglot linguist and highly skilled translator.
Your task is to translate any text provided from the Source Language to the Target Language with high fidelity, cultural and contextual accuracy, and natural phrasing.

If the Source Language is "auto" or "Auto-Detect", you must first accurately detect the language of the source text.

In addition to translation, provide:
1. Detected Language name (only if the source language was "auto" / "Auto-Detect").
2. Phonetic pronunciation key or transliteration (e.g. pinyin for Chinese, romaji for Japanese, standard phonetic spelling for Russian/Arabic/Hindi, etc.) if applicable and helpful.
3. Grammatical parts of speech or category of phrase (e.g., noun, verb, colloquial greeting, idiomatic expression, sentence).
4. Alternatives: 2 or 3 close synonyms or alternative translations with minor changes in tone or formality.
5. Examples: 1 or 2 small sample sentences in both the source language and target language to show context-appropriate usage.
6. A short linguistic/nuance note (e.g., formal vs. informal level, cultural context, or specific grammatics).`;

    const prompt = `Source Language: ${sourceLang || "Auto-Detect"}\nTarget Language: ${targetLang}\nText to Translate:\n"""\n${text}\n"""`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: {
              type: Type.STRING,
              description: "The primary and most accurate, natural translation of the input text.",
            },
            detectedLanguage: {
              type: Type.STRING,
              description: "Name of the detected source language (e.g. Spanish, German, Japanese, English). Only set if the input source language was auto-detected.",
            },
            pronunciation: {
              type: Type.STRING,
              description: "Detailed phonetic pronunciation walkthrough or transliteration (pinyin, rōmaji, phonetic English walkthrough) for the translated text. Match the target language's syllables.",
            },
            partsOfSpeech: {
              type: Type.STRING,
              description: "Parts of speech or grammatical phrasing description (e.g. phrase, noun, formal request, idiomatic expression).",
            },
            alternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 or 3 alternative or parallel translations in the target language.",
            },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: {
                    type: Type.STRING,
                    description: "Example sentence in the source language (use the detected language if source was auto-detect).",
                  },
                  translated: {
                    type: Type.STRING,
                    description: "The translated version of that example sentence in the target language.",
                  },
                },
                required: ["original", "translated"],
              },
              description: "1 or 2 small illustrative, context-rich example phrases or sentences.",
            },
            nuanceNote: {
              type: Type.STRING,
              description: "Linguistic or cultural footnote explaining usage recommendations, politeness registers, or grammar rules.",
            },
          },
          required: ["translatedText", "alternatives", "examples"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty translation returned from Gemini API.");
    }

    const cleanJson = JSON.parse(resultText.trim());

    // Send translation package
    res.json({
      ...cleanJson,
      originalText: text,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    });
  } catch (error: any) {
    console.error("Translation API Error:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred during translation.",
    });
  }
});

// Setup dev server or static middleware
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Integrate Vite in development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    // Serve static files in production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Statically serving /dist in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Translate app server is running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
