"use client";

export function AuthRegisterForm() { 
    return(
        <div>
            <form id="author-register-form">
                <h2>Author Registration</h2>

                <label>Full Name</label>
                <input type="text" name="fullName" required/>

                <label>Email</label>
                <input type="email" name="email" required/>

                <label>Password</label>
                <input type="password" name="password" required/>

                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" required/>

                <label>Institution / Affiliation</label>
                <input type="text" name="institution"/>

                <label>ORCID / Research ID (optional)</label>
                <input type="text" name="orcid"/>

                <button type="submit">Register</button>
            </form>

        </div>
    );
}