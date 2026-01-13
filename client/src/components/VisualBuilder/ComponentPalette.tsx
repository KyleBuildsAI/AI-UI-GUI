import { useBuilderStore, ComponentNodeData } from '../../stores/builderStore';

const components: { type: ComponentNodeData['componentType']; icon: string; description: string }[] = [
  { type: 'Button', icon: '🔘', description: 'Interactive button' },
  { type: 'Input', icon: '📝', description: 'Text input field' },
  { type: 'Text', icon: '📄', description: 'Text display' },
  { type: 'Card', icon: '🃏', description: 'Card container' },
];

export default function ComponentPalette() {
  const { addNode } = useBuilderStore();

  const handleAddComponent = (type: ComponentNodeData['componentType']) => {
    // Add node at center of viewport (approximate)
    addNode(type, { x: 250, y: 150 });
  };

  return (
    <div className="w-48 bg-gray-800 border-r border-gray-700 p-3">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Components</h3>
      <div className="space-y-2">
        {components.map((component) => (
          <button
            key={component.type}
            onClick={() => handleAddComponent(component.type)}
            className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{component.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{component.type}</div>
                <div className="text-xs text-gray-400">{component.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
