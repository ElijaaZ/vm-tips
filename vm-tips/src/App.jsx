import "./App.css";
import AppHeader from "./components/layout/AppHeader";
import Navbar from "./components/layout/Navbar";
import { useEffect, useState } from "react";
import Speltipset from "./components/pages/Speltipset";
import Regler from "./components/pages/Regler";
import Poängtabell from "./components/pages/Poängtabell";
import Auth from "./components/auth/Auth";
import { supabase } from "./lib/supabaseClient";
import { Routes, Route, Navigate } from "react-router-dom";
import ParticipantTips from "./components/pages/ParticipantTips";
import AdminPanel from "./components/pages/AdminPanel";

function App() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <p>Laddar...</p>;
  }

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div>
      <AppHeader handleLogout={handleLogout} user={user} />
      <Navbar user={user} adminEmail={ADMIN_EMAIL} />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Speltipset
                user={user}
                hasSubmitted={hasSubmitted}
                setHasSubmitted={setHasSubmitted}
              />
            }
          />
          <Route
            path="/poangtabell"
            element={
              hasSubmitted ? (
                <Poängtabell hasSubmitted={hasSubmitted} />
              ) : (
                <p style={{ textAlign: "center", marginTop: "2rem" }}>
                  Du måste skicka in dina tips först för att se poängtabellen.
                </p>
              )
            }
          />
          <Route path="/regler" element={<Regler />} />
          <Route path="/tips/:id" element={<ParticipantTips />} />
          <Route
            path="/admin"
            element={
              user.email === ADMIN_EMAIL ? (
                <AdminPanel user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
