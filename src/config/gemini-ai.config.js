const httpStatus = require('http-status');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const { env } = require('../config');
const ApiError = require('../utils/ApiError');

const chatHistory = [];

// Initialize the Gemini API with error handling
let genAI;
try {
  if (!env.googleAIApiKey) {
    console.error('Missing GOOGLE_AI_API_KEY in environment variables');
    throw new Error('Google AI API key is not configured');
  }
  genAI = new GoogleGenerativeAI(env.googleAIApiKey);
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error);
}

const GENERATION_CONFIG = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const startChat = () => {
  if (!genAI) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Gemini AI not initialized properly');
  }

  try {
    return genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }).startChat({
      history: chatHistory,
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });
  } catch (error) {
    console.error('Error starting chat:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to start chat: ${error.message}`);
  }
};

const addToHistory = async (role, message) => {
  if (!message) throw new ApiError(httpStatus.BAD_REQUEST, 'Please try again');
  chatHistory.push({ role: role, parts: [{ text: message }] });
};

module.exports = { startChat, addToHistory };
