import Anthropic from '@anthropic-ai/sdk';

// Create client lazily to ensure environment variables are loaded
function getClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  systemPrompt?: string;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  try {
    const client = getClient();
    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      system: request.systemPrompt || 'You are a helpful AI assistant for visual code building.',
      messages: request.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const textContent = response.content.find(block => block.type === 'text');

    return {
      content: textContent && 'text' in textContent ? textContent.text : '',
      model: response.model,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to get response from Claude API');
  }
}
