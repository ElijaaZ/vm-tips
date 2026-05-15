export const calculateMatchPoints = (predictions, matches) => {
  let points = 0;

  predictions.forEach((prediction) => {
    const match = matches.find((m) => m.id === prediction.match_id);

    if (!match || !match.finished) return;

    let result;

    if (match.home_score > match.away_score) {
      result = "1";
    } else if (match.home_score < match.away_score) {
      result = "2";
    } else {
      result = "X";
    }

    if (prediction.prediction.includes(result)) {
      points += 1;
    }
  });
  return points;
};
