import React from "react";
import AppRoutes from "./routes/AppRoutes";
import FloatingBackground from "./components/common/FloatingBackground";

function App() {
  return (
    <>
      <FloatingBackground />
      <AppRoutes />
    </>
  );
}

export default App;