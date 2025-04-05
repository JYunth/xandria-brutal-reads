
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const { isConnected, isNewUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    } else if (isNewUser) {
      navigate('/onboarding');
    }
  }, [isConnected, isNewUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background marble-texture">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
