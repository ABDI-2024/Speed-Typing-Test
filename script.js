import { texts } from "./textDisplay.js";

//elements
const startTestBtn = document.querySelector("#start-btn");
const resetTestBtn = document.querySelector("#reset-btn");
const overlayElement = document.querySelector("#start-overlay");
const completionPopupTemplate = document.querySelector(
  "#completion-popup-template"
);
const containerElement = document.querySelector(".container");
const timerElement = document.querySelector("#timer");
const textDisplayContainer = document.querySelector("#text-display");

const errorsElement = document.querySelector("#errors");
const accuracyElement = document.querySelector("#accuracy");
const wpmElement = document.querySelector("#wpm");

const leterElements = [];

//   variables
let timer;
let seconds = 60;

const currentResult = [];
const allResult = [];
let Errors = 0;
let accuracy = 100;
let allWords = 0;

displayText();
function displayText() {
  textDisplayContainer.innerHTML = "";

  const randomIndex = Math.floor(Math.random() * texts.length);

  // const sampleText = "how are you";
  // const arrayText = sampleText.split("");

  const arrayText = texts[randomIndex].split("");

  arrayText.forEach((leter, index) => {
    const leterElement = document.createElement("span");

    leterElement.innerText = leter;

    if (index === 0) {
      leterElement.classList.add("current");
    }
    textDisplayContainer.appendChild(leterElement);
  });

  leterElements.push(...textDisplayContainer.children);
}

startTestBtn.addEventListener("click", () => {
  overlayElement.style.display = "none";
  resetTestBtn.disabled = false;
  startTestBtn.disabled = true;
  startTestBtn.classList.add("btn-secondary");
  resetTestBtn.classList.remove("btn-secondary");

  timerRunner();
  timer = setInterval(timerRunner, 10);

  document.addEventListener("keydown", handleInputEvent);
});

resetTestBtn.addEventListener("click", () => {
  clearInterval(timer);
  seconds = 60;
  timerElement.innerText = `01:00`;

  startOver();
});

function startOver() {
  seconds = 60;
  currentResult.length = 0;
  allResult.length = 0;
  leterElements.length = 0;
  displayText();

  overlayElement.style.display = "";
  resetTestBtn.disabled = true;
  startTestBtn.disabled = false;
  startTestBtn.classList.remove("btn-secondary");
  resetTestBtn.classList.add("btn-secondary");

  accuracyElement.innerText = "100%";
  errorsElement.innerText = "0";
  wpmElement.innerText = "0";

  document.removeEventListener("keydown", handleInputEvent);
}

function timerRunner() {
  seconds--;
  if (seconds < 10) {
    timerElement.innerText = `00:0${seconds}`;
  } else {
    timerElement.innerText = `00:${seconds}`;
  }

  if (seconds === 0) {
    const clone = completionPopupTemplate.content.cloneNode(true);
    const completionPopupElement = clone.querySelector("#completion-popup");
    const restartCompelationBtn = clone.querySelector("#restart-test-btn");

    const popupErrorsElement = clone.querySelector("#final-errors");
    const popupAccuracyElement = clone.querySelector("#final-accuracy");
    const popupWpmElement = clone.querySelector("#final-wpm");

    popupErrorsElement.innerText = Errors;
    popupAccuracyElement.innerText = accuracy.toFixed(1) + "%";
    popupWpmElement.innerText = allWords;

    document.removeEventListener("keydown", handleInputEvent);

    clearInterval(timer);

    containerElement.appendChild(clone);
    restartCompelationBtn.addEventListener("click", () => {
      containerElement.removeChild(completionPopupElement);
      timerElement.innerText = `01:00`;

      startOver();
    });
  }
}

function handleInputEvent(e) {
  if (e.key.length !== 1 && e.key !== "Backspace") return;

  const currentIndex = currentResult.length;

  if (e.key.length === 1) {
    currentResult.push({
      input: e.key,
      leter: leterElements[currentIndex].innerText,
      result: e.key === leterElements[currentIndex].innerText,
    });

    if (currentResult.length < leterElements.length) {
      leterElements[currentIndex + 1].classList.add("current");
      leterElements[currentIndex].classList.remove("current");
    }

    currentResult[currentIndex].result
      ? leterElements[currentIndex].classList.add("correct")
      : leterElements[currentIndex].classList.add("incorrect");

    if (currentResult.length === leterElements.length) {
      allResult.push(...currentResult);

      currentResult.length = 0;
      leterElements.length = 0;
      displayText();
    }
  } else {
    if (currentIndex > 0) {
      leterElements[currentIndex].classList.remove("current");
      leterElements[currentIndex - 1].classList.add("current");

      currentResult[currentIndex - 1].result
        ? leterElements[currentIndex - 1].classList.remove("correct")
        : leterElements[currentIndex - 1].classList.remove("incorrect");
    }

    currentResult.pop();
  }

  handleResults();
}

function handleResults() {
  const allResultErrors = allResult.filter((t) => t.result === false).length;
  const currentErrors = currentResult.filter((t) => t.result === false).length;

  const allResultCorrect = allResult.filter((t) => t.result === true).length;
  const currentCorrect = currentResult.filter((t) => t.result === true).length;
  const lengthForAccuracy = currentResult.length + allResult.length;

  const currenInput = currentResult.map((t) => t.input);
  const currentText = currenInput.join("");
  const allCurrentWords =
    currentText.match(/\S+/g) === null ? 0 : currentText.match(/\S+/g).length;

  const allResultInput = allResult.map((t) => t.input);
  const allResultText = allResultInput.join("");
  const allResultWords =
    allResultText.match(/\S+/g) === null
      ? 0
      : allResultText.match(/\S+/g).length;

  allWords = allResultWords + allCurrentWords;
  wpmElement.innerText = allWords;

  //   (allText.match(/\S+/g) === null ? 0 : allText.match(/\S+/g).length) +
  //   (currentText.match(/\S+/g) === null ? 0 : currentText.match(/\S+/g).length);
  // console.log(allWords);

  Errors = allResultErrors + currentErrors;
  errorsElement.innerText = Errors;

  accuracy = ((allResultCorrect + currentCorrect) / lengthForAccuracy) * 100;
  accuracyElement.innerText = accuracy.toFixed(1) + "%";
}

// allWords = allText.match(/\S+/g).length;
