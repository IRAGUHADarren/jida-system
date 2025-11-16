"use client";
export function AuthLoginForm() {
    return(
        <div>
            <form id="author-login">
                <h2>Author Login</h2>

                <label>Email</label>
                <input type="email" name="email" required/>

                <label>Password</label>
                <input type="password" name="password" required/>

                <button type="submit">Login</button>
            </form>

        </div>
    );
}