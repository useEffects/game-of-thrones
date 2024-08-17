import { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';
import { Edge, Node } from 'reactflow';

export type DataNodeData = {
    id: string;
    height: number;
    width: number;
    data: Record<string, any>;
    position: {
        x: number;
        y: number;
    }
} & SimulationNodeDatum & Record<string, unknown>;
export type DataNode = Node<DataNodeData>;
export type DataLink = Edge<DataLinkData>;
export type DataLinkData = SimulationLinkDatum<DataNodeData> & { id: string } & Record<string, unknown>;