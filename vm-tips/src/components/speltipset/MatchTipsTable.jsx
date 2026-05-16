const MatchTipsTable = ({
  currentMatches,
  predictions,
  hasSubmitted,
  handleTip,
}) => {
  return (
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
            <td className="td-gray">
              {new Date(match.kickoff).toLocaleDateString("sv-SE")}
            </td>
            <td className="td-gray">{match.kickoff.slice(11, 16)}</td>
            <td className="td-gray">{match.group_name}</td>
            <td>
              {match.home_team} <span className="vs">vs</span> {match.away_team}
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
  );
};
export default MatchTipsTable;
