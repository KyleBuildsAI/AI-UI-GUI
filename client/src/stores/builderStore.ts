import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

export interface ComponentNodeData {
  label: string;
  props: Record<string, any>;
  componentType: 'Button' | 'Input' | 'Text' | 'Card' | 'Container';
}

interface BuilderStore {
  nodes: Node<ComponentNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;

  // Node operations
  setNodes: (nodes: Node<ComponentNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (type: ComponentNodeData['componentType'], position: { x: number; y: number }) => void;
  deleteNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<ComponentNodeData>) => void;
  setSelectedNode: (id: string | null) => void;

  // Utility
  clearCanvas: () => void;
}

let nodeIdCounter = 1;

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (type, position) => {
    const id = `node-${nodeIdCounter++}`;
    const defaultProps: Record<string, Record<string, any>> = {
      Button: { label: 'Click me', color: 'blue', size: 'md' },
      Input: { placeholder: 'Enter text...', type: 'text' },
      Text: { content: 'Text', variant: 'body', fontSize: '16px' },
      Card: { title: 'Card Title', padding: '16px' },
      Container: { direction: 'column', gap: '8px' },
    };

    const newNode: Node<ComponentNodeData> = {
      id,
      type,
      position,
      data: {
        label: type,
        componentType: type,
        props: defaultProps[type] || {},
      },
    };

    set({ nodes: [...get().nodes, newNode] });
  },

  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  clearCanvas: () => set({ nodes: [], edges: [], selectedNodeId: null }),
}));
