import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "../../styles/admin.css";

const AdminPanel = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("kickoff", { ascending: true });

      if (error) {
        console.error("Error fetching matches:", error);
      } else {
        setMatches(data);
      }

      setLoading(false);
    };

    fetchMatches();
  }, []);

  const handleScoreChange = (id, field, value) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === id
          ? {
              ...match,
              [field]: value,
            }
          : match,
      ),
    );
  };

  const saveResult = async (match) => {
    const { error } = await supabase
      .from("matches")
      .update({
        home_score: Number(match.home_score),
        away_score: Number(match.away_score),
        finished: true,
      })
      .eq("id", match.id);

    if (error) {
      console.error("Error updating result: ", error);
      alert("Kunde inte uppdatera resultat.");
      return;
    }
    alert("Resultat uppdaterat!");
  };

  if (loading) {
    return <p>Laddar matcher...</p>;
  }

  return (
    <section className="admin-section">
      <h1 className="admin-title">Admin Panel</h1>
      <div className="admin-matches">
        {matches.map((match) => (
          <div key={match.id} className="admin-match-card">
            <div className="admin-match-header">
              <h3>
                {match.home_team} vs {match.away_team}
              </h3>

              <span
                className={
                  match.finished
                    ? "match-status finished"
                    : "match-status pending"
                }
              >
                {match.finished ? "Finished" : "Pending"}
              </span>
            </div>

            <p className="group-name">Grupp {match.group_name}</p>

            <div className="score-inputs">
              <input
                type="number"
                min="0"
                value={match.home_score ?? ""}
                onChange={(e) =>
                  handleScoreChange(match.id, "home_score", e.target.value)
                }
              />

              <span className="score-divider">-</span>

              <input
                type="number"
                min="0"
                value={match.away_score ?? ""}
                onChange={(e) =>
                  handleScoreChange(match.id, "away_score", e.target.value)
                }
              />
              <button className="save-button" onClick={() => saveResult(match)}>
                Spara resultat
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default AdminPanel;
