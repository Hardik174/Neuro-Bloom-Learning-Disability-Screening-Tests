import express from 'express';
import OpenAI from 'openai';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors'; // add this line

dotenv.config();

const app = express();
app.use(cors()); // add this line
const upload = multer({ dest: 'uploads/' }); // Store uploaded images temporarily
app.use(express.json());

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': 'https://your-site-url.com',
    'X-Title': process.env.YOUR_SITE_NAME,
  },
});

// Route that accepts image + age
app.post('/ask', upload.single('image'), async (req, res) => {
  try {
    const { age } = req.body;
    const imagePath = req.file?.path;

    if (!imagePath || !age) {
      return res.status(400).json({ error: 'Image and age are required.' });
    }

    // Convert image to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    const imageMime = req.file.mimetype; // e.g., image/jpeg or image/png

    // Compose prompt
    const prompt = `This is a handwriting sample from a ${age}-year-old Indian student. English is their third language.

Please conduct a diagnostic-style analysis with the following focus and considering the kid's age and background:
- Identify spelling and grammatical errors in the writing, considering the student's age and the fact that English is not their first language.
- Analyze the handwriting for signs commonly associated with dysgraphia, such as poor letter formation, inconsistent spacing, irregular sizing, misalignment.
- Return a clear YES or NO answer, along with a confidence score from 0 to 100.`;

    // Call OpenRouter API (GPT-4o with vision)
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${imageMime};base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 700,
      temperature: 0.6,
    });

    // Clean up uploaded image
    fs.unlinkSync(imagePath);

    // Extract the response text from completion
    const reply = completion.choices[0]?.message?.content || 'No response received';
    res.json({ reply });
    
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.post('/askmath', async (req, res) => {
  try {
    const { age, scores } = req.body;

    if (!age || !scores || !Array.isArray(scores)) {
      return res.status(400).json({ error: 'Age and scores array are required.' });
    }

    // Game metadata to match titles with descriptions
    const gameDescriptions = {
      "Dot Counting Game": "Recognize quantities without counting",
      "Number Comparison Game": "Judge greater vs smaller quantities",
      "Pattern Completion Game": "Detect logical/memory issues via sequences",
      "Symbol Confusion Game": "Test symbol recognition",
      "Place Value Puzzle": "Evaluate understanding of number structure",
      "Basic Word Problem Game": "Apply math to real-life situations",
      "Conversational Math Game": "Simulate real-life math via dialogue",
      "Clock Reading Game": "Read analog clocks and calculate time"
    };

    // Prepare a section listing all game descriptions
    const gameDescriptionsText = Object.entries(gameDescriptions)
      .map(([game, desc]) => `- ${game}: ${desc}`)
      .join('\n');

    const scoreDetails = scores.map(scoreObj => {
      const { game, correct, total } = scoreObj;
      const desc = gameDescriptions[game] || "No description available";
      return `- ${game} (${desc}): ${correct} correct out of ${total}`;
    }).join('\n');

    const prompt = `You are an expert in learning disabilities. Below are the results of various educational games designed to detect dyscalculia in children. The subject is a ${age}-year-old Indian student. Each game's score indicates how many answers were correct out of the total questions.

Game Descriptions:
${gameDescriptionsText}

Game Results:
${scoreDetails}

Considering the student's age (${age}), the meaning of each game, and the scores above, please answer:
1. Does this child likely have dyscalculia? (Answer YES or NO)
2. Confidence score (0–100)
3. Why would you conculde so, if yes then give a good explanation of why,highlighting any patterns or concerns, referencing the relevant games and the child's age.`

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.5
    });

    const reply = completion.choices[0]?.message?.content || 'No response received';
    res.json({ reply });

  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
