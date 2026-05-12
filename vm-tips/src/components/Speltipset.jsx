import { matches } from "../data/matches";
import "../styles/speltipset.css";
import { useState } from "react";
import Pagination from "./Pagination";
import { supabase } from "../lib/supabaseClient";

const Speltipset = () => {
  const [predictions, setPredictions] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bonusAnswers, setBonusAnswers] = useState({
    winner: "",
    topScorer: "",
    topAssister: "",
    mostGoalsTeam: "",
    totalGoals: "",
  });

  const allTips = Object.values(predictions);
  const allBonusAnswered = Object.values(bonusAnswers).every(
    (answer) => answer.trim() !== "",
  );
  const helgarderingar = allTips.filter((tips) => tips.length === 3).length;
  const halvgarderingar = allTips.filter((tips) => tips.length === 2).length;
  const rakaTips = allTips.filter((tips) => tips.length === 1).length;

  const isValid =
    firstName.trim() &&
    lastName.trim() &&
    allBonusAnswered &&
    Object.keys(predictions).length === matches.length &&
    halvgarderingar === 6 &&
    helgarderingar === 3;

  const handleTip = (matchId, value) => {
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
        first_name: firstName.trim(),
        last_name: lastName.trim(),
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
      winner: bonusAnswers.winner.trim(),
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

    setFirstName("Test");
    setLastName("Person");
    setBonusAnswers({
      winner: "Spanien",
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
      <p className="speltipset-info">
        Tippa alla matcher och fyll i bonusfrågorna.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Förnamn"
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Efternamn"
        />
        <input
          value={bonusAnswers.winner}
          onChange={(e) =>
            setBonusAnswers({ ...bonusAnswers, winner: e.target.value })
          }
          placeholder="Vilka vinner VM?"
        />
        <input
          value={bonusAnswers.topScorer}
          onChange={(e) =>
            setBonusAnswers({ ...bonusAnswers, topScorer: e.target.value })
          }
          placeholder="Skyttekung?"
        />
        <input
          value={bonusAnswers.topAssister}
          onChange={(e) =>
            setBonusAnswers({ ...bonusAnswers, topAssister: e.target.value })
          }
          placeholder="Assistkung?"
        />
        <input
          value={bonusAnswers.mostGoalsTeam}
          onChange={(e) =>
            setBonusAnswers({ ...bonusAnswers, mostGoalsTeam: e.target.value })
          }
          placeholder="Vilket lag gör flest mål?"
        />
        <input
          value={bonusAnswers.totalGoals}
          onChange={(e) =>
            setBonusAnswers({ ...bonusAnswers, totalGoals: e.target.value })
          }
          placeholder="Hur många mål blir det totalt i gruppspelet?"
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
                  <td>{match.date}</td>
                  <td>{match.time}</td>
                  <td>{match.group}</td>
                  <td>
                    {match.homeTeam} <span className="vs">vs</span>{" "}
                    {match.awayTeam}
                  </td>
                  <td>
                    <button
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
            <button type="submit" className="submit-btn" disabled={!isValid}>
              Submit
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Speltipset;
