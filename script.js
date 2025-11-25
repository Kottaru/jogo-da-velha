const cells = document.querySelectorAll(".cell");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let currentPlayer = "X";
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

  // empate
  if ([...cells].every(cell => cell.textContent !== "")) {
    statusEl.textContent = "Empate!";
    gameOver = true;
  }
}

cells.forEach(cell => {
  cell.addEventListener("click", () => {
    if (gameOver) return; // bloqueia se acabou
    if (cell.textContent !== "") return; // bloqueia spam

    cell.textContent = currentPlayer;
    cell.classList.add("taken");

    checkWinner();

    if (!gameOver) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusEl.textContent = `Vez do jogador ${currentPlayer}`;
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
  statusEl.textContent = "Vez do jogador X";
});
