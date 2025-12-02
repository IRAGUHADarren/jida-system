"use client";
import { AuthLoginForm } from "@/components/forms/author/auth-login-form";
import { useEffect } from "react";

export default function LoginRoute() {


  
  useEffect(() => {
    // Add auth-page class to body when component mounts
    document.body.classList.add('auth-page');
    
    // Clean up when component unmounts
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  return <AuthLoginForm />;
}
