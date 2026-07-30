import React from "react";
import AppRoutes from "./routes/AppRoutes";
import CustomCursor from "./components/common/CustomCursor";
import FloatingBackground from "./components/common/FloatingBackground";

function App() {
  return (
    <>
      {/* <CustomCursor /> */}
      <FloatingBackground />
      <AppRoutes />
    </>
  );
}

export default App;