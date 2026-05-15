import "./App.css";
import AppHeader from "./components/AppHeader";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import Speltipset from "./components/Speltipset";
import Regler from "./components/Regler";
import Poängtabell from "./components/Poängtabell";
import Auth from "./components/Auth";
import { supabase } from "./lib/supabaseClient";
import { Routes, Route } from "react-router-dom";
import ParticipantTips from "./components/ParticipantTips";

function App() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <AppHeader handleLogout={handleLogout} />
      <Navbar />

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
        </Routes>
      </main>
    </div>
  );
}

export default App;
