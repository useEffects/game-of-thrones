import { forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import { useMemo } from 'react';
import { useNodesInitialized, useReactFlow } from 'reactflow';
import ellipseCollider from './forces/colliders/ellipse-collider.ts';
import { linkStraightener } from './forces/link-straightener.ts';
import { DataLink, DataLinkData, DataNodeData } from './types.ts';

const simulation = forceSimulation<DataNodeData, DataLinkData>()
    .force('charge', forceManyBody().strength(-1000))
    .force('x', forceX().x(0).strength(0.05))
    .force('y', forceY().y(0).strength(0.05))
    .force('collide', ellipseCollider())
    .alphaTarget(0.05)
    .stop();


export const useLayoutedElements = () => {
    const { getNodes, setNodes, getEdges, fitView } = useReactFlow<DataNodeData, DataLink>();
    const initialized = useNodesInitialized();

    return useMemo((): [boolean, { toggle: () => void, isRunning: () => boolean }] => {
        let nodes = getNodes().map((node) => ({
            ...node,
            x: node.position.x,
            y: node.position.y,
        }));
        let edges = getEdges().map((edge) => edge);
        let running = false;

        // If React Flow hasn't initialized our nodes with a width and height yet, or
        // if there are no nodes in the flow, then we can't run the simulation!
        if (!initialized || nodes.length === 0) return [false, { toggle: () => { }, isRunning: () => false }];

        simulation
            .nodes(nodes)
            .force('link', forceLink<DataNodeData, DataLink>(edges)
                .id((d) => d.id)
                .strength(0.05)
                .distance(100))
            .force("straighten", linkStraightener(edges))

        // The tick function is called every animation frame while the simulation is
        // running and progresses the simulation one step forward each time.
        const tick = () => {
            getNodes().forEach((node, i) => {
                const dragging = Boolean(
                    document.querySelector(`[data-id="${node.id}"].dragging`),
                );

                // Setting the fx/fy properties of a node tells the simulation to "fix"
                // the node at that position and ignore any forces that would normally
                // cause it to move.
                nodes[i].fx = dragging ? node.position.x : null;
                nodes[i].fy = dragging ? node.position.y : null;
            });

            simulation.tick();
            setNodes(
                nodes.map((node) => ({ ...node, position: { x: node.x, y: node.y } })),
            );

            window.requestAnimationFrame(() => {
                // Give React and React Flow a chance to update and render the new node
                // positions before we fit the viewport to the new layout.
                fitView();

                // If the simulation hasn't be stopped, schedule another tick.
                if (running) tick();
            });
        };

        const toggle = () => {
            running = !running;
            running && window.requestAnimationFrame(tick);
        };

        const isRunning = () => running;

        return [true, { toggle, isRunning }];

    }, [fitView, getEdges, getNodes, initialized, setNodes]);
}