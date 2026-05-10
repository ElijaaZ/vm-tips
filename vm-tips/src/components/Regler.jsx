import "../styles/regler.css";
import { Trophy } from "lucide-react";

const Regler = () => {
  return (
    <section className="regler">
      <h2>Regler</h2>
      <p className="regler-info">
        Här hittar du alla regler och hur poängsättningen går till i VM-tipset
        2026.
      </p>
      <div className="rules-grid">
        <div className="rule-card small">
          <div className="rule-content">
            <div className="icon-wrapper">
              <Trophy size={28} />
            </div>

            <div className="text-wrapper">
              <h3>Så går det till</h3>
              <p>
                Tippa resultatet i alla gruppspelsmatcher och svara på
                bonusfrågorna. Du får poäng baserat på hur många matcher du har
                rätt på och dina svar på bonusfrågorna.
              </p>
            </div>
          </div>
        </div>
        <div className="rule-card small">
          <div className="rule-content">
            <div className="icon-wrapper">
              <Trophy size={28} />
            </div>

            <div className="text-wrapper">
              <h3>Poängsystem</h3>
              <p>
                Du får 1 poäng för varje match du tippar rätt (1, X eller 2). Du
                kan tjäna extra poäng genom bonusfrågorna.
              </p>
              <div className="poängsystem">
                <p>Rätt matchtips</p>
                <p>1 poäng</p>
              </div>
              <div className="poängsystem">
                <p>Rätt bonusfråga</p>
                <p>3 poäng</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rule-card tall">
          <div className="rule-content">
            <div className="icon-wrapper">
              <Trophy size={28} />
            </div>

            <div className="text-wrapper">
              <h3>Så tippar du matcher</h3>
              <p>
                För varje match väljer du ett av tre alternativ. Du har även 4
                helgarderingar och 8 halvgarderingar.
              </p>
            </div>
          </div>
          <div className="exempel-box">
            <h5>
              Exempel <br />
              Match: Sverige - Tunisien
            </h5>
            <p>
              <strong>Tips: 1 -</strong> Du tror att Sverige vinner
            </p>
            <p>
              <strong>Utfallet: 1 - </strong> Du får 1 poäng (rätt tips)
            </p>
            <p>
              <strong>Utfallet: X eller 2 - </strong> Du får 0 poäng (fel tips)
            </p>
          </div>
        </div>

        <div className="right-column">
          <div className="rule-card medium"></div>
          <div className="rule-card medium"></div>
        </div>

        <div className="rule-card wide"></div>
      </div>
    </section>
  );
};

export default Regler;
