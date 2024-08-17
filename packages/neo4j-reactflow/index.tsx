import { forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import { useMemo, useState } from 'react';
import { Edge, Panel, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow, useStore } from '@xyflow/react';
import ellipseCollider from './forces/colliders/ellipse-collider.ts';
import { linkStraightener } from './forces/link-straightener.ts';
import { DataLink, DataLinkData, DataNodeData } from './types';

type LayoutedElement = [boolean, { toggle: () => boolean }];

const simulationBase = forceSimulation<DataNodeData, DataLinkData>()
    .force('charge', forceManyBody().strength(-500))
    .force('x', forceX().x(0).strength(0.03))
    .force('y', forceY().y(0).strength(0.03))
    .force('collide', ellipseCollider())
    .alphaTarget(0.05)
    .stop();

export const useLayoutedElements = () => {
    const { fitView, getEdges, getNodes, setNodes } = useReactFlow<DataNodeData, DataLink>()
    const initialised = useStore((store) => [...store.nodeLookup].every(([_, node]) => node.width && node.height));

    return useMemo((): LayoutedElement => {
        const nodes = getNodes();
        const forceNodes = nodes.map((node) => ({
            ...node,
            x: node.position.x,
            y: node.position.y,
        }));
        const edges = getEdges();
        let running = false;

        if (!initialised || forceNodes.length === 0) {
            return [false, { toggle: () => false }];
        }

        const linkForce = forceLink<DataNodeData, DataLink>(edges)
            .id((d) => d.id)
            .strength(0.15)
            .distance(150);

        simulationBase
            .nodes(forceNodes)
            .force('link', linkForce)
            .force('straightener', linkStraightener(edges));

        const tick = () => {
            nodes.forEach((node, i) => {
                const dragging = Boolean(
                    document.querySelector(`[data-id="${node.id}"].dragging`),
                );

                forceNodes[i].fx = dragging || !running ? node.position.x : null;
                forceNodes[i].fy = dragging || !running ? node.position.y : null;
            });

            simulationBase.tick();
            setNodes(
                nodes.map((node, i) => ({
                    ...node,
                    position: {
                        x: forceNodes[i].position.x,
                        y: forceNodes[i].position.y,
                    }
                })),
            );

            window.requestAnimationFrame(() => {
                fitView({ duration: 100, padding: 0.2 });
                setTimeout(tick, 0);
            });
        };

        const toggle = () => {
            running = !running;
            return running;
        };

        window.requestAnimationFrame(tick);

        return [true, { toggle }];
    }, [fitView, getEdges, getNodes, initialised, setNodes]);
}