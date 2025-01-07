import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
} from "react-flow-renderer";
import { saveAs } from "file-saver";

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Start" },
    position: { x: 250, y: 0 },
  },
];

const initialEdges: Edge[] = [];

const Flowchart: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);

  // Add a new node
  const addNode = useCallback(() => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      data: { label: `Node ${nodes.length + 1}` },
      position: { x: 250, y: nodes.length * 100 },
    };

    setHistory((prev) => [...prev, { nodes, edges }]);
    setNodes((prev) => [...prev, newNode]);
  }, [nodes, edges]);

  // Undo the last action
  const undo = useCallback(() => {
    if (history.length > 0) {
      const lastState = history.pop();
      if (lastState) {
        setNodes(lastState.nodes);
        setEdges(lastState.edges);
        setHistory([...history]);
      }
    }
  }, [history]);

  // Connect two nodes
  const onConnect = useCallback(
    (connection: Connection) => setEdges((prev) => addEdge(connection, prev)),
    []
  );

  // Export flowchart as PNG
  const exportToImage = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, "flowchart.png");
      });
    }
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <div className="d-flex justify-content-center gap-3 mb-3">
        <button className="btn btn-secondary" onClick={undo}>
          Undo
        </button>
        <button className="btn btn-success" onClick={addNode}>
          Add Node
        </button>
        <button className="btn btn-primary" onClick={exportToImage}>
          Export as PNG
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background variant="lines" /> {/* Replaced "dots" with "lines" */}
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flowchart;
