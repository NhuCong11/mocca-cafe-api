const httpStatus = require('http-status');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const { env } = require('../config');
const ApiError = require('../utils/ApiError');

const chatHistory = [];
const genAI = new GoogleGenerativeAI(env.googleAIApiKey);

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
  return genAI.getGenerativeModel({ model: 'gemini-pro' }).startChat({
    history: chatHistory,
    generationConfig: GENERATION_CONFIG,
    safetySettings: SAFETY_SETTINGS,
  });
};

const addToHistory = async (role, message) => {
  if (!message) throw new ApiError(httpStatus.BAD_REQUEST, 'Please try again');
  chatHistory.push({ role: role, parts: [{ text: message }] });
};

module.exports = { startChat, addToHistory };
