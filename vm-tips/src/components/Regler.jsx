import "../styles/regler.css";
import {
  Trophy,
  Goal,
  CheckCircle,
  ClipboardCheck,
  CircleHelp,
  Send,
  Crown,
} from "lucide-react";

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
              <ClipboardCheck size={28} />
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
              <Goal size={28} />
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
                För varje match väljer du ett av tre alternativ. Du har även 3
                helgarderingar och 6 halvgarderingar.
              </p>
              <div className="tips-list">
                <div className="tip-item">
                  <div className="tip-circle">1</div>
                  <p>Hemmalaget vinner</p>
                </div>

                <div className="tip-item">
                  <div className="tip-circle">X</div>
                  <p>Oavgjort</p>
                </div>

                <div className="tip-item">
                  <div className="tip-circle">2</div>
                  <p>Bortalaget vinner</p>
                </div>
              </div>
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
          <div className="rule-card medium">
            <div className="rule-content">
              <div className="icon-wrapper">
                <CircleHelp size={28} />
              </div>

              <div className="text-wrapper">
                <h3>Bonusfrågorna</h3>
                <p>
                  Du kan tjäna extra poäng genom att svara på bonusfrågorna.
                  Varje bonusfråga ger 3 poäng.
                </p>
                <ul className="bonus-lista">
                  <li>Vem vinner VM?</li>
                  <li>Vem blir turneringens skyttekung?</li>
                  <li>Vem blir turneringens assistkung?</li>
                  <li>Vilket lag gör flest mål?</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="rule-card medium">
            <div className="rule-content">
              <div className="icon-wrapper">
                <Send size={28} />
              </div>

              <div className="text-wrapper">
                <h3>Inlämning</h3>

                <div className="check-row">
                  <CheckCircle color="green" size={20} />
                  <p>Ditt tips måste lämnas in innan första matchstart.</p>
                </div>

                <div className="check-row">
                  <CheckCircle color="green" size={20} />
                  <p>
                    När du har lämnat in ditt tips kan du inte göra några
                    ändringar.
                  </p>
                </div>

                <div className="check-row">
                  <CheckCircle color="green" size={20} />
                  <p>Se till att dubbelkolla alla dina tips!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rule-card wide">
          <div className="rule-content">
            <div className="icon-wrapper">
              <Crown size={28} />
            </div>

            <div className="text-wrapper">
              <h3>Vinnaren</h3>
              <p>
                Den som har flest poäng när alla gruppspelsmatcher är spelade
                vinner. <br />
                Vid lika poäng avgörs placeringen av en extra bonusfråga: <br />{" "}
                <strong style={{ color: "black" }}>
                  Hur många totala mål blir det i turneringens
                  gruppspelsmatcher?
                </strong>
              </p>
              <h3>LYCKA TILL!</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Regler;
