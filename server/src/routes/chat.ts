import express from 'express';
import { sendChatMessage, ChatRequest } from '../services/claude.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const chatRequest: ChatRequest = req.body;

    // Validate request
    if (!chatRequest.messages || !Array.isArray(chatRequest.messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' });
    }

    if (chatRequest.messages.length === 0) {
      return res.status(400).json({ error: 'Invalid request: messages array cannot be empty' });
    }

    // Send to Claude
    const response = await sendChatMessage(chatRequest);

    return res.json(response);
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: 'Failed to process chat request',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
