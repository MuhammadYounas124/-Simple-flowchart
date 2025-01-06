import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from "react-flow-renderer";
import { saveAs } from "file-saver";

// Define initial nodes and edges
const initialNodes: Node[] = [
  {
    id: "1",
    type: "input", // Special type for start nodes
    data: { label: "Start" },
    position: { x: 250, y: 0 },
  },
];

const initialEdges: Edge[] = [];

const Flowchart: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Export canvas as an image
  const exportToImage = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, "flowchart.png");
      });
    }
  }, []);

  // Undo functionality
  const undo = useCallback(() => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setNodes(lastState.nodes);
      setEdges(lastState.edges);
      setHistory((hist) => hist.slice(0, -1));
    }
  }, [history]);

  // Add nodes dynamically
  const addNode = useCallback(() => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type: "default",
      data: { label: `Node ${nodes.length + 1}` },
      position: { x: 250, y: nodes.length * 100 },
    };
    setHistory((hist) => [...hist, { nodes, edges }]);
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, edges, setNodes]);

  return (
    <div className="container-fluid" style={{ height: "100vh" }}>
      <div className="row">
        <div className="col-12">
          <h1 className="text-center text-primary my-3">Flowchart Diagram</h1>
        </div>
      </div>
      <div className="row position-relative" style={{ height: "90vh" }}>
        <div className="col-12">
          <div className="d-flex justify-content-between mb-3">
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
            <Background variant="dots" /> {/* Corrected variant */}
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default Flowchart;
