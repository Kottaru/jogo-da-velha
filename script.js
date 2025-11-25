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

  // 1. Se o bot pode vencer, faz isso
  let move = findBestMove("O");
  // 2. Se o jogador pode vencer na próxima, bloqueia
  if (move === null) move = findBestMove("X");
  // 3. Senão, escolhe aleatório
  if (move === null) {
    const emptyIndices = gameState.map((v, i) => v === "" ? i : null).filter(i => i !== null);
    move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  gameState[move] = "O";
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

function findBestMove(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const pattern of winPatterns) {
    const [a,b,c] = pattern;
    const values = [gameState[a], gameState[b], gameState[c]];
    // Se duas casas são do player e a terceira está vazia → jogada vencedora/bloqueio
    if (values.filter(v => v === player).length === 2 && values.includes("")) {
      return pattern[values.indexOf("")];
    }
  }
  return null;
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
