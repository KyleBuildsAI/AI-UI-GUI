import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ComponentNodeData } from '../../../stores/builderStore';

function CardNode({ data, selected }: NodeProps<ComponentNodeData>) {
  const { props } = data;

  return (
    <div className={`${selected ? 'ring-2 ring-blue-400' : ''}`}>
      <Handle type="target" position={Position.Top} />

      <div className="bg-white p-3 rounded-lg shadow-md border-2 border-gray-200 min-w-[250px]">
        <div className="text-xs text-gray-500 mb-2 font-semibold">CARD</div>
        <div className="border border-gray-300 rounded-lg" style={{ padding: props.padding || '16px' }}>
          <h3 className="font-bold text-lg mb-2">{props.title || 'Card Title'}</h3>
          <p className="text-gray-600 text-sm">Card content goes here</p>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(CardNode);
