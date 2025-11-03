// Função de atalho para `document.querySelector`, facilitando a seleção de elementos no DOM.
export const $ = (s) => document.querySelector(s);

// Objeto que armazena referências para todas as telas (seções) do jogo.
export const screens = {
  start: $("#start-screen"),
  board: $("#board-screen"),
  problem: $("#problem-screen"),
  ods: $("#ods-screen"),
  result: $("#result-screen"),
  final: $("#final-screen"),
};

// Constantes para o layout do tabuleiro, facilitando a manutenção do visual.
const BOARD_SPACE_SIZE = 70;
const BOARD_HORIZONTAL_GAP = 10;

// Função para mostrar uma tela específica e esconder as outras.
export function showScreen(screenName) {
  Object.values(screens).forEach((s) => {
    s.classList.remove("active");
  });
  screens[screenName].classList.add("active");
}

// Anima a contagem de um número de um valor 'from' para 'to'. Usado nos placares.
export function animateCount(el, to) {
  let from = parseInt(el.textContent) || 0;
  if (from === to) return;
  const duration = 500;
  const frameDuration = 1000 / 60;
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;

  const counter = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    const current = from + (to - from) * progress;
    el.textContent = Math.round(current);

    if (frame === totalFrames) clearInterval(counter);
  }, frameDuration);
}

// Função genérica para renderizar uma lista de opções clicáveis (ex: problemas, ODS).
export function renderOptions(containerSelector, items, htmlFn, clickFn) {
  const list = $(containerSelector);
  list.innerHTML = "";
  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerHTML = htmlFn(item);
    div.onclick = () => clickFn(item);
    div.style.animationDelay = `${index * 50}ms`;
    list.appendChild(div);
  });
}

// Atualiza a tela de "Problema" com os dados do bioma selecionado.
export function updateProblemScreen(biome) {
  $("#biome-title").textContent = biome.name;
  $("#biome-desc").textContent = biome.desc;
  const problemScreenCard = screens.problem.querySelector(".card");
  problemScreenCard.style.backgroundImage = `url(${
    biome.img || "img/default.jpg"
  })`;
  problemScreenCard.classList.add("has-bg");
}

// Atualiza a tela de "ODS" com os dados do problema selecionado.
export function updateODSScreen(problem) {
  $("#problem-title").textContent = problem.name;
  $("#problem-desc").textContent = problem.desc;
}

// Atualiza a tela de "Resultado" após o jogador escolher um ODS.
export function updateResultScreen(state, points) {
  const { biome, problem, ods } = state.current;
  $(
    "#choice-summary"
  ).innerHTML = `${biome.name} → ${problem.name}<br>Você escolheu <strong>${ods.title}</strong>`;
  animateCount($("#round-score"), points);
  animateCount($("#total-score"), state.total);
  $("#continue-game-btn").focus();
}

// Atualiza a barra de progresso do jogo no tabuleiro.
export function updateProgress(state) {
  const total = state.board.length - 1;
  const done = state.playerPosition;
  const pct = (done / total) * 100;
  $("#progress-bar").style.width = pct + "%";
}

// Mostra a tela final com o placar, uma mensagem e o resumo das jogadas.
export function showFinalScreen(state, allBiomes) {
  const max = allBiomes.length * 40;
  const pct = (state.total / max) * 100;
  let msg = pct > 80 ? "Excelente! 🌟" : "Bom trabalho! Continue aprendendo 🌿";
  const resumo = state.rounds
    .map(
      (r) =>
        `• ${r.biome.name} — ${r.problem.name} → ${r.ods.title} (+${r.ods.points})`
    )
    .join("<br>");
  $("#final-score").textContent = state.total;
  $(
    "#final-text"
  ).innerHTML = `${msg}<br><br><strong>Resumo:</strong><br>${resumo}`;
  showScreen("final");
}

// Renderiza o tabuleiro do jogo, criando as casas (espaços).
export function renderBoard(state, allBiomes) {
  const boardEl = $("#game-board");
  // Limpa o tabuleiro e adiciona o peão do jogador.
  boardEl.innerHTML = '<div id="player-pawn" class="player-pawn">🚀</div>';

  state.board.forEach((space, index) => {
    const spaceEl = document.createElement("div");
    spaceEl.className = "board-space";

    // Posiciona cada casa horizontalmente.
    spaceEl.style.left = `${
      index * (BOARD_SPACE_SIZE + BOARD_HORIZONTAL_GAP)
    }px`;

    if (space.type === "start") {
      spaceEl.classList.add("start");
      spaceEl.innerHTML = "🏁<small>Início</small>";
    } else if (space.type === "finish") {
      spaceEl.classList.add("finish");
      spaceEl.innerHTML = "🏆<small>Fim</small>";
    } else if (space.type === "biome") {
      const biome = allBiomes.find((b) => b.id === space.id);
      spaceEl.innerHTML = `${biome ? biome.emoji : "❓"}<small>${
        biome ? biome.name : "???"
      }</small>`;
    } else if (space.type === "special") {
      spaceEl.classList.add("special");
      spaceEl.innerHTML = "⭐<small>Bônus</small>";
    }
    boardEl.appendChild(spaceEl);
  });

  // Define a posição inicial do peão e do placar.
  updatePawnPosition(state);
  scrollBoardToPlayer(state.playerPosition); // Garante que o scroll comece na posição 0
  $("#board-total-score").textContent = state.total;
}

// Atualiza a posição visual do peão no tabuleiro.
export function updatePawnPosition(state) {
  const pawnEl = $("#player-pawn");
  // Calcula a nova posição 'left' do peão com base na sua posição no array do tabuleiro.
  const newLeft =
    state.playerPosition * (BOARD_SPACE_SIZE + BOARD_HORIZONTAL_GAP) +
    BOARD_SPACE_SIZE / 2;

  pawnEl.style.left = `${newLeft}px`;
  // Rola o tabuleiro para manter o peão visível.
  scrollBoardToPlayer(state.playerPosition);
}

// Rola a visualização do tabuleiro para manter o peão do jogador centralizado.
export function scrollBoardToPlayer(playerPosition) {
  const boardContainer = $(".board-container");
  const playerPixelPosition =
    playerPosition * (BOARD_SPACE_SIZE + BOARD_HORIZONTAL_GAP);
  const containerWidth = boardContainer.offsetWidth;

  // Calcula a posição de scroll para centralizar o jogador.
  const scrollTo =
    playerPixelPosition - containerWidth / 2 + BOARD_SPACE_SIZE / 2;
  // Usa a API `scrollTo` com comportamento 'smooth' para uma rolagem suave.
  boardContainer.scrollTo({ left: scrollTo, behavior: "smooth" });
}

export function animateDiceRoll(roll) {
  const dice = $("#dice");
  // Remove classes de resultado anteriores e adiciona a animação
  dice.className = "dice rolling";

  // Após a animação, define a face correta a ser mostrada
  setTimeout(() => {
    dice.classList.remove("rolling");
    dice.classList.add(`show-${roll}`);
  }, 1000); // Deve corresponder à duração da animação
}

// Renderiza a lista de temas (biomas) na tela inicial, com checkboxes para seleção.
export function renderThemeSelection(allBiomes) {
  const themeListEl = $("#theme-list");
  themeListEl.innerHTML = "";
  allBiomes.forEach((biome) => {
    const itemEl = document.createElement("label");
    itemEl.className = "theme-item";

    let deleteBtnHtml = "";
    if (biome.custom) {
      // Adiciona um botão de apagar apenas para temas personalizados.
      deleteBtnHtml = `<button class="delete-theme-btn" data-id="${biome.id}" title="Apagar tema">❌</button>`;
    }
    itemEl.innerHTML = `<input type="checkbox" value="${biome.id}" ${
      biome.checked ? "checked" : ""
    }> <span>${biome.emoji} ${biome.name}</span> ${deleteBtnHtml}`;

    // Adiciona feedback visual (classe 'selected') quando um tema é selecionado.
    const checkbox = itemEl.querySelector('input[type="checkbox"]');
    if (checkbox.checked) itemEl.classList.add("selected");
    checkbox.addEventListener("change", () => {
      itemEl.classList.toggle("selected", checkbox.checked);
    });
    themeListEl.appendChild(itemEl);
  });
}

// Retorna um array com os IDs dos temas que foram selecionados pelo jogador.
export function getSelectedThemes() {
  return Array.from($("#theme-list").querySelectorAll("input:checked")).map(
    (input) => input.value
  );
}
