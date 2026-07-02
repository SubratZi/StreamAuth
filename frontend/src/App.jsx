import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import NotFound from "./pages/NotFound";
import Video from "./pages/Video"
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Subscribe from "./pages/Subscribe";
import Demo from "./pages/Demo";

function App(){
  return (
    <Routes>
      {/* Public Route */}
      <Route path = "/login" element={<Login />} />
      <Route path = "/register" element={<Register/>} />
      <Route path= "/demo" element={<Demo/>} />

      {/* Home */}
      <Route path = "/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />

      {/* Protected Routes */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/> 
      <Route path="/video/:id" element={<ProtectedRoute><Video/></ProtectedRoute>}/>
      <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />

      {/* Route Redirect */}
      <Route path = "/" element={<Navigate to="/login" replace/>} />

      {/* Admin Access */}
      <Route path = "/upload" element={<AdminRoute><Upload/></AdminRoute>} />

      {/* 404 */}
      <Route path = "/404" element={<NotFound/>} />

      {/* Unknown Route */}
      <Route path = "*" element={<Navigate to="/404" replace />} />
    </Routes> 
  );
}

export default App;