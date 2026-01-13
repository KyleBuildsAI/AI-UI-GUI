import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import type { ChatMessage, ChatResponse, BuilderContext } from '../../../../shared/types';
import { useBuilderStore } from '../../stores/builderStore';
import { parseAIResponse, applyOperationsToStore } from '../../lib/aiCommandParser';

interface Props {
  onCodeGenerated: (code: string) => void;
}

export default function ChatInterface({ onCodeGenerated }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { nodes, edges, addNode, updateNodeData, deleteNode } = useBuilderStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      // Build context from current builder state
      const builderContext: BuilderContext = {
        nodes: nodes.map((n) => ({
          id: n.id,
          type: n.data.componentType,
          props: n.data.props,
        })),
        edges: edges.map((e) => ({
          source: e.source,
          target: e.target,
        })),
      };

      const response = await axios.post<ChatResponse>(`${apiUrl}/api/chat`, {
        messages: [...messages, userMessage],
        builderContext,
        systemPrompt: `You are an AI assistant that helps build React UIs visually.

Current canvas state:
${nodes.length === 0 ? '- Canvas is empty' : `- ${nodes.length} components: ${nodes.map(n => `${n.data.componentType}(${JSON.stringify(n.data.props)})`).join(', ')}`}

Available components: Button, Input, Text, Card

When the user asks to add components, respond with:
1. A friendly message explaining what you're doing
2. A JSON code block with operations like this:

\`\`\`json
[
  {
    "action": "add",
    "nodeType": "Button",
    "props": { "label": "Click me", "color": "blue", "size": "md" },
    "position": { "x": 200, "y": 100 }
  }
]
\`\`\`

Examples:
- "Create a login form" → Add Text("Login"), Input(email), Input(password), Button("Sign In")
- "Add a green button" → Add Button with color: "green"
- "Make the button red" → Update the selected button's color

Be concise and helpful!`,
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Parse AI response for node operations
      const { message, operations } = parseAIResponse(response.data.content);

      // Apply operations to the canvas
      if (operations.length > 0) {
        console.log('Applying operations:', operations);
        applyOperationsToStore(operations, addNode, updateNodeData, deleteNode, nodes);
      }

      // Extract code blocks and pass to parent (for direct code generation)
      const codeBlockRegex = /```(?:jsx|tsx|typescript|javascript)\n([\s\S]*?)```/g;
      const matches = response.data.content.matchAll(codeBlockRegex);
      for (const match of matches) {
        if (match[1]) {
          onCodeGenerated(match[1].trim());
          break;
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the server is running and try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center mt-8">
            <p className="font-semibold mb-2">Try asking me:</p>
            <p className="text-sm">"Create a login form"</p>
            <p className="text-sm">"Add a green submit button"</p>
            <p className="text-sm">"Add a heading that says Welcome"</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Claude to build components..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
