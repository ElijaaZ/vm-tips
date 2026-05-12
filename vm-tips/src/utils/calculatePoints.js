import { matches } from "../data/matches";

export const calculateMatchPoints = (predictions) => {
  let points = 0;

  predictions.forEach((prediction) => {
    const match = matches.find((m) => m.id === prediction.match_id);

    if (!match || !match.result) return;

    if (prediction.prediction.includes(match.result)) {
      points += 1;
    }
  });
  return points;
};
