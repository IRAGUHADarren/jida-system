"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      
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
        <ul>
          <li>
            <Link href="/signin">
              <Button >Sign In</Button>
            </Link>
          </li>
          <li>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </li>
        </ul>
      </nav>
      <h1 className="text-4xl font-bold mb-8">Welcome to Jida System</h1>
    </main>
  );
}
