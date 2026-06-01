import { Suspense, lazy } from "react";

const MainApp = lazy(() => import("./MainApp"));
const MaintenancePage = lazy(() => import("./components/MaintenancePage"));
const isMaintenance = false;

const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);

const App = () => {
  if (isMaintenance) {
    return (
      <Suspense fallback={<PageLoader />}>
        <MaintenancePage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <MainApp />
    </Suspense>
  );
};

export default App;
