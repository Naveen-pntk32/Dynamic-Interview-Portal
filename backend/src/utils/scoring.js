function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreMcq(selectedAnswer, correctAnswer) {
  const ok = String(selectedAnswer || '').trim().toLowerCase() === String(correctAnswer || '').trim().toLowerCase();
  return ok ? 1 : 0;
}

function scoreText(answerText, keywords = []) {
  const norm = normalize(answerText);
  if (!keywords || !keywords.length) return { matchedKeywords: 0, totalKeywords: 0, score: 0 };
  let matched = 0;
  for (const kw of keywords) {
    if (norm.includes(normalize(kw))) matched += 1;
  }
  const score = matched / keywords.length;
  return { matchedKeywords: matched, totalKeywords: keywords.length, score };
}

module.exports = { normalize, scoreMcq, scoreText };


