// This function calculates the results based on the time remaining
function ResultsCalculator(timeRemaining) {
  // Round the time remaining to the nearest integer
  const rounded = Math.round(timeRemaining / 10);

  // Determine the result based on the rounded time remaining
  if (rounded > 5) {
    return "🟢🟢🟢🟢🟢🟢";
  } else if (rounded === 5) {
    return "🔴🟢🟢🟢🟢🟢";
  } else if (rounded === 4) {
    return "🔴🔴🟢🟢🟢🟢";
  } else if (rounded === 3) {
    return "🔴🔴🔴🟢🟢🟢";
  } else if (rounded === 2) {
    return "🔴🔴🔴🔴🟢🟢";
  } else if (rounded === 1) {
    return "🔴🔴🔴🔴🔴🟢";
  } else {
    return "🔴🔴🔴🔴🔴🔴";
  }
}

export default ResultsCalculator;