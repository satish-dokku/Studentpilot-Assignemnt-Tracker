import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Fallback heuristic generator when offline or API key unavailable
function generateHeuristicPlan(title: string, courseCode: string, estimatedHours: number = 4) {
  const hours = estimatedHours > 0 ? estimatedHours : 4;
  const totalMinutes = hours * 60;
  
  return {
    summary: `Structured academic study breakdown for "${title}" (${courseCode}) distributed over focused learning blocks.`,
    recommendedDailyMinutes: Math.min(60, Math.max(30, Math.round(totalMinutes / 4))),
    subtasks: [
      {
        title: `Analyze assignment rubric & gather source materials for ${courseCode}`,
        estimatedMinutes: Math.round(totalMinutes * 0.2),
        stage: 'Preparation',
      },
      {
        title: `Draft outline & execute core research / problem-solving tasks`,
        estimatedMinutes: Math.round(totalMinutes * 0.4),
        stage: 'Core Work',
      },
      {
        title: `Compile findings, solve requirements, and implement solution`,
        estimatedMinutes: Math.round(totalMinutes * 0.25),
        stage: 'Implementation',
      },
      {
        title: `Proofread against criteria, verify citations/test-cases, and prepare final file`,
        estimatedMinutes: Math.round(totalMinutes * 0.15),
        stage: 'Final Review',
      },
    ],
    studyTips: [
      `Break study sessions into 25-minute Pomodoro intervals to prevent cognitive fatigue.`,
      `Verify all submission formatting requirements (PDF naming conventions, file size limits).`,
      `Review lecture slides and reference notes from ${courseCode} before starting.`,
    ],
    isFallback: true,
  };
}

// AI Study Plan Generation Endpoint
app.post('/api/ai/plan', async (req: Request, res: Response) => {
  const { title, courseCode, courseName, description, dueDate, priority, estimatedHours } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Assignment title is required' });
  }

  const ai = getGeminiClient();

  if (!ai) {
    console.log('Gemini API key not found or placeholder; utilizing academic heuristic fallback.');
    const fallbackPlan = generateHeuristicPlan(title, courseCode || 'Course', estimatedHours);
    return res.json(fallbackPlan);
  }

  try {
    const prompt = `You are an expert academic advisor and university study coach helping a college student plan and complete their assignment.
Generate a realistic, step-by-step study schedule and milestone breakdown for the following assignment:

- Assignment Title: ${title}
- Course Code & Name: ${courseCode || 'General'} - ${courseName || 'Academic Course'}
- Description / Requirements: ${description || 'No detailed instructions provided.'}
- Target Deadline: ${dueDate || 'Upcoming in next few days'}
- Priority Level: ${priority || 'medium'}
- Estimated Effort: ${estimatedHours || 4} hours

Provide:
1. A concise, encouraging summary strategy (1-2 sentences).
2. Recommended daily study minutes.
3. 3 to 5 chronological subtasks with clear actionable titles, realistic minute estimates, and a workflow stage name (e.g. "Preparation", "Drafting", "Testing", "Review").
4. 3 targeted university study tips specific to this type of college assignment.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an academic advisor for university students. Always output precise JSON adhering to the provided schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: '1-2 sentence high-level strategy overview.',
            },
            recommendedDailyMinutes: {
              type: Type.INTEGER,
              description: 'Recommended minutes of study per day.',
            },
            subtasks: {
              type: Type.ARRAY,
              description: '3 to 5 sequential subtasks.',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: 'Clear, actionable title of the subtask.',
                  },
                  estimatedMinutes: {
                    type: Type.INTEGER,
                    description: 'Estimated minutes to complete this specific subtask.',
                  },
                  stage: {
                    type: Type.STRING,
                    description: 'Stage label (e.g., Preparation, Implementation, Review).',
                  },
                },
                required: ['title', 'estimatedMinutes', 'stage'],
              },
            },
            studyTips: {
              type: Type.ARRAY,
              description: '3 specific academic tips.',
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ['summary', 'recommendedDailyMinutes', 'subtasks', 'studyTips'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    const parsedData = JSON.parse(responseText.trim());
    return res.json({
      ...parsedData,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error generating AI study plan with Gemini, using fallback:', error?.message || error);
    const fallbackPlan = generateHeuristicPlan(title, courseCode || 'Course', estimatedHours);
    return res.json(fallbackPlan);
  }
});

// Setup server with Vite or static production dist
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Assignment & Deadline Tracker server ready at http://localhost:${PORT}`);
  });
}

startServer();
