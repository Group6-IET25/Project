import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [token, setToken] = useState<boolean>(!!localStorage.getItem("jwt"));

  useEffect(() => {
    console.log("Dashboard mounting, token:", localStorage.getItem("jwt"));
    
    return () => {
      console.log("Dashboard unmounting, token:", localStorage.getItem("jwt"));
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem("jwt");
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
