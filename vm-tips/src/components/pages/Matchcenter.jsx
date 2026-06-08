import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "../../styles/matchcenter.css";
import ReactCountryFlag from "react-country-flag";

const countryCodes = {
  Mexiko: "MX",
  Sydafrika: "ZA",
  Sydkorea: "KR",
  Tjeckien: "CZ",
  Kanada: "CA",
  "Bosnien och Hercegovina": "BA",
  USA: "US",
  Paraguay: "PY",
  Qatar: "QA",
  Schweiz: "CH",
  Brasilien: "BR",
  Marocko: "MA",
  Haiti: "HT",
  Skottland: "GB-SCT",
  Australien: "AU",
  Turkiet: "TR",
  Tyskland: "DE",
  Curaçao: "CW",
  Nederländerna: "NL",
  Japan: "JP",
  Elfenbenskusten: "CI",
  Ecuador: "EC",
  Sverige: "SE",
  Tunisien: "TN",
  Belgien: "BE",
  Egypten: "EG",
  Iran: "IR",
  "Nya Zeeland": "NZ",
  Spanien: "ES",
  "Kap Verde": "CV",
  Saudiarabien: "SA",
  Uruguay: "UY",
  Frankrike: "FR",
  Irak: "IQ",
  Norge: "NO",
  Senegal: "SN",
  Algeriet: "DZ",
  Argentina: "AR",
  Jordanien: "JO",
  Österrike: "AT",
  Colombia: "CO",
  "DR Kongo": "CD",
  Portugal: "PT",
  Uzbekistan: "UZ",
  England: "GB",
  Ghana: "GH",
  Kroatien: "HR",
  Panama: "PA",
};

const Matchcenter = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("id");

      if (error) {
        console.error(error);
        return;
      }

      setMatches(data || []);
    };

    fetchMatches();
  }, []);

  const finishedMatches = matches.filter((match) => match.finished === true);

  const totalGoals = finishedMatches.reduce((sum, match) => {
    return sum + match.home_score + match.away_score;
  }, 0);

  const groupTables = {};

  matches.forEach((match) => {
    const group = match.group_name || "Övrigt";

    if (!groupTables[group]) {
      groupTables[group] = {};
    }

    [match.home_team, match.away_team].forEach((teamName) => {
      if (!groupTables[group][teamName]) {
        groupTables[group][teamName] = {
          team: teamName,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        };
      }
    });

    if (match.finished !== true) return;

    const home = groupTables[group][match.home_team];
    const away = groupTables[group][match.away_team];

    home.played += 1;
    away.played += 1;

    home.goalsFor += match.home_score;
    home.goalsAgainst += match.away_score;

    away.goalsFor += match.away_score;
    away.goalsAgainst += match.home_score;

    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;

    if (match.home_score > match.away_score) {
      home.wins += 1;
      home.points += 3;

      away.losses += 1;
    } else if (match.home_score < match.away_score) {
      away.wins += 1;
      away.points += 3;

      home.losses += 1;
    } else {
      home.draws += 1;
      away.draws += 1;

      home.points += 1;
      away.points += 1;
    }
  });

  const sortedGroups = Object.entries(groupTables).sort(([a], [b]) =>
    a.localeCompare(b, "sv"),
  );

  return (
    <section className="matchcenter">
      <h2>Matchcenter</h2>

      <div className="total-goals-card">
        <h3>Totalt antal mål</h3>
        <strong>{totalGoals}</strong>
      </div>

      <div className="groups-grid">
        {sortedGroups.map(([groupName, teams]) => {
          const sortedTeams = Object.values(teams).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;

            if (b.goalDifference !== a.goalDifference) {
              return b.goalDifference - a.goalDifference;
            }

            if (b.goalsFor !== a.goalsFor) {
              return b.goalsFor - a.goalsFor;
            }

            return a.team.localeCompare(b.team, "sv");
          });

          return (
            <div key={groupName} className="group-table-card">
              <div className="group-card-header">
                <h3>Grupp {groupName}</h3>
                <span>{sortedTeams.length} lag</span>
              </div>

              <table className="group-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Lag</th>
                    <th>S</th>
                    <th>+/-</th>
                    <th>P</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedTeams.map((team, index) => (
                    <tr key={team.team}>
                      <td>{index + 1}</td>
                      <td className="team-name">
                        <ReactCountryFlag
                          countryCode={countryCodes[team.team]}
                          svg
                          style={{
                            width: "18px",
                            height: "18px",
                            marginRight: "8px",
                          }}
                        />
                        {team.team}
                      </td>
                      <td>{team.played}</td>
                      <td>{team.goalDifference}</td>
                      <td>
                        <strong>{team.points}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Matchcenter;
