// Hook för att hantera användarens tips.
// Laddar sparade predictions och bonussvar från Supabase.
// Hanterar även tip-selection och skickar tillbaka state till Speltipset.

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useUserTips({ user, participantId, setHasSubmitted }) {
  const [predictions, setPredictions] = useState({});

  const [bonusAnswers, setBonusAnswers] = useState({
    topScorer: "",
    topAssister: "",
    mostGoalsTeam: "",
    totalGoals: "",
  });

  const [loadingUserTips, setLoadingUserTips] = useState(true);

  useEffect(() => {
    const loadUserTips = async () => {
      const userOrParticipantId = participantId || user?.id;

      if (!userOrParticipantId) {
        setLoadingUserTips(false);
        return;
      }

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
          .eq(participantId ? "id" : "user_id", userOrParticipantId);

        if (error) {
          console.error(error);
          setLoadingUserTips(false);
          return;
        }

        if (participant) {
          if (!participantId) {
            setHasSubmitted(true);
          }

          const loadedPredictions = {};

          participant.predictions.forEach((p) => {
            loadedPredictions[p.match_id] = p.prediction.split("");
          });

          setPredictions(loadedPredictions);

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
        setLoadingUserTips(false);
      }
    };

    loadUserTips();
  }, [user, participantId, setHasSubmitted]);

  const handleTip = (matchId, value, hasSubmitted) => {
    if (hasSubmitted) return;

    setPredictions((prev) => {
      const currentTips = prev[matchId] || [];

      const alreadySelected = currentTips.includes(value);

      const updatedTips = alreadySelected
        ? currentTips.filter((tip) => tip !== value)
        : [...currentTips, value];

      if (updatedTips.length > 3) {
        return prev;
      }

      return {
        ...prev,
        [matchId]: updatedTips,
      };
    });
  };

  return {
    predictions,
    setPredictions,
    bonusAnswers,
    setBonusAnswers,
    handleTip,
    loadingUserTips,
  };
}
