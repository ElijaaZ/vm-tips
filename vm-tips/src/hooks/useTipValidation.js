// Hook för att validera användarens tips.
// Räknar raka tips, halv-/helgarderingar och om formuläret är giltigt.
// Returnerar värdena till Speltipset.

export function useTipValidation(predictions, bonusAnswers, matches) {
  const allTips = Object.values(predictions);

  const allBonusAnswered = Object.values(bonusAnswers).every(
    (answer) => answer.trim() !== "",
  );

  const helgarderingar = allTips.filter((tips) => tips.length === 3).length;
  const halvgarderingar = allTips.filter((tips) => tips.length === 2).length;
  const rakaTips = allTips.filter((tips) => tips.length === 1).length;

  const filledMatches = allTips.filter((tips) => tips.length > 0).length;

  const isValid =
    allBonusAnswered &&
    filledMatches === matches.length &&
    halvgarderingar === 6 &&
    helgarderingar === 3;

  return {
    allTips,
    allBonusAnswered,
    helgarderingar,
    halvgarderingar,
    rakaTips,
    filledMatches,
    isValid,
  };
}
