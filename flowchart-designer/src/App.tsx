import React from "react";
import Flowchart from "./Components/flowchart";

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>Flowchart</h1>
      <p style={{ textAlign: "center", margin: "10px 0", fontStyle: "italic" }}>
        A simple tool to create and export flow diagrams for business processes, algorithms, or other purposes.
      </p>
      <Flowchart />
    </div>
  );
};

export default App;
