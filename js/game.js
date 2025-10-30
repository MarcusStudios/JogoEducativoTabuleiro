import { DATA as initialData } from "./data.js";
import {
  $,
  showScreen,
  animateCount,
  renderOptions,
  updateProblemScreen,
  updateODSScreen,
  updateResultScreen,
  updateProgress,
  showFinalScreen,
  renderBoard,
  updatePawnPosition,
  animateDiceRoll,
  renderThemeSelection,
  getSelectedThemes,
} from "./ui.js";

// Clonar os dados para não modificar o objeto original importado
let allGameData = JSON.parse(JSON.stringify(initialData));

// ===================== ESTADO DO JOGO =====================
let state = {
  selectedThemes: [],
  board: [],
  playerPosition: 0,
  total: 0,
  current: {},
  rounds: [],
};

// ===================== SOM SIMPLES =====================
let ctx;

function beep(f = 440, t = 0.05) {
  if (!window.AudioContext) return;
  if (!ctx) ctx = new AudioContext();

  const o = ctx.createOscillator();
  const g = ctx.createGain();

  o.frequency.value = f;
  g.gain.value = 0.02;

  o.connect(g);
  g.connect(ctx.destination);
  o.start();

  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t);
  o.stop(ctx.currentTime + t + 0.01);
}

// ===================== INICIALIZAÇÃO =====================
function init() {
  state.selectedThemes = getSelectedThemes();
  if (state.selectedThemes.length === 0) {
    alert("Por favor, selecione pelo menos um tema para jogar!");
    return;
  }
  state.total = 0;
  state.rounds = [];
  state.playerPosition = 0;

  generateBoard();
  renderBoard(state, allGameData.biomes);
  showScreen("board");
}

// ===================== ETAPA 1 - ESCOLHA DO BIOMA =====================
function selectBiome(id) {
  const b = allGameData.biomes.find((x) => x.id === id);
  if (!b) {
    console.error(`Bioma com id "${id}" não encontrado!`);
    return;
  }
  state.current.biome = b;

  updateProblemScreen(b);

  renderOptions(
    "#problem-list",
    allGameData.problems,
    (p) => `<strong>${p.name}</strong><br><small>${p.desc}</small>`,
    (p) => selectProblem(p) // p é o objeto completo do problema
  );

  showScreen("problem");
}

// ===================== ETAPA 2 - ESCOLHA DO PROBLEMA =====================
function selectProblem(p) {
  state.current.problem = p;
  updateODSScreen(p);

  renderOptions(
    "#ods-list",
    allGameData.ods,
    (o) =>
      `<div><strong>${o.title}</strong></div><small>${o.desc}</small><div class="points">+${o.points}</div>`,
    (o) => selectODS(o) // o é o objeto completo do ODS
  );

  showScreen("ods");
}

// ===================== ETAPA 3 - ESCOLHA DO ODS =====================
function selectODS(odsObject) {
  state.current.ods = odsObject;
  beep(800, 0.1);

  // Atualiza progresso
  state.rounds.push({
    biome: state.current.biome,
    problem: state.current.problem,
    ods: odsObject,
  });

  state.total += odsObject.points;

  updateResultScreen(state, odsObject.points);
  updateProgress(state);
  showScreen("result");
}

// ===================== CONTINUAR JOGO =====================
function continueGame() {
  console.log(
    '[DEBUG] Habilitando botão "Jogar Dado" (após tela de resultado).'
  );
  $("#roll-dice-btn").disabled = false;
  // CORREÇÃO DA PONTUAÇÃO: Atualiza o placar do tabuleiro ao voltar.
  animateCount($("#board-total-score"), state.total);
  showScreen("board");
}

// ===================== LÓGICA DO TABULEIRO =====================
function generateBoard() {
  const boardSize = state.selectedThemes.length * 2 + 3;
  state.board = [];
  state.board.push({ type: "start" });

  let themeIndex = 0;
  for (let i = 1; i < boardSize - 1; i++) {
    if (i % 2 !== 0 && themeIndex < state.selectedThemes.length) {
      state.board.push({ type: "biome", id: state.selectedThemes[themeIndex] });
      themeIndex++;
    } else {
      state.board.push({ type: "special", event: "bonus" }); // Pode adicionar mais eventos
    }
  }
  state.board.push({ type: "finish" });
}

function rollDice() {
  console.log('[DEBUG] Desabilitando botão "Jogar Dado" (ao ser clicado).');
  $("#roll-dice-btn").disabled = true;
  // O tabuleiro é curto, um dado de 1 a 3 parece mais equilibrado.
  const roll = Math.floor(Math.random() * 3) + 1;
  animateDiceRoll(roll);
  movePlayer(roll);
}

function movePlayer(steps) {
  state.playerPosition += steps;
  if (state.playerPosition >= state.board.length - 1) {
    state.playerPosition = state.board.length - 1;
  }
  updatePawnPosition(state);
  setTimeout(triggerSpaceEvent, 800);
}

function triggerSpaceEvent() {
  const currentSpace = state.board[state.playerPosition];
  if (currentSpace.type === "biome") {
    selectBiome(currentSpace.id);
  } else if (currentSpace.type === "finish") {
    showFinalScreen(state, allGameData.biomes);
  } else {
    // Para casas 'start' ou 'special', apenas habilita o dado novamente
    if (currentSpace.type === "special") {
      beep(900, 0.08);
      state.total += 10; // Bônus de 10 pontos
      animateCount($("#board-total-score"), state.total);
    }
    console.log(
      `[DEBUG] Habilitando botão "Jogar Dado" (após evento da casa '${currentSpace.type}').`
    );
    $("#roll-dice-btn").disabled = false;
  }
}

// ===================== SELEÇÃO E CRIAÇÃO DE TEMAS =====================
function loadThemes() {
  const customBiomes = JSON.parse(localStorage.getItem("customBiomes")) || [];
  // Recria a lista de biomas a partir da fonte original + customizados
  allGameData.biomes = [...initialData.biomes, ...customBiomes].map(
    (biome) => ({
      ...biome,
      // Marca todos os biomas como checados por padrão ao carregar
      // Isso pode ser ajustado para carregar do localStorage se houver uma seleção prévia
      checked: true,
    })
  );
  renderThemeSelection(allGameData.biomes);
}

function saveNewTheme(event) {
  event.preventDefault();
  const name = $("#theme-name").value;
  const desc = $("#theme-desc").value;
  const emoji = $("#theme-emoji").value;
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  const newTheme = {
    id,
    name,
    desc,
    emoji,
    img: "img/default.jpg",
    custom: true,
  };

  const customThemes = JSON.parse(localStorage.getItem("customBiomes")) || [];
  customThemes.push(newTheme);
  localStorage.setItem("customBiomes", JSON.stringify(customThemes));

  loadThemes();
  $("#create-theme-modal").style.display = "none";
}

function deleteTheme(themeId) {
  if (
    !confirm(
      "Tem certeza que deseja apagar este tema? Esta ação não pode ser desfeita."
    )
  ) {
    return;
  }

  // 1. Pega os temas do localStorage
  let customThemes = JSON.parse(localStorage.getItem("customBiomes")) || [];

  // 2. Filtra, removendo o tema com o ID correspondente
  customThemes = customThemes.filter((theme) => theme.id !== themeId);

  // 3. Salva a lista atualizada de volta no localStorage
  localStorage.setItem("customBiomes", JSON.stringify(customThemes));

  // 4. Recarrega a lista de temas na UI
  loadThemes();
}

// ===================== CONTROLE DE MÚSICA =====================
function setupMusicControls() {
  const musicEl = $("#background-music");
  const musicToggleBtn = $("#music-toggle-btn");
  let isMusicPlaying = false;

  function toggleMusic() {
    if (isMusicPlaying) {
      musicEl.pause();
      musicToggleBtn.textContent = "🔇";
    } else {
      musicEl.play();
      musicToggleBtn.textContent = "🎵";
    }
    isMusicPlaying = !isMusicPlaying;
  }
  musicToggleBtn.onclick = toggleMusic;
}

// ===================== EVENTOS =====================
document.addEventListener("DOMContentLoaded", () => {
  loadThemes();
  setupMusicControls();
  showScreen("start");

  // Função para resetar para a tela inicial e garantir que o botão do dado esteja habilitado
  function goToStartScreen() {
    $("#roll-dice-btn").disabled = false;
    showScreen("start");
  }

  $("#start-btn").onclick = init;
  $("#roll-dice-btn").onclick = rollDice;

  // Botões que levam de volta ao início
  $("#board-back-btn").onclick = goToStartScreen;
  $("#play-again").onclick = goToStartScreen;

  $("#problem-back").onclick = () => showScreen("board");
  $("#ods-back").onclick = () => showScreen("problem");
  $("#continue-game-btn").onclick = continueGame;

  // Eventos do Modal
  $("#create-theme-btn").onclick = () =>
    ($("#create-theme-modal").style.display = "flex");
  $("#cancel-theme-btn").onclick = () =>
    ($("#create-theme-modal").style.display = "none");
  $("#create-theme-form").onsubmit = saveNewTheme;

  // Delegação de evento para os botões de apagar tema
  $("#theme-list").addEventListener("click", (event) => {
    if (event.target.matches(".delete-theme-btn")) {
      deleteTheme(event.target.dataset.id);
    }
  });
});
