import React, { useState } from "react";
import "./App.css";
import MyContext from "./MyContext";
import HomePage from "./pages/HomePage/HomePage";

function App() {
  const [cellExecutionCount, setCellExecutionCount] = useState(0);
  const [cellExecuted, setCellExecuted] = useState(false);
  const [executing, setExecuting] = useState(false);

  return (
    <MyContext.Provider
      value={{
        cellExecutionCount,
        setCellExecutionCount,
        cellExecuted,
        setCellExecuted,
        executing,
        setExecuting,
      }}
    >
      <div className="appContainer">
        <HomePage />
      </div>
    </MyContext.Provider>
  );
}

export default App;
