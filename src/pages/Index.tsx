
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect automatically - render the login page directly
    // This ensures that when visiting the root URL, content is displayed
  }, [navigate]);

  // Return the LoginPage component directly
  return <LoginPage />;
};

export default Index;
