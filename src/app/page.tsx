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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to the Journal of Inter Discourse Academia
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive platform for academic manuscript submission, review, and publication
        </p>
        <nav className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => router.push("/public")}>
            Browse Published Articles
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push("/register")}>
            Register
          </Button>
        </nav>
      </div>
    </main>
  );
}