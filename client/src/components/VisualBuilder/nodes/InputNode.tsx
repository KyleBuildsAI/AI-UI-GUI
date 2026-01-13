import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ComponentNodeData } from '../../../stores/builderStore';

function InputNode({ data, selected }: NodeProps<ComponentNodeData>) {
  const { props } = data;

  return (
    <div className={`${selected ? 'ring-2 ring-blue-400' : ''}`}>
      <Handle type="target" position={Position.Top} />

      <div className="bg-white p-3 rounded-lg shadow-md border-2 border-gray-200 min-w-[200px]">
        <div className="text-xs text-gray-500 mb-2 font-semibold">INPUT</div>
        <input
          type={props.type || 'text'}
          placeholder={props.placeholder || 'Enter text...'}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          disabled
        />
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(InputNode);
