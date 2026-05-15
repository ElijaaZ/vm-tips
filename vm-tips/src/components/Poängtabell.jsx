import "../styles/poängtabell.css";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { supabase } from "../lib/supabaseClient";
import { calculateMatchPoints } from "../utils/calculatePoints";
import ParticipantTips from "./ParticipantTips";
import { useNavigate } from "react-router-dom";

const Poängtabell = ({ hasSubmitted }) => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
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

            const matchPoints = calculateMatchPoints(
              predictions || [],
              matches,
            );
            const bonusPoints = participant.bonus_points ?? 0;

            return {
              ...participant,
              match_points: matchPoints,
              total_points: matchPoints + bonusPoints,
            };
          }),
        );

        // Uppdatera state EN gång efter alla async-beräkningar
        setParticipants(
          updatedParticipants.sort((a, b) => b.total_points - a.total_points),
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchParticipants(); // Kör async-funktionen
  }, [hasSubmitted]);

  const sortedParticipants = [...participants].sort(
    (a, b) => b.total_points - a.total_points,
  );

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
      <div className="tabell-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Namn</th>
              <th>Bonus</th>
              <th>Matchtips</th>
              <th>Totalpoäng</th>
            </tr>
          </thead>
          <tbody>
            {visibleParticipants.map((person, index) => (
              <tr
                key={person.id}
                onClick={() => navigate(`/tips/${person.id}`)}
              >
                <td>{startIndex + index + 1}</td>
                <td>
                  {person.first_name} {person.last_name}
                </td>
                <td>{person.bonus_points}p</td>
                <td>{person.match_points}p</td>
                <td>
                  <strong>{person.total_points}p</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      {selectedParticipant && (
        <ParticipantTips
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
        />
      )}
    </section>
  );
};

export default Poängtabell;
