import "../../styles/speltipset.css";
import { useState } from "react";
import Pagination from "../../components/speltipset/Pagination";
import { supabase } from "../../lib/supabaseClient";
import BonusAnswers from "../../components/speltipset/BonusAnswers";
import MatchTipsTable from "../../components/speltipset/MatchTipsTable";
import TipsSummary from "../../components/speltipset/TipsSummary";
import { useMatches } from "../../hooks/useMatches";
import { useTipValidation } from "../../hooks/useTipValidation";
import { useUserTips } from "../../hooks/useUserTips";

const Speltipset = ({ user, hasSubmitted, setHasSubmitted, participantId }) => {
  const [, setParticipantId] = useState(null);
  const { matches, loadingMatches, matchesError } = useMatches();
  const {
    predictions,
    bonusAnswers,
    setBonusAnswers,
    handleTip,
    loadingUserTips,
  } = useUserTips({
    user,
    participantId,
    setHasSubmitted,
  });
  const { helgarderingar, halvgarderingar, rakaTips, isValid } =
    useTipValidation(predictions, bonusAnswers, matches);

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

  if (loadingMatches || loadingUserTips) {
    return <p>Laddar speltipset...</p>;
  }

  if (matchesError) {
    return <p>Kunde inte ladda matcher.</p>;
  }
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
          Du har redan skickat in ditt tips.
          <br /> Du kan nu bara se dina svar.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <BonusAnswers
          bonusAnswers={bonusAnswers}
          setBonusAnswers={setBonusAnswers}
          hasSubmitted={hasSubmitted}
        />
        <div className="match-card">
          <TipsSummary
            rakaTips={rakaTips}
            halvgarderingar={halvgarderingar}
            helgarderingar={helgarderingar}
          />

          <MatchTipsTable
            currentMatches={currentMatches}
            predictions={predictions}
            hasSubmitted={hasSubmitted}
            handleTip={handleTip}
          />

          <div className="bottom-section">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() => setPage((page) => page - 1)}
              onNext={() => setPage((page) => page + 1)}
              startIndex={startIndex}
              visibleCount={currentMatches.length}
              totalCount={matches.length}
            />
            {!hasSubmitted && (
              <button type="submit" className="submit-btn" disabled={!isValid}>
                Skicka in tips
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default Speltipset;
