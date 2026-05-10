import { matches } from "../data/matches";
import "../styles/speltipset.css";
import { useState } from "react";

const MATCHES_PER_PAGE = 6;

const Speltipset = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(matches.length / MATCHES_PER_PAGE);
  const startIndex = (currentPage - 1) * MATCHES_PER_PAGE;
  const currentMatches = matches.slice(
    startIndex,
    startIndex + MATCHES_PER_PAGE,
  );
  return (
    <section className="speltipset">
      <h2>Speltipset</h2>
      <p className="speltipset-info">
        Tippa alla matcher och fyll i bonusfrågorna.
      </p>
      <div className="match-card">
        <h3>Gruppspelsmatcher</h3>
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
                  <button className="tip-btn">1</button>
                </td>
                <td>
                  <button className="tip-btn">X</button>
                </td>
                <td>
                  <button className="tip-btn">2</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((page) => page - 1)}
            disabled={currentPage === 1}
          >
            Föregående
          </button>

          <span>
            {startIndex + 1}–{startIndex + currentMatches.length} av{" "}
            {matches.length}
          </span>

          <button
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={currentPage === totalPages}
          >
            Nästa
          </button>
        </div>
      </div>
    </section>
  );
};

export default Speltipset;
