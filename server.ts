import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for AI Grading and Feedback
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { documentTitle, documentBody, assignmentName } = req.body;

    if (!documentBody) {
      return res.status(400).json({ error: "Document body is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: "GEMINI_API_KEY environment variable is not set" });
    }

    const systemInstruction = `You are an elite university grading assistant. Analyze the student's submission for "${assignmentName || 'this assignment'}".
Evaluate the content rigorously. Give constructive feedback, highlight both strengths and weaknesses, and recommend a precise numerical grade from 50 to 100.
Also output whether the student satisfied the following rubrics: Originality, Methodological Rigor, Citation Quality, Clarity, and Ethics.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Title: ${documentTitle || 'Untitled Document'}\n\nBody:\n${documentBody}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedScore: {
              type: Type.INTEGER,
              description: "A recommended grade from 50 to 100 based on academic quality.",
            },
            gradeBadge: {
              type: Type.STRING,
              description: "Recalculated letter grade (e.g. A, B+, B, C+, C, D, F) corresponding to the score.",
            },
            feedback: {
              type: Type.STRING,
              description: "An elegant, comprehensive qualitative assessment (2-3 sentences), highlighting strengths and specifying room for growth.",
            },
            rubrics: {
              type: Type.OBJECT,
              properties: {
                originality: { type: Type.BOOLEAN },
                rigor: { type: Type.BOOLEAN },
                citation: { type: Type.BOOLEAN },
                clarity: { type: Type.BOOLEAN },
                ethics: { type: Type.BOOLEAN },
              },
              required: ["originality", "rigor", "citation", "clarity", "ethics"],
            }
          },
          required: ["recommendedScore", "gradeBadge", "feedback", "rubrics"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response text from Gemini API");
    }

    const aiResult = JSON.parse(responseText.trim());
    res.json(aiResult);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ 
      error: error?.message || "Failed to generate evaluation feedback. Check your secrets settings." 
    });
  }
});

// Server-side support: retrieve health status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Vite middleware flow to mount assets
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up Express static file serving in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupServer();
