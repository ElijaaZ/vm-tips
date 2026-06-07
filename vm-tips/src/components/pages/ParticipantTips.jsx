import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const ParticipantTips = ({ participantId }) => {
  const { id } = useParams();
  const activeId = participantId ?? id;
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
        .eq("id", activeId)
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
    if (activeId) fetchParticipantTips();
  }, [activeId]);

  return (
    <section className="participant-tips-section">
      {!participant || !matches.length ? (
        <p className="tips-loading">Laddar...</p>
      ) : (
        <>
          {bonusAnswers && (
            <div className="bonus-panel">
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

          <div className="tips-grid">
            {matches.map((match) => {
              const selected = predictions[match.id] || [];

              return (
                <div key={match.id} className="tip-match-card">
                  <div className="tip-match-info">
                    <strong>
                      {match.home_team} – {match.away_team}
                    </strong>
                    <span>{match.date || match.match_date}</span>
                  </div>

                  <div className="tip-options">
                    {["1", "X", "2"].map((v) => (
                      <span
                        key={v}
                        className={selected.includes(v) ? "selected" : ""}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default ParticipantTips;
