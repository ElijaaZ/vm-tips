import "../../styles/poängtabell.css";
import { useEffect, useState } from "react";
import Pagination from "../speltipset/Pagination";
import { supabase } from "../../lib/supabaseClient";
import { calculateMatchPoints } from "../../utils/calculatePoints";
import ParticipantTips from "./ParticipantTips";

const Poängtabell = ({ hasSubmitted }) => {
  const [openParticipantId, setOpenParticipantId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 15;

  useEffect(() => {
    if (!hasSubmitted) return; // gör inget om användaren inte har submitat

    // Definiera async-funktion inuti useEffect
    const fetchParticipants = async () => {
      try {
        // Hämta matcher
        const { data: matches, error: matchesError } = await supabase
          .from("matches")
          .select("*");
        if (matchesError) return console.error(matchesError);

        const actualTotalGoals = (matches || [])
          .filter((match) => match.finished === true)
          .reduce((sum, match) => {
            return sum + (match.home_score ?? 0) + (match.away_score ?? 0);
          }, 0);

        // Hämta alla participants
        const { data: participantsData, error: participantsError } =
          await supabase.from("participants").select("*");

        if (participantsError) return console.error(participantsError);
        if (!participantsData) return;

        // Beräkna poäng för varje participant
        const updatedParticipants = await Promise.all(
          participantsData.map(async (participant) => {
            // Hämta predictions för participant
            const { data: predictions } = await supabase
              .from("predictions")
              .select("*")
              .eq("participant_id", participant.id);

            const { data: bonusAnswers } = await supabase
              .from("bonus_answers")
              .select("total_goals")
              .eq("participant_id", participant.id)
              .single();

            const matchPoints = calculateMatchPoints(
              predictions || [],
              matches,
            );
            const bonusPoints = participant.bonus_points ?? 0;

            const guessedGoals = bonusAnswers?.total_goals ?? null;

            const goalDiff =
              guessedGoals !== null
                ? Math.abs(actualTotalGoals - guessedGoals)
                : Infinity;

            return {
              ...participant,
              match_points: matchPoints,
              bonus_points: bonusPoints,
              total_points: matchPoints + bonusPoints,
              guessed_goals: guessedGoals,
              goal_diff: goalDiff,
            };
          }),
        );

        // Uppdatera state EN gång efter alla async-beräkningar
        setParticipants(
          updatedParticipants.sort((a, b) => {
            if (b.total_points !== a.total_points) {
              return b.total_points - a.total_points;
            }

            return a.goal_diff - b.goal_goal_diff;
          }),
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchParticipants(); // Kör async-funktionen
  }, [hasSubmitted]);

  const sortedParticipants = [...participants].sort((a, b) => {
    if (b.total_points !== a.total_points) {
      return b.total_points - a.total_points;
    }

    return a.goal_diff - b.goal_diff;
  });

  const startIndex = (page - 1) * perPage;
  const visibleParticipants = sortedParticipants.slice(
    startIndex,
    startIndex + perPage,
  );
  const totalPages = Math.ceil(participants.length / perPage);

  // Om användaren inte submitat, rendera ingenting
  if (!hasSubmitted) return null;

  return (
    <section className="poängtabell">
      <h2>Poängtabell</h2>

      <p>
        Se hur alla ligger till i tävlingen. Klicka på ett namn för att se
        personens tips.
      </p>

      <div className="leaderboard">
        <div className="leaderboard-head">
          <div>#</div>
          <div>Namn</div>
          <div>Poäng</div>
        </div>

        {visibleParticipants.map((person, index) => {
          const isOpen = openParticipantId === person.id;

          return (
            <div key={person.id} className="leaderboard-item">
              <div
                className="leaderboard-header"
                onClick={() => setOpenParticipantId(isOpen ? null : person.id)}
              >
                <div className="rank">{startIndex + index + 1}</div>

                <div className="participant">
                  <span className={`arrow ${isOpen ? "open" : ""}`}>▼</span>
                  {person.first_name} {person.last_name}
                </div>

                <div className="points">
                  <strong>{person.total_points}p</strong>
                </div>
              </div>

              {isOpen && (
                <div className="leaderboard-dropdown">
                  <ParticipantTips participantId={person.id} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={() => setPage((page) => page - 1)}
        onNext={() => setPage((page) => page + 1)}
        startIndex={startIndex}
        visibleCount={visibleParticipants.length}
        totalCount={participants.length}
      />
    </section>
  );
};

export default Poängtabell;
