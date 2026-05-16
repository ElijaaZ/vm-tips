const TipsSummary = ({ rakaTips, halvgarderingar, helgarderingar }) => {
  return (
    <div className="tips-summary">
      <h3>Gruppspelsmatcher</h3>

      <div className="tips-counts">
        <p>Raka tips: {rakaTips}</p>
        <p>Halvgarderingar: {halvgarderingar} / 6</p>
        <p>Helgarderingar: {helgarderingar} / 3</p>
      </div>
    </div>
  );
};

export default TipsSummary;
