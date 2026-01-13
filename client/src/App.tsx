import { useEffect, useState } from 'react';
import VisualBuilderCanvas from './components/VisualBuilder/Canvas';
import ComponentPalette from './components/VisualBuilder/ComponentPalette';
import PropertyPanel from './components/VisualBuilder/PropertyPanel';
import ChatInterface from './components/AIChat/ChatInterface';
import { useBuilderStore } from './stores/builderStore';
import { generateReactCode } from './lib/codeGenerator';

function App() {
  const { nodes, edges, clearCanvas } = useBuilderStore();
  const [generatedCode, setGeneratedCode] = useState<string>('');

  // Auto-generate code whenever nodes or edges change
  useEffect(() => {
    const code = generateReactCode(nodes, edges);
    setGeneratedCode(code);
  }, [nodes, edges]);

  const handleCodeGenerated = (code: string) => {
    setGeneratedCode(code);
  };

  const handleExportCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GeneratedComponent.tsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearCanvas = () => {
    if (confirm('Clear all components from the canvas?')) {
      clearCanvas();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Main Visual Builder */}
      <div className="flex-1 border-r border-gray-700 flex">
        <ComponentPalette />
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Visual Builder</h2>
            <div className="flex gap-2">
              <button
                onClick={handleClearCanvas}
                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              >
                Clear Canvas
              </button>
              <button
                onClick={handleExportCode}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                disabled={nodes.length === 0}
              >
                Export Code
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <VisualBuilderCanvas />
          </div>
        </div>
        <PropertyPanel />
      </div>

      {/* Right Panel - AI Chat */}
      <div className="w-96 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-700 bg-gray-800">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface onCodeGenerated={handleCodeGenerated} />
        </div>
      </div>
    </div>
  );
}

export default App;
