// common variables
const question = document.getElementById("question");
const options = Array.from(document.getElementsByClassName("optionText"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const quiz = document.getElementById("quiz");
const questionCountNum = document.getElementById("questionCountNum");
const submit = document.getElementById("submit");
const questionNumCount = document.getElementById("questionNumCount");
const removdisplayNone = document.getElementById("removdisplayNone");
const selectCategory = document.getElementById("selectCategory");
const selectDifficulty = document.getElementById("selectDifficulty");
const removeContainer = document.getElementById("removeContainer");
const skip = document.getElementById("skip");
let currentQuestion = {};
let blockAnswers = false;
let score = 0;
let questionCounter = 0;
// Questions that can be aksed
let remainQuestions = [];
let questions = [];
let maxNumberOfQuestions = parseInt(questionCountNum.value);
let categoryValue = "21";
let difficultyValue = "1";
let numberOfEnterPresses = 1;
// add listener to keybord not to skip more than once
let sPressed = 0;
//CONSTANTS
const CORRECT_BONUS = 10;

// EventListeners

// Enter
window.addEventListener("keyup", checkKey, false);
// A
window.addEventListener("keyup", checkKey, false);
// B
window.addEventListener("keyup", checkKey, false);
// C
window.addEventListener("keyup", checkKey, false);
// D
window.addEventListener("keyup", checkKey, false);
// S
window.addEventListener("keyup", checkKey, false);
// Submit
submit.addEventListener("click", fetchApi, false);
// skip (once used)
skip.addEventListener("click", () => {
  skipQuestion();
});

// Options
options.forEach((option) => {
  option.addEventListener("click", (e) => {
    // If answers is blocked nothing is returned so that user cannot tap anything
    if (!blockAnswers) return;

    blockAnswers = false;
    const selectedoption = e.target;
    const selectedAnswer = selectedoption.dataset["number"];
    if (selectedAnswer == currentQuestion.answer) {
      classToApply = "true";
    } else {
      classToApply = "false";
    }

    // Score update if answer is true
    if (classToApply === "true") {
      plusScore(CORRECT_BONUS);
    }
    // Class aplied after answer
    selectedoption.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedoption.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 500);
  });
});

// Functions declarations down:)

// function for  eventlistener

function checkKey(key) {
  // enter
  if (key.keyCode == "13" && numberOfEnterPresses === 1) {
    // var numberOfEnterPresses is needed beecause if u press enter during game u will skip quiz questions so it disables this eventListener during questions
    numberOfEnterPresses++;
    fetchApi();
  }
  // A
  else if (key.keyCode == "65") {
    randomOptions(options[0]);
  }
  // B
  else if (key.keyCode == "66") {
    randomOptions(options[1]);
  }
  // C
  else if (key.keyCode == "67") {
    randomOptions(options[2]);
  }
  // D
  else if (key.keyCode == "68") {
    randomOptions(options[3]);
  } else if (key.keyCode == "83") {
    if (sPressed === 0) {
      skipQuestion();
      sPressed++;
    } else {
      return;
    }
  }
}

// Fetch api
function fetchApi() {
  removeContainer.classList.remove("container");

  const formatedQuestionCount = parseInt(questionCountNum.value);
  let optionValueOfCategery = selectCategory.value;
  categoryValue = optionValueOfCategery;
  let optionValueOfDificulty = selectDifficulty.value;
  difficultyValue = optionValueOfDificulty;
  url = `https://opentdb.com/api.php?amount=11&category=${categoryValue}&difficulty=${difficultyValue}&type=multiple`;

  if (formatedQuestionCount > 10 || formatedQuestionCount < 1) {
    alert("From 1 to 10");
  } else {
    maxNumberOfQuestions = formatedQuestionCount;
    progressText.innerText = `Question ${questionCounter}/${maxNumberOfQuestions}`;

    questionNumCount.classList.add("displayNone");
    removdisplayNone.classList.remove("displayNone");
  }
  // Fetch API
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((downdownloadedQuestions) => {
      questions = downdownloadedQuestions.results.map((downloadedQuestion) => {
        // Format questions that can be more precise and usable
        const formattedQuestion = {
          question: downloadedQuestion.question,
        };
        const answeroptions = [...downloadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
        answeroptions.splice(
          formattedQuestion.answer - 1,
          0,
          downloadedQuestion.correct_answer
        );
        answeroptions.forEach((option, index) => {
          formattedQuestion["option" + (index + 1)] = option;
        });
        return formattedQuestion;
      });
      startGame();
    })
    .catch((err) => {
      console.log(err);
    });
}

// Declaring common function that can be reused
function randomOptions(e) {
  if (!blockAnswers) return;

  blockAnswers = false;
  const selectedoption = e;

  const selectedAnswer = selectedoption.dataset["number"];
  let classToApply;

  if (selectedAnswer == currentQuestion.answer) {
    classToApply = "true";
  } else {
    classToApply = "false";
  }

  if (classToApply === "true") {
    plusScore(CORRECT_BONUS);
  }

  selectedoption.parentElement.classList.add(classToApply);

  setTimeout(() => {
    selectedoption.parentElement.classList.remove(classToApply);
    getNewQuestion();
  }, 500);
}

//  add score
function plusScore(scoreToPlus) {
  score += scoreToPlus;
  scoreText.innerText = score;
}

//  function With the game start
function startGame() {
  score = 0;
  // copying questions to manipulate as developer wants it :)
  remainQuestions = [...questions];
  getNewQuestion();
  quiz.classList.remove("displayNone");
  loader.classList.add("displayNone");
}

// Generate next Question
function getNewQuestion() {
  //
  if (remainQuestions.length === 0 || questionCounter >= maxNumberOfQuestions) {
    localStorage.setItem("pastScores", score);
    //go to the final page
    return window.location.assign("./final.html");
  }
  questionCounter++;
  // Updating progress bar and text base on question
  progressText.innerText = `Question ${questionCounter}/${maxNumberOfQuestions}`;
  //Update the progress bar
  progressBarFull.style.width = `${
    (questionCounter / maxNumberOfQuestions) * 100
  }%`;
  // randomizes questions
  const questionIndex = Math.floor(Math.random() * remainQuestions.length);
  currentQuestion = remainQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;
  // each option value defined so afterwards answers will be randomly distributed
  options.forEach((option) => {
    const number = option.dataset["number"];
    option.innerHTML = currentQuestion["option" + number];
  });
  // Remove question that was already asked
  remainQuestions.splice(questionIndex, 1);
  // Blocking user to tap on ansswers before everything is loaded
  blockAnswers = true;
}
// function skip

function skipQuestion() {
  questionCounter--;
  getNewQuestion();
  skip.disabled = true;
}
