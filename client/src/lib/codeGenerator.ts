import { Node, Edge } from 'reactflow';
import { ComponentNodeData } from '../stores/builderStore';

export function generateReactCode(nodes: Node<ComponentNodeData>[], edges: Edge[]): string {
  if (nodes.length === 0) {
    return '// Add components to the canvas to generate code\n';
  }

  // Build parent-child relationships from edges
  const childrenMap = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!childrenMap.has(edge.source)) {
      childrenMap.set(edge.source, []);
    }
    childrenMap.get(edge.source)!.push(edge.target);
  });

  // Find root nodes (nodes without incoming edges)
  const hasIncomingEdge = new Set(edges.map((e) => e.target));
  const rootNodes = nodes.filter((n) => !hasIncomingEdge.has(n.id));

  // Helper function to generate JSX for a node
  const generateNodeJSX = (node: Node<ComponentNodeData>, indent: string = '      '): string => {
    const { componentType, props } = node.data;
    const children = childrenMap.get(node.id) || [];

    switch (componentType) {
      case 'Button':
        return `${indent}<button className="px-${props.size === 'sm' ? '3' : props.size === 'lg' ? '6' : '4'} py-${props.size === 'sm' ? '1' : props.size === 'lg' ? '3' : '2'} bg-${props.color}-500 hover:bg-${props.color}-600 text-white rounded">\n${indent}  ${props.label}\n${indent}</button>`;

      case 'Input':
        return `${indent}<input\n${indent}  type="${props.type || 'text'}"\n${indent}  placeholder="${props.placeholder || ''}"\n${indent}  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"\n${indent}/>`;

      case 'Text':
        const Tag = props.variant === 'h1' ? 'h1' : props.variant === 'h2' ? 'h2' : props.variant === 'h3' ? 'h3' : 'p';
        const sizeClass = props.variant === 'h1' ? 'text-3xl font-bold' : props.variant === 'h2' ? 'text-2xl font-bold' : props.variant === 'h3' ? 'text-xl font-bold' : props.variant === 'small' ? 'text-sm text-gray-600' : 'text-base';
        return `${indent}<${Tag} className="${sizeClass}">${props.content}</${Tag}>`;

      case 'Card':
        let cardContent = `${indent}<div className="border border-gray-300 rounded-lg p-4">\n`;
        cardContent += `${indent}  <h3 className="font-bold text-lg mb-2">${props.title}</h3>\n`;

        if (children.length > 0) {
          children.forEach((childId) => {
            const childNode = nodes.find((n) => n.id === childId);
            if (childNode) {
              cardContent += generateNodeJSX(childNode, indent + '  ') + '\n';
            }
          });
        } else {
          cardContent += `${indent}  <p className="text-gray-600">Card content</p>\n`;
        }

        cardContent += `${indent}</div>`;
        return cardContent;

      default:
        return `${indent}<div>/* ${componentType} */</div>`;
    }
  };

  // Generate imports
  let code = `import React from 'react';\n\n`;

  // Generate component
  code += `export default function GeneratedComponent() {\n`;
  code += `  return (\n`;
  code += `    <div className="p-8 max-w-4xl mx-auto">\n`;

  if (rootNodes.length === 0) {
    // If all nodes are connected, just render them all in sequence
    nodes.forEach((node) => {
      code += generateNodeJSX(node) + '\n';
    });
  } else {
    // Render root nodes (these will include their children)
    rootNodes.forEach((node, index) => {
      code += generateNodeJSX(node);
      if (index < rootNodes.length - 1) code += '\n';
    });
  }

  code += `\n    </div>\n`;
  code += `  );\n`;
  code += `}\n`;

  return code;
}
