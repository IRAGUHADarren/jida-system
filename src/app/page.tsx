"use client";

import Link from "next/link";
import Image from "next/image";
import { AuthRegisterForm } from "@/components/forms/author/auth-register-form";


export default function Home() {
  return (
    <main >
      
      <nav className="navbar">
        <div>
          <Image 
            src="/images/auca_logo.png" 
            alt="AUCA Logo"
            width={50}
            height={50}
            priority
          />
        </div>
      </nav>
      <h1 >Welcome to Jida System</h1>
      
    </main>
  );
}
