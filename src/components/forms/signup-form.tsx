"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/lib/services/user-service";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const styles = {
  container: "w-full max-w-md",
  header: "space-y-1",
  title: "text-3xl font-bold text-blue-500",
  content: "space-y-4",
  fieldGroup: "space-y-2",
  footer: "flex flex-col",
  button: "w-full",
  prompt: "mt-4 text-center text-sm",
  link: "ml-2 text-blue-500",
};

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await userService.createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      router.push('/signin');
    } catch (err) {
      setError("Failed to create account. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button className={styles.button} type="submit">Sign Up</Button>
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Have an account?
          <Link className={styles.link} href="signin">
            Sign In
          </Link>
        </div>
        <div className="mt-2 text-center text-sm">
          <Link href="/" className={styles.link}>
            Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}