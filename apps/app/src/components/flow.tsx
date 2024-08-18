import { useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import ReactFlow, {
    Background, ProOptions, useNodesState, useEdgesState, NodeOrigin, NodeMouseHandler, addEdge, OnConnect, Edge, Node, MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { uniqBy } from "lodash"
import useForceLayout from 'src/hooks/force-layout';
import { neo4jApi } from 'src/lib/constants';
import styles from "src/styles/flow.module.css"

const proOptions: ProOptions = { account: 'paid-pro', hideAttribution: true };

type FlowProps = {
    strength?: number;
    distance?: number;
    query?: string;
};

const nodeOrigin: NodeOrigin = [0.5, 0.5];


function Flow({ strength = -1000, distance = 150, query = "" }: FlowProps = {}) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    console.log({ query })

    useEffect(() => {
        if (query) {
            console.log(query)
            setNodesAndEdges(setNodes, setEdges, query);
        }
    }, [query])

    useForceLayout({ strength, distance });

    const onNodeClick: NodeMouseHandler = useCallback(
        async (_, node) => {
            // use pagination
            const query = `MATCH (n)-[r]-(m) WHERE ID(n) = ${node.id} RETURN n, r, m`;
            setNodesAndEdges(setNodes, setEdges, query);
        },
        [nodes.length, setNodes, setEdges]
    );

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            proOptions={proOptions}
            onConnect={onConnect}
            nodeOrigin={nodeOrigin}
            onNodeClick={onNodeClick}
            defaultViewport={{
                x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
                y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
                zoom: 0,
            }}
        >
            <Background />
        </ReactFlow>
    );
}

type Neo4jNode = {
    id: number;
    labels: string[];
    properties: { name: string };
}

type Neo4jRelationship = {
    id: number;
    type: string;
    start_node: string;
    end_node: string;
}

const setNodesAndEdges = (nodesDispatcher: Dispatch<SetStateAction<Node[]>>, edgesDispatcher: Dispatch<SetStateAction<Edge[]>>, query: string) => {
    fetch(neo4jApi, {
        method: 'POST',
        body: JSON.stringify({ query }),
    }).then((res) => res.json()).then((res: {
        response: {
            // Could not find type from Neo4j Driver
            nodes: Neo4jNode[];
            relationships: Neo4jRelationship[];
        }
    }) => {
        const nodes: Node[] = res.response.nodes.map((node, i) => {
            return {
                id: String(node.id),
                position: { x: 100 * i * Math.random(), y: 100 * i * Math.random() },
                data: { label: node.properties.name, ...node.properties },
                className: styles.node,
            }
        });
        const edges: Edge[] = res.response.relationships.map((relationship) => {
            return {
                id: String(relationship.id),
                source: String(relationship.start_node),
                target: String(relationship.end_node),
                label: relationship.type,
                markerStart: {
                    type: MarkerType.Arrow
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20,
                    color: '#FF0072',
                },
                style: {
                    strokeWidth: 2,
                    stroke: '#FF0072',
                },
                type: "straight",
            }
        });
        nodesDispatcher(prev => uniqBy([...prev, ...nodes], 'id'));
        edgesDispatcher(prev => uniqBy([...prev, ...edges], 'id'));
    });
}

export default Flow;