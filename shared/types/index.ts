// Shared types between client and server

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  messages: ChatMessage[];
  systemPrompt?: string;
  builderContext?: BuilderContext;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  nodeOperations?: NodeOperation[];
}

export interface VisualNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    code?: string;
    [key: string]: any;
  };
}

export interface VisualEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface VisualBuilderState {
  nodes: VisualNode[];
  edges: VisualEdge[];
  generatedCode: string;
}

export interface CodeGenerationRequest {
  prompt: string;
  context?: VisualBuilderState;
  language?: string;
}

export interface CodeGenerationResponse {
  code: string;
  explanation?: string;
}

// AI Builder Integration Types
export interface BuilderContext {
  nodes: Array<{
    id: string;
    type: string;
    props: Record<string, any>;
  }>;
  edges: Array<{
    source: string;
    target: string;
  }>;
}

export type NodeOperationType = 'add' | 'update' | 'delete' | 'connect';

export interface NodeOperation {
  action: NodeOperationType;
  nodeType?: 'Button' | 'Input' | 'Text' | 'Card';
  nodeId?: string;
  props?: Record<string, any>;
  position?: { x: number; y: number };
  sourceId?: string;
  targetId?: string;
}
