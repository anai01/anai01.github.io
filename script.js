let deckId;
let cardValues = [];
let cardImages = [];
let currentIndex = 0;
let score = 0;
let highScore = 0;

const cardImg = document.getElementById("card");
const startGameBtn = document.getElementById("start-game");
const higherBtn = document.getElementById("higher");
const lowerBtn = document.getElementById("lower");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");

async function initializeGame() {
  const response = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/"
  );
  const data = await response.json();
  deckId = data.deck_id;

  const cardResponse = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=10`
  );
  const cardData = await cardResponse.json();
  cardValues = cardData.cards.map((card) => getValue(card.value));
  cardImages = cardData.cards.map((card) => card.image);

  console.log(`Initial Next Card Value: ${cardValues[0]}`);
  console.log(`Initial Current Card Value: 0`);
}

function getValue(cardValue) {
  switch (cardValue) {
    case "KING":
      return 14;
    case "QUEEN":
      return 13;
    case "JACK":
      return 12;
    case "ACE":
      return 11;
    default:
      return parseInt(cardValue);
  }
}

async function startGame() {
  cardImg.src = cardImages[currentIndex];

  startGameBtn.style.display = "none";
  higherBtn.style.display = "inline-block";
  lowerBtn.style.display = "inline-block";
}

async function drawCard() {
  const cardResponse = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
  );
  const cardData = await cardResponse.json();
  cardValues.push(getValue(cardData.cards[0].value));
  cardImages.push(cardData.cards[0].image);
}

async function guess(higher) {
  currentIndex++;

  if (currentIndex >= cardValues.length - 1) {
    await drawCard();
  }

  const guessedCardValue = cardValues[currentIndex];
  const previousCardValue = cardValues[currentIndex - 1];

  if (
    (higher && guessedCardValue >= previousCardValue) ||
    (!higher && guessedCardValue <= previousCardValue)
  ) {
    score++;
    if (score > highScore) {
      highScore = score;
      highScoreDisplay.textContent = highScore;
    }
    console.log("Correct guess! Score:", score);
  } else {
    score = 0;
    console.log("Incorrect guess. Score reset to 0.");
  }

  cardImg.src = cardImages[currentIndex];

  scoreDisplay.textContent = score;

  console.log(`New Current Card Value: ${cardValues[currentIndex]}`);
  console.log(`New Next Card Value: ${cardValues[currentIndex + 1]}`);
}

initializeGame();

startGameBtn.addEventListener("click", startGame);
higherBtn.addEventListener("click", () => guess(true));
lowerBtn.addEventListener("click", () => guess(false));
