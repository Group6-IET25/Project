import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [token, setToken] = useState<boolean>(!!localStorage.getItem("token"));

  useEffect(() => {
    console.log("Dashboard mounting, token:", localStorage.getItem("token"));
    
    return () => {
      console.log("Dashboard unmounting, token:", localStorage.getItem("token"));
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem("token");
      setToken(!!storedToken);   
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return token ? <Outlet /> : <Navigate to="/home" />;
};

export default ProtectedRoute;
