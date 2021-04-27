// FinalScores
const userName = document.getElementById("username");
const scoreBtn = document.getElementById("scoreBtn");
const finalScore = document.getElementById("finalScore");
const pastScores = localStorage.getItem("pastScores");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
// number of highscores that will be saved in local storage
const NUMOFMAXHIGHSCORES = 10;

// final Score
finalScore.innerText = pastScores;

// Event listeners

userName.addEventListener("keyup", () => {
  // if value = null button is desabled
  scoreBtn.disabled = !userName.value;
});
scoreBtn.addEventListener("click", () => {
  saveHighScore(event);
});

// functions declared down :)
function saveHighScore(ev) {
  ev.preventDefault();
  const score = {
    score: pastScores,
    name: userName.value,
  };
  highScores.unshift(score);
  highScores.sort((aScore, bScore) => bScore.score - aScore.score);
  highScores.splice(NUMOFMAXHIGHSCORES);
  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("./final.html");
}
