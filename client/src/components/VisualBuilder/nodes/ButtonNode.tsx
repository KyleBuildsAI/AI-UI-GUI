import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ComponentNodeData } from '../../../stores/builderStore';

function ButtonNode({ data, selected }: NodeProps<ComponentNodeData>) {
  const { props } = data;
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    red: 'bg-red-500 hover:bg-red-600',
    gray: 'bg-gray-500 hover:bg-gray-600',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <div className={`${selected ? 'ring-2 ring-blue-400' : ''}`}>
      <Handle type="target" position={Position.Top} />

      <div className="bg-white p-3 rounded-lg shadow-md border-2 border-gray-200 min-w-[150px]">
        <div className="text-xs text-gray-500 mb-2 font-semibold">BUTTON</div>
        <button
          className={`${colorClasses[props.color || 'blue']} ${
            sizeClasses[props.size || 'md']
          } text-white rounded transition-colors w-full`}
        >
          {props.label || 'Button'}
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(ButtonNode);
