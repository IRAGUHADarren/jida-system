"use client";

export function ResetPasswordForm() {
    return(
        <div>
            <form id="reset-password">
                <h2>Reset Password</h2>

                <label>Email</label>
                <input type="email" name="email" required/>

                <button type="submit">Send Reset Link</button>
            </form>

        </div>
    );
}