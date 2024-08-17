import { Panel, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from "reactflow";
import { useEffect, useState } from "react";
import { initialEdges, initialNodes } from "./data";
import { useLayoutedElements } from "neo4j-reactflow";
import 'reactflow/dist/style.css';

const LayoutFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [initialized, { toggle, isRunning }] = useLayoutedElements();

  useEffect(() => {
    if (initialized && !isRunning()) {
      toggle();
    }
  }, [initialized]);

  return (
    <div className="flex h-screen w-screen place-content-center">
      <div className="my-8 mt-10 w-8/12 rounded border border-gray-200 p-4 shadow-md dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-none">
        <ReactFlow
          edges={edges}
          nodes={nodes}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
        >
        </ReactFlow>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}