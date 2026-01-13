import { NodeTypes } from 'reactflow';
import ButtonNode from './ButtonNode';
import InputNode from './InputNode';
import TextNode from './TextNode';
import CardNode from './CardNode';

export const nodeTypes: NodeTypes = {
  Button: ButtonNode,
  Input: InputNode,
  Text: TextNode,
  Card: CardNode,
};
