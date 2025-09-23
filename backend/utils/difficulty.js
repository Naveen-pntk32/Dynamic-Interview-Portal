function predictNextDifficulty(averageScore) {
  if (averageScore < 0.4) return 'easy';
  if (averageScore <= 0.7) return 'medium';
  return 'hard';
}

module.exports = { predictNextDifficulty };


