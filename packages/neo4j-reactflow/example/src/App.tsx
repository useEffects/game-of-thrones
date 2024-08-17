import { Panel, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from "@xyflow/react";
import { useState } from "react";
import { initialEdges, initialNodes } from "./data";
import { useLayoutedElements } from "neo4j-reactflow";
import '@xyflow/react/dist/style.css';

const LayoutFlow = () => {
  const [running, setRunning] = useState(false);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [initialised, { toggle }] = useLayoutedElements();

  return (
    <div className="flex h-screen w-screen place-content-center">
      <div className="my-8 mt-10 w-8/12 rounded border border-gray-200 p-4 shadow-md dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-none">
        <ReactFlow
          edges={edges}
          nodes={nodes}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
        >
          <Panel position="top-left">
            {initialised && (
              <button onClick={() => setRunning(toggle())}>
                {running ? 'Stop' : 'Start'} force simulation
              </button>
            )}
          </Panel>
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