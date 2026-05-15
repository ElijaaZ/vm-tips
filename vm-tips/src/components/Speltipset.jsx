import "../styles/speltipset.css";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { supabase } from "../lib/supabaseClient";
import BonusAnswers from "./BonusAnswers";

const Speltipset = ({ user, hasSubmitted, setHasSubmitted, participantId }) => {
  const [predictions, setPredictions] = useState({});
  const [, setParticipantId] = useState(null);
  const [, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [bonusAnswers, setBonusAnswers] = useState({
    topScorer: "",
    topAssister: "",
    mostGoalsTeam: "",
    totalGoals: "",
  });

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("id");

      if (error) {
        console.error(error);
        return;
      }

      setMatches(data);
    };
    fetchMatches();
  }, []);

  useEffect(() => {
    const loadUserTips = async () => {
      // Bestäm vilken participant vi ska hämta
      const userOrParticipantId = participantId || user?.id;
      if (!userOrParticipantId) return;

      try {
        const { data: participant, error } = await supabase
          .from("participants")
          .select(
            `
          id,
          submitted_at,
          predictions (
            match_id,
            prediction
          ),
          bonus_answers (
            top_scorer,
            top_assister,
            most_goals_team,
            total_goals
          )
        `,
          )
          .maybeSingle()
          // Om participantId skickas används id, annars user_id
          .eq(participantId ? "id" : "user_id", userOrParticipantId);

        if (error) {
          console.error(error);
          setLoading(false);
          return;
        }

        if (participant) {
          // Om vi visar en annan participant ska vi inte ändra hasSubmitted
          if (!participantId) setHasSubmitted(true);
          setParticipantId(participant.id);

          // Ladda predictions i samma format som tidigare
          const loadedPredictions = {};
          participant.predictions.forEach((p) => {
            loadedPredictions[p.match_id] = p.prediction.split("");
          });
          setPredictions(loadedPredictions);

          // Ladda bonusfrågorna
          const bonus = participant.bonus_answers?.[0];
          if (bonus) {
            setBonusAnswers({
              topScorer: bonus.top_scorer,
              topAssister: bonus.top_assister,
              mostGoalsTeam: bonus.most_goals_team,
              totalGoals: String(bonus.total_goals),
            });
          }
        }
      } catch (err) {
        console.error("Kunde inte ladda participant:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserTips();
  }, [user, participantId]);

  const allTips = Object.values(predictions);
  const allBonusAnswered = Object.values(bonusAnswers).every(
    (answer) => answer.trim() !== "",
  );
  const helgarderingar = allTips.filter((tips) => tips.length === 3).length;
  const halvgarderingar = allTips.filter((tips) => tips.length === 2).length;
  const rakaTips = allTips.filter((tips) => tips.length === 1).length;

  const filledMatches = Object.values(predictions).filter(
    (tips) => tips.length > 0,
  ).length;
  const isValid =
    allBonusAnswered &&
    filledMatches === matches.length &&
    halvgarderingar === 6 &&
    helgarderingar === 3;

  const handleTip = (matchId, value) => {
    if (hasSubmitted) return;
    setPredictions((prev) => {
      const currentTips = prev[matchId] || [];
      const alreadySelected = currentTips.includes(value);
      const updatedTips = alreadySelected
        ? currentTips.filter((tip) => tip !== value)
        : [...currentTips, value];

      if (updatedTips.length > 3) return prev;

      return {
        ...prev,
        [matchId]: updatedTips,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) return;

    const { data: participant, error: participantError } = await supabase
      .from("participants")
      .insert({
        user_id: user.id,
        first_name: user.user_metadata.firstName,
        last_name: user.user_metadata.lastName,
        submitted_at: new Date().toISOString(),
        match_points: 0,
        bonus_points: 0,
        total_points: 0,
      })
      .select()
      .single();

    if (participantError) {
      console.error(participantError);
      alert("Kunde inte spara deltagaren.");
      return;
    }
    const predictionRows = Object.entries(predictions).map(
      ([matchId, tips]) => ({
        participant_id: participant.id,
        match_id: Number(matchId),
        prediction: tips.join(""),
      }),
    );

    const { error: predictionsError } = await supabase
      .from("predictions")
      .insert(predictionRows);

    if (predictionsError) {
      console.error(predictionsError);
      alert("Kunde inte spara matchtipsen.");
      return;
    }

    const { error: bonusError } = await supabase.from("bonus_answers").insert({
      participant_id: participant.id,
      top_scorer: bonusAnswers.topScorer.trim(),
      top_assister: bonusAnswers.topAssister.trim(),
      most_goals_team: bonusAnswers.mostGoalsTeam.trim(),
      total_goals: Number(bonusAnswers.totalGoals),
    });

    if (bonusError) {
      console.error(bonusError);
      alert("Kunde inte spara bonusfrågorna.");
      return;
    }
    setHasSubmitted(true);
    setParticipantId(participant.id);
    alert("Tips skickat!");
  };

  const [page, setPage] = useState(1);
  const perPage = 6;
  const totalPages = Math.ceil(matches.length / perPage);
  const startIndex = (page - 1) * perPage;
  const currentMatches = matches.slice(startIndex, startIndex + perPage);

  const fillTestData = () => {
    const testPredictions = {};

    matches.forEach((match, index) => {
      if (index < 3) {
        testPredictions[match.id] = ["1", "X", "2"]; // 3 helgarderingar
      } else if (index < 9) {
        testPredictions[match.id] = ["1", "X"]; // 6 halvgarderingar
      } else {
        testPredictions[match.id] = ["1"]; // resten raka tips
      }
    });

    setBonusAnswers({
      topScorer: "Mbappe",
      topAssister: "Yamal",
      mostGoalsTeam: "Frankrike",
      totalGoals: "120",
    });
    setPredictions(testPredictions);
  };

  return (
    <section className="speltipset">
      <h2>Speltipset</h2>

      {!hasSubmitted && (
        <p className="speltipset-info">
          Tippa alla matcher och fyll i bonusfrågorna.
        </p>
      )}

      {hasSubmitted && (
        <p className="speltipset-info">
          Du har redan skickat in ditt tips. Du kan nu bara se dina svar.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <BonusAnswers
          bonusAnswers={bonusAnswers}
          setBonusAnswers={setBonusAnswers}
          hasSubmitted={hasSubmitted}
        />
        <div className="match-card">
          <div className="tips-summary">
            <h3>Gruppspelsmatcher</h3>
            <div className="tips-counts">
              <p>Raka tips: {rakaTips}</p>
              <p>Halvgarderingar: {halvgarderingar} / 6</p>
              <p>Helgarderingar: {helgarderingar} / 3</p>
            </div>
          </div>

          <table className="match-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Tid</th>
                <th>Grupp</th>
                <th>Match</th>
                <th>1</th>
                <th>X</th>
                <th>2</th>
              </tr>
            </thead>
            <tbody>
              {currentMatches.map((match) => (
                <tr key={match.id}>
                  <td>{new Date(match.kickoff).toLocaleDateString("sv-SE")}</td>
                  <td>{match.kickoff.slice(11, 16)}</td>
                  <td>{match.group_name}</td>
                  <td>
                    {match.home_team} <span className="vs">vs</span>{" "}
                    {match.away_team}
                  </td>
                  <td>
                    <button
                      disabled={hasSubmitted}
                      type="button"
                      className={`tip-btn ${
                        predictions[match.id]?.includes("1") ? "selected" : ""
                      }`}
                      onClick={() => handleTip(match.id, "1")}
                    >
                      1
                    </button>
                  </td>
                  <td>
                    <button
                      disabled={hasSubmitted}
                      type="button"
                      className={`tip-btn ${
                        predictions[match.id]?.includes("X") ? "selected" : ""
                      }`}
                      onClick={() => handleTip(match.id, "X")}
                    >
                      X
                    </button>
                  </td>
                  <td>
                    <button
                      disabled={hasSubmitted}
                      type="button"
                      className={`tip-btn ${
                        predictions[match.id]?.includes("2") ? "selected" : ""
                      }`}
                      onClick={() => handleTip(match.id, "2")}
                    >
                      2
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bottom-section">
            <div></div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() => setPage((page) => page - 1)}
              onNext={() => setPage((page) => page + 1)}
              startIndex={startIndex}
              visibleCount={currentMatches.length}
              totalCount={matches.length}
            />
            <button type="button" onClick={fillTestData}>
              Fyll testdata
            </button>
            {!hasSubmitted && (
              <button type="submit" className="submit-btn" disabled={!isValid}>
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default Speltipset;
