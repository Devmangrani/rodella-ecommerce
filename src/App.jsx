import { Suspense, lazy } from "react";
import MaintenancePage from "./components/MaintenancePage";

const MainApp = lazy(() => import("./MainApp"));
const isMaintenance = true;

const App = () => {
  if (isMaintenance) {
    return <MaintenancePage />;
  }

  return (
    <Suspense fallback={<MaintenancePage />}>
      <MainApp />
    </Suspense>
  );
};

export default App;
