import "../styles/bonus.css";

const BonusAnswers = ({ bonusAnswers, setBonusAnswers, hasSubmitted }) => {
  return (
    <section className="bonus">
      <h3>Bonusfrågor</h3>

      <div className="bonus-grid">
        <div className="bonus-field">
          <label>Skyttekung</label>
          <input
            disabled={hasSubmitted}
            value={bonusAnswers.topScorer}
            onChange={(e) =>
              setBonusAnswers({ ...bonusAnswers, topScorer: e.target.value })
            }
            placeholder="T.ex Kylian Mbappé"
          />
        </div>

        <div className="bonus-field">
          <label>Assistkung</label>
          <input
            disabled={hasSubmitted}
            value={bonusAnswers.topAssister}
            onChange={(e) =>
              setBonusAnswers({ ...bonusAnswers, topAssister: e.target.value })
            }
            placeholder="T.ex Lamine Yamal"
          />
        </div>

        <div className="bonus-field">
          <label>Lag som gör flest mål</label>
          <input
            disabled={hasSubmitted}
            value={bonusAnswers.mostGoalsTeam}
            onChange={(e) =>
              setBonusAnswers({
                ...bonusAnswers,
                mostGoalsTeam: e.target.value,
              })
            }
            placeholder="T.ex Frankrike"
          />
        </div>

        <div className="bonus-field">
          <label>Totalt antal mål i gruppspelet</label>
          <input
            disabled={hasSubmitted}
            value={bonusAnswers.totalGoals}
            onChange={(e) =>
              setBonusAnswers({
                ...bonusAnswers,
                totalGoals: e.target.value,
              })
            }
            placeholder="T.ex 120"
          />
        </div>
      </div>
    </section>
  );
};

export default BonusAnswers;
