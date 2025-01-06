import React from "react";
import Flowchart from "./Components/flowchart";

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        Simple Flowchart Designer
      </h1>
      <Flowchart />
    </div>
  );
};

export default App;
