"use client";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Ensure auth-page class is removed on home page
    document.body.classList.remove('auth-page');
  }, []);

  return (
    <main>
      <h1>Welcome to the Journal of Inter Discourse Academia</h1>
      <nav>
        <Button variant="outline" size="default" onClick={() => router.push("/login")}>
          Login
        </Button>
        <Button variant="outline" size="icon" onClick={() => router.push("/register")}>
          Register
        </Button>
      </nav>
    </main>
  );
}