import { useBuilderStore } from '../../stores/builderStore';

export default function PropertyPanel() {
  const { nodes, selectedNodeId, updateNodeData, deleteNode, setSelectedNode } = useBuilderStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="w-64 bg-gray-800 border-l border-gray-700 p-4">
        <div className="text-gray-400 text-sm text-center mt-8">
          Select a node to edit properties
        </div>
      </div>
    );
  }

  const { data } = selectedNode;
  const { props, componentType } = data;

  const handlePropChange = (key: string, value: any) => {
    updateNodeData(selectedNode.id, {
      props: { ...props, [key]: value },
    });
  };

  const handleDelete = () => {
    deleteNode(selectedNode.id);
    setSelectedNode(null);
  };

  const renderPropertyFields = () => {
    switch (componentType) {
      case 'Button':
        return (
          <>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Label</label>
              <input
                type="text"
                value={props.label || ''}
                onChange={(e) => handlePropChange('label', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Color</label>
              <select
                value={props.color || 'blue'}
                onChange={(e) => handlePropChange('color', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="gray">Gray</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Size</label>
              <select
                value={props.size || 'md'}
                onChange={(e) => handlePropChange('size', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </>
        );

      case 'Input':
        return (
          <>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Placeholder</label>
              <input
                type="text"
                value={props.placeholder || ''}
                onChange={(e) => handlePropChange('placeholder', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Type</label>
              <select
                value={props.type || 'text'}
                onChange={(e) => handlePropChange('type', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
              </select>
            </div>
          </>
        );

      case 'Text':
        return (
          <>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Content</label>
              <input
                type="text"
                value={props.content || ''}
                onChange={(e) => handlePropChange('content', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Variant</label>
              <select
                value={props.variant || 'body'}
                onChange={(e) => handlePropChange('variant', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
              >
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="body">Body</option>
                <option value="small">Small</option>
              </select>
            </div>
          </>
        );

      case 'Card':
        return (
          <>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={props.title || ''}
                onChange={(e) => handlePropChange('title', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Padding</label>
              <input
                type="text"
                value={props.padding || '16px'}
                onChange={(e) => handlePropChange('padding', e.target.value)}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-64 bg-gray-800 border-l border-gray-700 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Properties</h3>
        <p className="text-xs text-gray-500">{componentType} Node</p>
      </div>

      <div className="space-y-3 mb-4">{renderPropertyFields()}</div>

      <button
        onClick={handleDelete}
        className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
      >
        Delete Node
      </button>
    </div>
  );
}
