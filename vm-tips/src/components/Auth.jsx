import { useState } from "react";
import "../styles/auth.css";
import { supabase } from "../lib/supabaseClient";

const Auth = ({ setUser }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { firstName: firstName, lastName: lastName } },
      });

      if (error) {
        setError(error.message);
        return;
      }
      setUser(data.user);
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }
    setUser(data.user);
  };

  return (
    <section className="auth">
      <div className="auth-card">
        <div className="auth-toggle">
          <button
            className={!isSignup ? "active" : ""}
            onClick={() => setIsSignup(false)}
            type="button"
          >
            Logga in
          </button>

          <button
            className={isSignup ? "active" : ""}
            onClick={() => setIsSignup(true)}
            type="button"
          >
            Skapa konto
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <>
              <input
                type="text"
                placeholder="Förnamn"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError("");
                }}
              />

              <input
                type="text"
                placeholder="Efternamn"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError("");
                }}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />

          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />
          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="submit-btn">
            {isSignup ? "Skapa konto" : "Logga in"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Auth;
