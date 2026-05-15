import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ParticipantTips = () => {
  const { id } = useParams();
  const [participant, setParticipant] = useState(null);
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [bonusAnswers, setBonusAnswers] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await supabase.from("matches").select("*").order("id");
      setMatches(data || []);
    };
    fetchMatches();
  }, []);

  useEffect(() => {
    const fetchParticipantTips = async () => {
      const { data: participantData, error } = await supabase
        .from("participants")
        .select(
          `id, first_name, last_name, predictions (match_id, prediction),bonus_answers (top_scorer, top_assister, most_goals_team, total_goals)`,
        )
        .eq("id", id)
        .single();

      if (error) return console.error(error);
      setParticipant(participantData);

      const loadedPredictions = {};
      participantData.predictions.forEach((p) => {
        loadedPredictions[p.match_id] = p.prediction.split("");
      });
      setPredictions(loadedPredictions);

      if (participantData.bonus_answers?.length > 0) {
        setBonusAnswers(participantData.bonus_answers[0]);
      }
    };
    fetchParticipantTips();
  }, [id]);

  // ✅ Ett return för hela komponenten
  return (
    <section className="participant-tips-section">
      {!participant || !matches.length ? (
        <p>Laddar...</p>
      ) : (
        <>
          <h2>
            Tips från {participant.first_name} {participant.last_name}
          </h2>

          {bonusAnswers && (
            <div>
              <h3>Bonusfrågor</h3>
              <div className="bonus-answers">
                <p>
                  <strong>Top scorer:</strong> {bonusAnswers.top_scorer}
                </p>
                <p>
                  <strong>Top assister:</strong> {bonusAnswers.top_assister}
                </p>
                <p>
                  <strong>Most goals team:</strong>{" "}
                  {bonusAnswers.most_goals_team}
                </p>
                <p>
                  <strong>Total goals:</strong> {bonusAnswers.total_goals}
                </p>
              </div>
            </div>
          )}
          <div className="match-card">
            <table className="match-table">
              <thead>
                <tr>
                  <th>Match</th>
                  <th>1</th>
                  <th>X</th>
                  <th>2</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id}>
                    <td>
                      {match.home_team} <span className="vs">vs</span>{" "}
                      {match.away_team}
                    </td>
                    {["1", "X", "2"].map((v) => (
                      <td key={v} style={{ textAlign: "center" }}>
                        {predictions[match.id]?.includes(v) ? "✔️" : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default ParticipantTips;
