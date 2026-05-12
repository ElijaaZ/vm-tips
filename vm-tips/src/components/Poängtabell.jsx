import "../styles/poängtabell.css";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { supabase } from "../lib/supabaseClient";
import { calculateMatchPoints } from "../utils/calculatePoints";

const Poängtabell = ({ onSelectParticipant }) => {
  const [participants, setParticipants] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 15;

  useEffect(() => {
    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .order("total_points", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setParticipants(data);
    };

    fetchParticipants();
  }, []);

  const sortedParticipants = [...participants].sort(
    (a, b) => b.total_points - a.total_points,
  );

  const startIndex = (page - 1) * perPage;
  const visibleParticipants = sortedParticipants.slice(
    startIndex,
    startIndex + perPage,
  );
  const totalPages = Math.ceil(participants.length / perPage);

  const updateAllPoints = async () => {
    const { data: participants, error: participantsError } = await supabase
      .from("participants")
      .select("*");

    if (participantsError) {
      console.error(participantsError);
      return;
    }

    const updatedParticipants = [];

    for (const participant of participants) {
      const { data: predictions, error: predictionsError } = await supabase
        .from("predictions")
        .select("*")
        .eq("participant_id", participant.id);

      if (predictionsError) {
        console.error(predictionsError);
        continue;
      }

      console.log("Predictions:", predictions);

      const matchPoints = calculateMatchPoints(predictions);
      const bonusPoints = participant.bonus_points ?? 0;
      const totalPoints = matchPoints + bonusPoints;

      const { data: updatedParticipant, error: updateError } = await supabase
        .from("participants")
        .update({
          match_points: matchPoints,
          total_points: totalPoints,
        })
        .eq("id", participant.id)
        .select()
        .single();

      if (updateError) {
        console.error(updateError);
        continue;
      }

      updatedParticipants.push(updatedParticipant);
    }

    setParticipants(updatedParticipants);

    alert("Poängen är uppdaterade!");
  };
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
              <tr key={person.id} onClick={() => onSelectParticipant(person)}>
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
      <button type="button" onClick={updateAllPoints}>
        Uppdatera poäng
      </button>
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
