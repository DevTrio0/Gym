import { Suspense } from "react";
import AppRouter from "./router";

function App() {
  return (
    <Suspense fallback={null}>
      <AppRouter />
    </Suspense>
  );
}

export default App;
