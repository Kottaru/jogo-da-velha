const cells = document.querySelectorAll(".cell");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let currentPlayer = "X"; // humano
let gameOver = false;

function checkWinner() {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8], // linhas
    [0,3,6],[1,4,7],[2,5,8], // colunas
    [0,4,8],[2,4,6]          // diagonais
  ];

  for (let combo of combos) {
    const [a,b,c] = combo;
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    ) {
      statusEl.textContent = `Jogador ${cells[a].textContent} venceu!`;
      gameOver = true;
      return;
    }
  }

  if ([...cells].every(cell => cell.textContent !== "")) {
    statusEl.textContent = "Empate!";
    gameOver = true;
  }
}

function botMove() {
  if (gameOver) return;

  // escolhe célula vazia aleatória
  const emptyCells = [...cells].filter(c => c.textContent === "");
  if (emptyCells.length === 0) return;

  const choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  choice.textContent = "O";
  choice.classList.add("taken");

  checkWinner();

  if (!gameOver) {
    currentPlayer = "X";
    statusEl.textContent = "Sua vez (X)";
  }
}

cells.forEach(cell => {
  cell.addEventListener("click", () => {
    if (gameOver) return;
    if (cell.textContent !== "") return;
    if (currentPlayer !== "X") return; // só humano joga X

    cell.textContent = "X";
    cell.classList.add("taken");

    checkWinner();

    if (!gameOver) {
      currentPlayer = "O";
      statusEl.textContent = "Bot pensando...";
      setTimeout(botMove, 500); // bot joga após meio segundo
    }
  });
});

resetBtn.addEventListener("click", () => {
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });
  currentPlayer = "X";
  gameOver = false;
  statusEl.textContent = "Sua vez (X)";
});
