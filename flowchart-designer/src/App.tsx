import React from "react";
import { ReactFlowProvider } from "react-flow-renderer";
import Flowchart from "./Components/flowchart";

const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <div>
        <h1 style={{ textAlign: "center", margin: "20px 0" }}>Flowchart</h1>
        <p style={{ textAlign: "center", margin: "10px 0", fontStyle: "italic" }}>
          A simple tool to create and export flow diagrams for business processes, algorithms, or other purposes.
        </p>
        <Flowchart />
      </div>
    </ReactFlowProvider>
  );
};

export default App;

