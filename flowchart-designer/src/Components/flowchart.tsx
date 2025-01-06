import 'admin-lte/dist/css/adminlte.min.css';
import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  OnConnect,
} from "react-flow-renderer";
import { saveAs } from "file-saver";

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
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        return changes.reduce((acc, change) => {
          if ('id' in change) {
            const index = acc.findIndex((node) => node.id === change.id);
            if (index >= 0) {
              acc[index] = { ...acc[index], ...change };
            } else {
              acc.push(change as Node);
            }
          }
          return acc;
        }, [...nds]);
      });
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        return changes.reduce((acc, change) => {
          if ('id' in change) {
            const index = acc.findIndex((edge) => edge.id === change.id);
            if (index >= 0) {
              acc[index] = { ...acc[index], ...change };
            } else {
              acc.push(change as Edge);
            }
          }
          return acc;
        }, [...eds]);
      });
    },
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const exportToImage = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, "flowchart.png");
      });
    }
  }, []);

  return (
    <div className="container-fluid" style={{ height: "100vh" }}>
      <div className="row">
        <div className="col-12">
          <h1 className="text-center text-primary my-3">Simple Flowchart Designer</h1>
        </div>
      </div>
      <div className="row position-relative" style={{ height: "90vh" }}>
        <div className="col-12">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background variant="dots" /> {/* Updated Background variant */}
            <Controls />
          </ReactFlow>
          <button
            onClick={exportToImage}
            className="btn btn-primary position-absolute"
            style={{ right: "20px", top: "20px" }}
          >
            Export as PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flowchart;

