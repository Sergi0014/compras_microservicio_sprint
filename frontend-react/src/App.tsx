import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Compras from "./pages/Compras";
import Productos from "./pages/Productos";
import Proveedores from "./pages/Proveedores";

const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <Layout currentPath={location.pathname}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppContent />
    </Router>
  );
}

export default App;
