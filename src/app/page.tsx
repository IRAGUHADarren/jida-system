"use client";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const token =  localStorage.getItem("token")
  if(!token){
    router.push("/login");
  }
  useEffect(() => {
    // Ensure auth-page class is removed on home page
    document.body.classList.remove('auth-page');
  }, []);

  return (
    <main style={{backgroundColor:"dark"}}>
      <h1 style={{textTransform:"uppercase", fontWeight:"bolder", fontSize:"2rem"}}>Welcome to the Journal of <br/>Inter Discourse Academia</h1>
      <button onClick={() => router.push("/login")}>Login</button>
      <nav>
      </nav>
    </main>
  );
}