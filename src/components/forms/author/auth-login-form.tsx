"use client";
import {Mail,Lock,Eye,EyeOff} from "lucide-react";

export function AuthLoginForm() {
    return(
        <div>
            <section>
            <form id="author-login">
                <h2>Author Login</h2>

                <label>
                    <Mail size={18} style={{display:'inline',marginRight:'8px'}}/> Email</label>
                <input type="email" name="email" required/>

                <label>
                    <Lock size={18} style={{display:'inline',marginRight:'8px'}}/> Password</label>
                <input type="password" name="password" required/>

                <div className="remember-forgot">
                    <label><input type="checkbox" name="rememberMe" />Remember Me</label>
                    <a href="/forgot-password">Forgot Password?</a>
                </div>

                <button type="submit">Login</button>
                
                <div className="register-link">
                    <p>Don't have an account? <a href="/register">Register here</a></p>
                </div>
            </form>
            </section>
        </div>
    );
}