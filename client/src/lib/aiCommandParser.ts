import { NodeOperation } from '../../../shared/types';
import { ComponentNodeData } from '../stores/builderStore';

export interface ParsedAIResponse {
  message: string;
  operations: NodeOperation[];
}

export function parseAIResponse(content: string): ParsedAIResponse {
  const operations: NodeOperation[] = [];
  let message = content;

  // Try to extract JSON operations from the response
  const jsonMatch = content.match(/```json\s*(\[[\s\S]*?\])\s*```/);
  if (jsonMatch) {
    try {
      const parsedOps = JSON.parse(jsonMatch[1]);
      if (Array.isArray(parsedOps)) {
        operations.push(...parsedOps);
        // Remove the JSON block from the message
        message = content.replace(jsonMatch[0], '').trim();
      }
    } catch (e) {
      console.error('Failed to parse JSON operations:', e);
    }
  }

  // If no JSON found, try to parse natural language commands
  if (operations.length === 0) {
    operations.push(...parseNaturalLanguageCommands(content));
  }

  return { message, operations };
}

function parseNaturalLanguageCommands(content: string): NodeOperation[] {
  const operations: NodeOperation[] = [];
  const lines = content.toLowerCase().split('\n');

  let currentY = 100;

  for (const line of lines) {
    // Detect "add" or "create" commands
    if (line.includes('add') || line.includes('create')) {
      // Check for button
      if (line.includes('button')) {
        const labelMatch = line.match(/(?:button|labeled?|with text|saying)\s+["']?([^"'\n]+)["']?/i);
        operations.push({
          action: 'add',
          nodeType: 'Button',
          props: {
            label: labelMatch ? labelMatch[1].trim() : 'Button',
            color: line.includes('green') ? 'green' : line.includes('red') ? 'red' : 'blue',
            size: 'md',
          },
          position: { x: 200, y: currentY },
        });
        currentY += 100;
      }

      // Check for input
      if (line.includes('input') || line.includes('text field') || line.includes('textbox')) {
        const placeholderMatch = line.match(/(?:placeholder|for|labeled?)\s+["']?([^"'\n]+)["']?/i);
        const isPassword = line.includes('password');
        const isEmail = line.includes('email');

        operations.push({
          action: 'add',
          nodeType: 'Input',
          props: {
            placeholder: placeholderMatch ? placeholderMatch[1].trim() : 'Enter text...',
            type: isPassword ? 'password' : isEmail ? 'email' : 'text',
          },
          position: { x: 200, y: currentY },
        });
        currentY += 100;
      }

      // Check for text/heading
      if (line.includes('text') || line.includes('heading') || line.includes('title') || line.includes('label')) {
        const contentMatch = line.match(/(?:text|saying|labeled?|titled?|heading)\s+["']?([^"'\n]+)["']?/i);
        const variant = line.includes('h1') || line.includes('heading 1') ? 'h1' :
                       line.includes('h2') || line.includes('heading 2') ? 'h2' :
                       line.includes('h3') || line.includes('heading 3') ? 'h3' :
                       line.includes('small') ? 'small' : 'body';

        operations.push({
          action: 'add',
          nodeType: 'Text',
          props: {
            content: contentMatch ? contentMatch[1].trim() : 'Text',
            variant,
          },
          position: { x: 200, y: currentY },
        });
        currentY += 100;
      }

      // Check for card
      if (line.includes('card')) {
        const titleMatch = line.match(/(?:card|titled?)\s+["']?([^"'\n]+)["']?/i);
        operations.push({
          action: 'add',
          nodeType: 'Card',
          props: {
            title: titleMatch ? titleMatch[1].trim() : 'Card',
            padding: '16px',
          },
          position: { x: 200, y: currentY },
        });
        currentY += 100;
      }
    }
  }

  return operations;
}

export function applyOperationsToStore(
  operations: NodeOperation[],
  addNode: (type: ComponentNodeData['componentType'], position: { x: number; y: number }) => void,
  updateNodeData: (id: string, data: any) => void,
  deleteNode: (id: string) => void,
  nodes: any[]
) {
  operations.forEach((op) => {
    switch (op.action) {
      case 'add':
        if (op.nodeType && op.position) {
          addNode(op.nodeType, op.position);
          // Update the props of the newly added node
          if (op.props && nodes.length > 0) {
            const lastNode = nodes[nodes.length - 1];
            setTimeout(() => {
              updateNodeData(lastNode.id, { props: { ...lastNode.data.props, ...op.props } });
            }, 50);
          }
        }
        break;

      case 'update':
        if (op.nodeId && op.props) {
          updateNodeData(op.nodeId, { props: op.props });
        }
        break;

      case 'delete':
        if (op.nodeId) {
          deleteNode(op.nodeId);
        }
        break;

      // Connect operation would be handled here
      case 'connect':
        // This would require adding edges, not implemented yet
        break;
    }
  });
}
