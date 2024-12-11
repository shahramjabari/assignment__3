// array of questions
let questions = [
  {
    question: "What is the capital of Japan?",
    options: ["Tokyo", "Beijing", "seoul", "bangkok"],
    answer: "Tokyo",
  },
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "What is the capital of Italy",
    options: ["Rome", "Venice", "Milan", "Bologna"],
    answer: "Rome",
  },
  {
    question: "What is the capital of Germany?",
    options: ["Berlin", "Munich", "Frankfurt", "Stuttgart"],
    answer: "Berlin",
  },
  {
    question: "What is the capital of Spain?",
    options: ["Madrid", "Barcelona", "Valencia", "Seville"],
    answer: "Madrid",
  },
  {
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    answer: "Delhi",
  },
  {
    question: "What is the capital of Australia?",
    options: ["Canberra", "Sydney", "Melbourne", "Brisbane"],
    answer: "Canberra",
  },
  {
    question: "What is the capital of Canada?",
    options: ["Ottawa", "Quebec", "Montreal", "Vancouver"],
    answer: "Ottawa",
  },
];

const quizContainer = document.querySelector(".quiz-container");
const question = document.querySelector(".quiz-container .question");
const options = document.querySelector(".quiz-container .options");
const nextQuestion = document.querySelector(".quiz-container .next-question");
const quizResult = document.querySelector(".quiz-result");

let questionNumber = 0; // Tracks the current question number.
let score = 0;
const CORRECT_BONUS = 100;
const MAX_QUESTIONS = 8;
let timer;

const randomQuestions = (array) => {
  // Shuffles the questions in random order.
  return array.slice().sort(() => Math.random() - 0.5);
};
questions = randomQuestions(questions); // Shuffle the questions at the start.

const resetLocalStorage = () => {
  // Clears any stored answers from a previous session.
  for (let i = 0; i < MAX_QUESTIONS; i++) {
    localStorage.removeItem(`userAnswer_${i}`);
  }
};

resetLocalStorage();

const checkAnswer = (e) => {
  // Checks if the selected answer is correct.
  let userAnswer = e.target.textContent;
  if (userAnswer === questions[questionNumber].answer) {
    score += CORRECT_BONUS;
    e.target.classList.add("correct");
  } else {
    e.target.classList.add("incorrect");
  }

  localStorage.setItem(`userAnswer_${questionNumber}`, userAnswer);

  // Disable all options after the user has selected one.
  let allOptions = document.querySelectorAll(".quiz-container .option");
  allOptions.forEach((option) => {
    option.classList.add("disabled");
  });

  updateScoreDisplay();
};

const updateScoreDisplay = () => {
  // Updates the score display if it exists.
  const ScoreDisplay = document.querySelector(".score");
  if (ScoreDisplay) {
    ScoreDisplay.textContent = score;
  }
};

const createQuestion = () => {
  // Displays the current question and options, and starts the timer.
  clearInterval(timer);

  let secondsLeft = 9;
  const timerContainer = document.querySelector(".quiz-container .timer");
  timerContainer.classList.remove("danger");
  timerContainer.textContent = `Time left: 10 seconds`;

  timer = setInterval(() => {
    timerContainer.textContent = `Time left: ${secondsLeft
      .toString()
      .padStart(2, 0)} seconds`;
    secondsLeft--;
    if (secondsLeft < 3) {
      timerContainer.classList.add("danger");
    }
    if (secondsLeft < 0) {
      clearInterval(timer);
      timerContainer.textContent = "Time's up! moving to the next question!";
      setTimeout(() => displayNextQuestion(), 2000);
    }
  }, 1000);

  options.textContent = "";
  question.textContent = "";

  const questionElement = document.createElement("span");
  questionElement.classList.add("current-question");
  questionElement.textContent = `${questionNumber + 1}/${MAX_QUESTIONS}`;
  question.append(questionElement);

  const questionText = document.createElement("h2");
  questionText.classList.add("question-text");
  questionText.textContent = questions[questionNumber].question;
  question.append(questionText);

  // Shuffle and display the options for the current question.
  const shuffledOptions = [...questions[questionNumber].options].sort(
    () => Math.random() - 0.5
  );

  shuffledOptions.forEach((option) => {
    const optionButtonElemnt = document.createElement("button");
    optionButtonElemnt.classList.add("option");
    optionButtonElemnt.textContent = option;
    optionButtonElemnt.addEventListener("click", (e) => {
      checkAnswer(e);
      clearInterval(timer);
    });
    options.append(optionButtonElemnt);
  });
};

const retakeQuiz = () => {
  // Resets the quiz for another attempt.
  questionNumber = 0;
  score = 0;

  updateScoreDisplay();

  questions = randomQuestions(questions);

  resetLocalStorage();

  createQuestion();

  quizResult.style.display = "none";
  quizContainer.style.display = "block";
};

const displayQuizResult = () => {
  // Displays the final quiz results.
  quizResult.style.display = "flex";
  quizContainer.style.display = "none";
  quizResult.textContent = "";

  const resultHeading = document.createElement("h2");
  resultHeading.textContent = ` You have scored ${score} out of 800 points`;
  quizResult.append(resultHeading);

  // go trough all questions in the array
  questions.forEach((question, index) => {
    const resultLastAnswer = document.createElement("div");
    resultLastAnswer.classList.add("question-container");

    // getting answer from local storage
    const userAnswer =
      localStorage.getItem(`userAnswer_${index}`) || "Not answered";
    const correctAnswer = question.answer;

    // correct or incorrect answer
    if (userAnswer === "Not answered") {
      resultLastAnswer.classList.add("unanswered");
    } else if (userAnswer === correctAnswer) {
      resultLastAnswer.classList.add("correct");
    } else {
      resultLastAnswer.classList.add("incorrect");
    }
    // user answer
    const questionText = document.createElement("div");
    questionText.classList.add("question");
    questionText.textContent = `Question ${index + 1}: ${question.question}`;
    resultLastAnswer.append(questionText);

    // right answer text
    const userAnswerText = document.createElement("div");
    userAnswerText.classList.add("correct-answer");
    userAnswerText.textContent = `Correct answer: ${correctAnswer}`;
    resultLastAnswer.append(userAnswerText);

    quizResult.append(resultLastAnswer);
  });
  // retake quiz button
  const retakeQuizButton = document.createElement("button");
  retakeQuizButton.classList.add("retake-quiz");
  retakeQuizButton.textContent = "Retake Quiz";
  retakeQuizButton.addEventListener("click", retakeQuiz);

  quizResult.append(retakeQuizButton);
};

createQuestion();

const displayNextQuestion = () => {
  // Moves to the next question or shows results if the quiz is over.
  if (questionNumber >= MAX_QUESTIONS - 1) {
    displayQuizResult();
    return;
  }
  questionNumber++;
  createQuestion();
};
nextQuestion.addEventListener("click", displayNextQuestion);
