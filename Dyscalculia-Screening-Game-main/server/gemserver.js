import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import Gemini SDK
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' }); // Store uploaded images temporarily
app.use(express.json());

// --- Gemini API Setup ---
// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI("AIzaSyBb1oPNBgqBcr9E0bllYzlj46zbkEESJ3o");
// Choose your desired model. 'gemini-pro-vision' is for multimodal (text + image).
// 'gemini-pro' is for text-only.
const visionModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
const textModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
// --- End Gemini API Setup ---


// Helper function to convert local file to GoogleGenerativeMedia type
function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
            mimeType
        },
    };
}


// Handwriting Analysis Route (`/ask`)

// This route handles the handwriting analysis using the **`gemini-pro-vision`** model, allowing it to process both text prompts and the uploaded image.

app.post('/ask', upload.single('image'), async (req, res) => {
    try {
        const { age } = req.body;
        const imagePath = req.file?.path;

        if (!imagePath || !age) {
            // Clean up the uploaded file if validation fails
            if (imagePath) fs.unlinkSync(imagePath);
            return res.status(400).json({ error: 'Image and age are required.' });
        }

        const imageMime = req.file.mimetype; // e.g., image/jpeg or image/png

        // Prepare the image for Gemini API
        const imagePart = fileToGenerativePart(imagePath, imageMime);

        // Compose prompt
        const prompt = `This is a handwriting sample from a ${age}-year-old Indian student. English is their third language.

Please conduct a diagnostic-style analysis with the following focus and considering the kid's age and background:
- Identify spelling and grammatical errors in the writing, considering the student's age and the fact that English is not their first language.
- Analyze the handwriting for signs commonly associated with dysgraphia, such as poor letter formation, inconsistent spacing, irregular sizing, misalignment.
- Return a clear YES or NO answer, along with a confidence score from 0 to 100.`;

        // Call Gemini Vision API
        const result = await visionModel.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean up uploaded image
        fs.unlinkSync(imagePath);

        res.json({ reply: text });

    } catch (error) {
        console.error('Gemini API error (Handwriting):', error);
        // Ensure image is cleaned up even on error
        if (req.file?.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Something went wrong with the handwriting analysis.' });
    }
});

// ---

// Math Analysis Route (`/askmath`)

// This route uses the **`gemini-pro`** model as it only deals with text-based input (scores and age).


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
3. Why would you conclude so? If yes, then give a good explanation of why, highlighting any patterns or concerns, referencing the relevant games and the child's age.`;

        // Call Gemini Text API
        const result = await textModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error('Gemini API error (Math):', error);
        res.status(500).json({ error: 'Something went wrong with the math analysis.' });
    }
});

// ---

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));