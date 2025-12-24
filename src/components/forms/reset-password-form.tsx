"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestPasswordReset, confirmPasswordReset } from "@/lib/api";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(token!, newPassword);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return (
      <div>
        <section>
          <form id="reset-password" onSubmit={handleConfirmReset}>
            <h1>Reset Password</h1>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Password reset successfully! Redirecting...</p>}
            <div className="inputbox">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="inputbox">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section>
        <form id="reset-password" onSubmit={handleRequestReset}>
          <h1>Reset Password</h1>
          <p style={{ color: "white" }}>Enter your email address and we will send you a reset link.</p>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Reset link sent! Check your email.</p>}
          <div className="inputbox">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </section>
    </div>
  );
}
