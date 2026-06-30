import { Routes, Route, Navigate} from "react-router-dom";
import { useAuth } from "./context/Authcontext";

import Login from "./pages/Login";

function ProtectedRoute({children}) {
  const {user} = useAuth();

  if(!user){
    return <Navigate to = "/login" replace />;
  }
  return children;
}

function App(){
  return (
    <Routes>
      {/* Public Route */}
      <Route path = "/login" element={<Login />} />
      {/* Route Redirect */}
      <Route path = "/" element={<Navigate to="/login" replace/>} />
      {/* Protected Placeholders */}
      {/* 
      <Route
        path = "/home"
        element= {
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        } 
      />
         */}
    </Routes> 
  );
}

export default App;