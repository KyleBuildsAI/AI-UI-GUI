import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ComponentNodeData } from '../../../stores/builderStore';

function TextNode({ data, selected }: NodeProps<ComponentNodeData>) {
  const { props } = data;

  const variantClasses: Record<string, string> = {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-bold',
    h3: 'text-xl font-bold',
    body: 'text-base',
    small: 'text-sm text-gray-600',
  };

  return (
    <div className={`${selected ? 'ring-2 ring-blue-400' : ''}`}>
      <Handle type="target" position={Position.Top} />

      <div className="bg-white p-3 rounded-lg shadow-md border-2 border-gray-200 min-w-[150px]">
        <div className="text-xs text-gray-500 mb-2 font-semibold">TEXT</div>
        <p className={variantClasses[props.variant || 'body']}>
          {props.content || 'Text'}
        </p>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(TextNode);
