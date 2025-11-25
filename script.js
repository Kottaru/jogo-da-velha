const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

function createBoard() {
  board.innerHTML = "";
  gameState.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.index = index;
    div.textContent = cell;
    if (cell) div.classList.add(cell);
    div.addEventListener("click", handlePlayerClick);
    board.appendChild(div);
  });
}

function handlePlayerClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || gameState[index] !== "") return;

  // Jogador (X)
  gameState[index] = "X";
  updateBoard();

  if (checkWin("X")) {
    statusText.textContent = "Você venceu! 🎉";
    gameActive = false;
    return;
  }
  if (isDraw()) {
    statusText.textContent = "Empate 🤝";
    gameActive = false;
    return;
  }

  // Bot (O) joga automaticamente
  statusText.textContent = "Bot pensando...";
  setTimeout(botMove, 500);
}

function botMove() {
  if (!gameActive) return;
  // Escolhe uma posição aleatória vazia
  const emptyIndices = gameState.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  if (emptyIndices.length === 0) return;
  const choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  gameState[choice] = "O";
  updateBoard();

  if (checkWin("O")) {
    statusText.textContent = "Bot venceu! 🤖";
    gameActive = false;
    return;
  }
  if (isDraw()) {
    statusText.textContent = "Empate 🤝";
    gameActive = false;
    return;
  }

  statusText.textContent = "Sua vez (X)";
}

function updateBoard() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = gameState[i];
    cell.className = "cell";
    if (gameState[i]) cell.classList.add(gameState[i]);
  });
}

function checkWin(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => {
    const [a,b,c] = pattern;
    return gameState[a] === player && gameState[b] === player && gameState[c] === player;
  });
}

function isDraw() {
  return gameState.every(cell => cell !== "");
}

resetBtn.addEventListener("click", () => {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  statusText.textContent = "Sua vez (X)";
  createBoard();
});

createBoard();
