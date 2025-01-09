import React, { useState, useCallback } from "react";
// useState: A React hook that lets you create and manage state variables in a component.
//useCallback: A React hook that helps you remember (or "memoize") a function,
//  so it doesn't get recreated unnecessarily during re-renders.
import ReactFlow, { // The main library to create and manage flowcharts.
  addEdge, // A helper function to add connections (edges) between flowchart nodes.
  Background, //  Adds a visual grid or lines in the background for better alignment.
  Controls, //  Provides buttons for zooming and panning the flowchart
  useEdgesState, // Special hooks provided by React Flow to manage the nodes and edges of the flowchart.
  useNodesState,
  Connection, //  Types provided by React Flow to define what a connection (edge) or a single node looks like.
  Edge,
  Node,
} from "react-flow-renderer";
import { saveAs } from "file-saver"; 
// saveAs: A function from the file-saver library to download files (like saving the flowchart as an image).
import "admin-lte/dist/css/adminlte.min.css"; // AdminLTE styles

// Initial nodes and edges
const initialNodes: Node[] = [ // An array defining the starting node in the flowchart.
  {
    id: "1", // A unique identifier for the node.
    type: "input", // Indicates the type of node (e.g., "input" means it's an input node).
    data: { label: "Start" }, // Contains the label ("Start") that appears on the node.
    position: { x: 250, y: 0 },
     // position: Specifies where the node appears on the screen (250 pixels from the left, 0 pixels from the top).
  },
];

const initialEdges: Edge[] = []; // Starts with no connections (edges) between the nodes.

const Flowchart: React.FC = () => { // define te flowchart as  the functional component.
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes); // nodes means keep the track of all nodes in flowchart 
  // set nodes means update the list of the nodes onNodesChange: A function provided by React Flow to handle changes in the nodes.
 //Similarly, edges, setEdges, and onEdgesChange work for edges.
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);// setHistory: Updates the history whenever there’s a change.
  // history: Tracks the previous states of the flowchart (for undo functionality).

  // Add a new node
  const addNode = useCallback(() => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(), // The new node gets an ID based on the current number of nodes.
      data: { label: `Node ${nodes.length + 1}` }, // The label shows the node number.
      position: { x: 250, y: nodes.length * 100 }, 
      // position: Each new node is placed below the previous one (y-coordinate increases by 100).
    };

    setHistory((prev) => [...prev, { nodes, edges }]); // Saves the current state before adding the new node (for undo).
    setNodes((prev) => [...prev, newNode]); //  Adds the new node to the existing list of nodes. 
  }, [nodes, edges]);

  // Undo the last action
  const undo = useCallback(() => {
    if (history.length > 0) {
      const lastState = history[history.length - 1]; // Retrieves the last saved nodes and edges from history.
      setNodes(lastState.nodes); // Updates the flowchart to the previous state.
      setEdges(lastState.edges);
      setHistory((prev) => prev.slice(0, prev.length - 1)); // Removes the last entry from the history.
    }
  }, [history]);

  // Connect two nodes
  const onConnect = useCallback(
    (connection: Connection) => setEdges((prev) => addEdge(connection, prev)),
    [] // Adds a connection (edge) between two nodes using the addEdge utility.

  );

  // Export flowchart as PNG
  const exportToImage = useCallback(() => {
    const canvas = document.querySelector("canvas"); // Finds the canvas element where the flowchart is drawn.
    if (canvas) {
      canvas.toBlob((blob) => { // Converts the canvas into an image file (blob).
        if (blob) saveAs(blob, "flowchart.png"); // Uses saveAs to download the image as "flowchart.png".  
      });
    }
  }, []);

  return (
    <div style={{ height: "75vh" }}>
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

      <ReactFlow // ReactFlow: The main component to display and manage the flowchart
        nodes={nodes} // Passes the current nodes and edges to React Flow.
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect} //  Handles changes to nodes, edges, or connections.
        fitView // Ensures the entire flowchart fits within the screen.
      >
        <Background variant="lines"  // Adds a grid with lines in the background.
        />
        <Controls  // Provides zoom and pan controls.
         />
      </ReactFlow>
    </div>
  );
};

export default Flowchart;

