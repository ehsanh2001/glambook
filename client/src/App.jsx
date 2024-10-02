import { Outlet } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
function App() {
  return (
    <>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </>
  );
}

export default App;
