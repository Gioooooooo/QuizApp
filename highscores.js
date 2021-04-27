const highScoresList = document.getElementById("highScoresList");
// saved as Array if highScores unable to be found
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores
  .map((score) => {
    return `<li class="highScore">${score.name} - ${score.score}</li>`;
  })
  .join("");
